import {
  mockAnalysisFor,
  recommendLooks,
  type AnalyzeRequest,
  type AnalyzeResponse,
  type RenderRequest,
  type RenderResponse,
} from '@tonelle/shared';

import { ApiClientError, type ApiClient, type RequestOptions } from './api';

/**
 * Offline stand-in for the Tonelle API, used only by the web preview when no API URL is set
 * (see `isWebDemoMode`). Mirrors the server's mock mode: the shared MOCK analysis for the
 * requested locale, and look renders that echo the input photo. Nothing leaves the browser.
 */
export function createDemoApiClient({ delayMs = 1200 }: { delayMs?: number } = {}): ApiClient {
  const wait = (ms: number, signal?: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      if (signal?.aborted) return reject(new ApiClientError('aborted', 'Request aborted'));
      const timer = setTimeout(resolve, ms);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new ApiClientError('aborted', 'Request aborted'));
      });
    });

  return {
    async analyze(request: AnalyzeRequest, opts: RequestOptions = {}): Promise<AnalyzeResponse> {
      await wait(delayMs, opts.signal);
      const analysis = mockAnalysisFor(request.locale);
      return { analysis, recommendedLookIds: recommendLooks(analysis, request.quiz), mock: true };
    },
    async renderLook(request: RenderRequest, opts: RequestOptions = {}): Promise<RenderResponse> {
      await wait(delayMs, opts.signal);
      return { image: request.image, lookId: request.lookId, mock: true };
    },
  };
}
