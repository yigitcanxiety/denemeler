import {
  AnalyzeRequestSchema,
  buildRenderPrompt,
  MAX_BODY_BYTES,
  mockAnalysisFor,
  mockSkinAnalysisFor,
  recommendLooks,
  RenderRequestSchema,
  type AnalyzeResponse,
  type HealthResponse,
  type RenderResponse,
  type SkinAnalyzeResponse,
} from '@tonelle/shared';
import { z } from 'zod';
import { getServerConfig, isAnalysisMock, isRenderMock, type ServerConfig } from './env';
import { HttpError } from './errors';
import { clientIp, errorResponse, handleError, jsonResponse, parseJsonBody, rateLimitedResponse, sleep } from './http';
import { createImageProvider } from './image-providers';
import { kieChatUrl, uploadToKie } from './kie';
import { analyzeFace, analyzeSkin, GEMINI_CHAT_URL, type OpenRouterOptions } from './openrouter';
import { analyzeRateLimiter, freeRenderRateLimiter, renderRateLimiter } from './rate-limit';
import { claimPurchase, consumeRender } from './paddle';
import { checkEntitlement } from './revenuecat';

const RedeemRequestSchema = z.object({ code: z.string().min(1).max(64) });
const ClaimRequestSchema = z.object({
  transactionId: z.string().regex(/^txn_[a-z0-9]{10,40}$/),
  appUserId: z.string().min(1).max(200),
});

/** POST /api/analyze */
export async function handleAnalyze(request: Request): Promise<Response> {
  try {
    const body = await parseJsonBody(request, AnalyzeRequestSchema, MAX_BODY_BYTES);
    if (!body.ok) return body.response;
    const { image, locale, quiz } = body.data;

    const limit = analyzeRateLimiter.check(`ip:${clientIp(request)}`);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);

    const config = getServerConfig();
    if (isAnalysisMock(config)) {
      if (config.mockDelayMs > 0) await sleep(config.mockDelayMs);
      const analysis = mockAnalysisFor(locale);
      const response: AnalyzeResponse = { analysis, recommendedLookIds: recommendLooks(analysis, quiz), mock: true };
      return jsonResponse(response);
    }

    const { analysis } = await analyzeFace({ imageDataUrl: image, locale, quiz, ...(await hostedImage(config, image)) }, analysisOptions(config));
    // analyzeFace throws NoFaceError for faceDetected=false; keep a guard for safety.
    if (!analysis.faceDetected) return errorResponse('no_face', 'No face was detected in the photo.');

    const response: AnalyzeResponse = { analysis, recommendedLookIds: recommendLooks(analysis, quiz), mock: false };
    return jsonResponse(response);
  } catch (error) {
    return handleError(error, 'analyze');
  }
}

/** POST /api/analyze-skin: skincare-only analysis of the selfie. */
export async function handleAnalyzeSkin(request: Request): Promise<Response> {
  try {
    const body = await parseJsonBody(request, AnalyzeRequestSchema, MAX_BODY_BYTES);
    if (!body.ok) return body.response;
    const { image, locale } = body.data;

    const limit = analyzeRateLimiter.check(`ip:${clientIp(request)}`);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);

    const config = getServerConfig();
    if (isAnalysisMock(config)) {
      if (config.mockDelayMs > 0) await sleep(config.mockDelayMs);
      const response: SkinAnalyzeResponse = { skin: mockSkinAnalysisFor(locale), mock: true };
      return jsonResponse(response);
    }

    const { analysis } = await analyzeSkin({ imageDataUrl: image, locale, ...(await hostedImage(config, image)) }, analysisOptions(config));
    if (!analysis.faceDetected) return errorResponse('no_face', 'No face was detected in the photo.');

    const response: SkinAnalyzeResponse = { skin: analysis, mock: false };
    return jsonResponse(response);
  } catch (error) {
    return handleError(error, 'analyze-skin');
  }
}

/** Model + endpoint for the configured analysis provider (OpenRouter → Gemini → Kie). */
function analysisOptions(config: ServerConfig): OpenRouterOptions {
  if (config.analysisProvider === 'gemini') {
    return {
      apiKey: config.gemini.apiKey as string,
      model: config.gemini.analysisModel,
      siteUrl: config.siteUrl,
      endpoint: () => GEMINI_CHAT_URL,
      providerLabel: 'gemini',
      reasoningEffort: 'none',
    };
  }
  if (config.analysisProvider === 'kie') {
    return { apiKey: config.kie.apiKey as string, model: config.kie.analysisModel, siteUrl: config.siteUrl, endpoint: kieChatUrl, providerLabel: 'kie' };
  }
  return {
    apiKey: config.openRouter.apiKey as string,
    model: config.openRouter.model,
    fallbackModel: config.openRouter.fallbackModel,
    siteUrl: config.siteUrl,
  };
}

/** Kie.ai does not accept data URLs, so the photo is uploaded there first. */
async function hostedImage(config: ServerConfig, image: string): Promise<{ imageUrl?: string }> {
  return config.analysisProvider === 'kie' ? { imageUrl: await uploadToKie(config.kie.apiKey as string, image) } : {};
}

/** POST /api/render-look */
export async function handleRenderLook(request: Request): Promise<Response> {
  try {
    const body = await parseJsonBody(request, RenderRequestSchema, MAX_BODY_BYTES);
    if (!body.ok) return body.response;
    const { image, lookId, analysis, appUserId, paddleRef } = body.data;

    const config = getServerConfig();
    // Free renders are keyed by IP: the app user id comes from the browser and can be rotated.
    const rateKey = appUserId && !config.freeRenders ? `user:${appUserId}` : `ip:${clientIp(request)}`;

    if (isRenderMock(config)) {
      const limit = renderRateLimiter.check(rateKey);
      if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);
      // Mock mode: no entitlement check, no network — echo the input image back.
      const response: RenderResponse = { image, lookId, mock: true };
      return jsonResponse(response);
    }

    if (!appUserId && !config.freeRenders) return errorResponse('payment_required', 'A premium subscription is required.');

    const limit = (config.freeRenders ? freeRenderRateLimiter : renderRateLimiter).check(rateKey);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);

    if (!config.freeRenders && paddleRef && appUserId && config.paddle) {
      // Web purchase: Paddle says whether it is paid and counts trial / report renders.
      const allowance = await consumeRender(config.paddle, paddleRef, appUserId);
      if (allowance === 'quota_exceeded') return errorResponse('quota_exceeded', 'The renders included in this purchase are used up.');
      if (allowance === 'denied') return errorResponse('payment_required', 'A premium subscription is required.');
    } else if (!config.freeRenders) {
      if (!config.revenueCatSecretKey) {
        // No web purchase and no app entitlement check: not paid (fail closed, renders cost money).
        if (config.paddle) return errorResponse('payment_required', 'A premium subscription is required.');
        throw new HttpError('internal', 'Rendering is temporarily unavailable.', 'REVENUECAT_SECRET_KEY is not set');
      }
      const entitled = await checkEntitlement(appUserId as string, config.revenueCatSecretKey);
      if (!entitled) return errorResponse('payment_required', 'A premium subscription is required.');
    }

    const provider = createImageProvider(config);
    if (!provider) throw new HttpError('internal', 'Rendering is temporarily unavailable.', 'image provider missing');

    const rendered = await provider.edit(image, buildRenderPrompt(lookId, analysis));
    const response: RenderResponse = { image: rendered, lookId, mock: false };
    return jsonResponse(response);
  } catch (error) {
    return handleError(error, 'render-look');
  }
}

/** POST /api/redeem: checks an invite code that unlocks results without paying. */
export async function handleRedeem(request: Request): Promise<Response> {
  try {
    const body = await parseJsonBody(request, RedeemRequestSchema, 1024);
    if (!body.ok) return body.response;
    // Shares the analyze budget per IP, which also slows down code guessing.
    const limit = analyzeRateLimiter.check(`redeem:${clientIp(request)}`);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);
    const ok = getServerConfig().accessCodes.includes(body.data.code.trim().toUpperCase());
    if (!ok) return errorResponse('payment_required', 'Invalid invite code.');
    return jsonResponse({ ok: true });
  } catch (error) {
    return handleError(error, 'redeem');
  }
}

/** POST /api/paddle/claim: after checkout, links a paid Paddle transaction to this browser. */
export async function handlePaddleClaim(request: Request): Promise<Response> {
  try {
    const body = await parseJsonBody(request, ClaimRequestSchema, 1024);
    if (!body.ok) return body.response;
    const limit = analyzeRateLimiter.check(`claim:${clientIp(request)}`);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);
    const config = getServerConfig();
    if (!config.paddle) throw new HttpError('internal', 'Payments are temporarily unavailable.', 'PADDLE_API_KEY is not set');
    const ref = await claimPurchase(config.paddle, body.data.transactionId, body.data.appUserId);
    if (!ref) return errorResponse('payment_required', 'This purchase could not be confirmed.');
    return jsonResponse({ paddleRef: ref });
  } catch (error) {
    return handleError(error, 'paddle-claim');
  }
}

/** GET /api/health */
export function handleHealth(): Response {
  const config = getServerConfig();
  const response: HealthResponse = { ok: true, mock: { analysis: isAnalysisMock(config), render: isRenderMock(config) } };
  return jsonResponse(response);
}
