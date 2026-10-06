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
import { getServerConfig, isAnalysisMock, isRenderMock, type ServerConfig } from './env';
import { HttpError } from './errors';
import { clientIp, errorResponse, handleError, jsonResponse, parseJsonBody, rateLimitedResponse, sleep } from './http';
import { createImageProvider } from './image-providers';
import { kieChatUrl, uploadToKie } from './kie';
import { analyzeFace, analyzeSkin, GEMINI_CHAT_URL, type OpenRouterOptions } from './openrouter';
import { analyzeRateLimiter, renderRateLimiter } from './rate-limit';
import { checkEntitlement } from './revenuecat';

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
    const { image, lookId, analysis, appUserId } = body.data;

    const config = getServerConfig();
    const rateKey = appUserId ? `user:${appUserId}` : `ip:${clientIp(request)}`;

    if (isRenderMock(config)) {
      const limit = renderRateLimiter.check(rateKey);
      if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);
      // Mock mode: no entitlement check, no network — echo the input image back.
      const response: RenderResponse = { image, lookId, mock: true };
      return jsonResponse(response);
    }

    if (!appUserId && !config.devFreeRenders) return errorResponse('payment_required', 'A premium subscription is required.');

    const limit = renderRateLimiter.check(rateKey);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);

    if (!config.devFreeRenders) {
      if (!config.revenueCatSecretKey) {
        // Fail closed: rendering costs money and must never be unverified in production.
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

/** GET /api/health */
export function handleHealth(): Response {
  const config = getServerConfig();
  const response: HealthResponse = { ok: true, mock: { analysis: isAnalysisMock(config), render: isRenderMock(config) } };
  return jsonResponse(response);
}
