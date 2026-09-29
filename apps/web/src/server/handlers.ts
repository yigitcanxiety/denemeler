import {
  AnalyzeRequestSchema,
  buildRenderPrompt,
  MAX_BODY_BYTES,
  mockAnalysisFor,
  recommendLooks,
  RenderRequestSchema,
  type AnalyzeResponse,
  type HealthResponse,
  type RenderResponse,
} from '@tonelle/shared';
import { getServerConfig, isAnalysisMock, isRenderMock } from './env';
import { HttpError } from './errors';
import { clientIp, errorResponse, handleError, jsonResponse, parseJsonBody, rateLimitedResponse, sleep } from './http';
import { createImageProvider } from './image-providers';
import { kieChatUrl, uploadToKie } from './kie';
import { analyzeFace } from './openrouter';
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

    const viaKie = config.analysisProvider === 'kie';
    const kieKey = config.kie.apiKey as string;
    const { analysis } = await analyzeFace(
      { imageDataUrl: image, locale, quiz, imageUrl: viaKie ? await uploadToKie(kieKey, image) : undefined },
      viaKie
        ? { apiKey: kieKey, model: config.kie.analysisModel, siteUrl: config.siteUrl, endpoint: kieChatUrl, providerLabel: 'kie' }
        : {
            apiKey: config.openRouter.apiKey as string,
            model: config.openRouter.model,
            fallbackModel: config.openRouter.fallbackModel,
            siteUrl: config.siteUrl,
          },
    );
    // analyzeFace throws NoFaceError for faceDetected=false; keep a guard for safety.
    if (!analysis.faceDetected) return errorResponse('no_face', 'No face was detected in the photo.');

    const response: AnalyzeResponse = { analysis, recommendedLookIds: recommendLooks(analysis, quiz), mock: false };
    return jsonResponse(response);
  } catch (error) {
    return handleError(error, 'analyze');
  }
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

    if (!appUserId) return errorResponse('payment_required', 'A premium subscription is required.');

    const limit = renderRateLimiter.check(rateKey);
    if (!limit.allowed) return rateLimitedResponse(limit.retryAfterSeconds);

    if (!config.revenueCatSecretKey) {
      // Fail closed: rendering costs money and must never be unverified in production.
      throw new HttpError('internal', 'Rendering is temporarily unavailable.', 'REVENUECAT_SECRET_KEY is not set');
    }
    const entitled = await checkEntitlement(appUserId, config.revenueCatSecretKey);
    if (!entitled) return errorResponse('payment_required', 'A premium subscription is required.');

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
