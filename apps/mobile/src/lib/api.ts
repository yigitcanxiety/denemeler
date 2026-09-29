import {
  API_ERROR_STATUS,
  AnalyzeRequestSchema,
  AnalyzeResponseSchema,
  ApiErrorSchema,
  RenderRequestSchema,
  RenderResponseSchema,
  type AnalyzeRequest,
  type AnalyzeResponse,
  type ApiErrorCode,
  type RenderRequest,
  type RenderResponse,
  type TranslationKey,
} from '@tonelle/shared';
import type { z } from 'zod';

import { checkUploadImage } from './image';

/** Server error codes plus client-side failures. */
export type ClientErrorCode = ApiErrorCode | 'network' | 'timeout' | 'invalid_response' | 'aborted';

export class ApiClientError extends Error {
  readonly code: ClientErrorCode;
  readonly status: number | null;

  constructor(code: ClientErrorCode, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

/** Dictionary key (errors.*) with user-facing copy for an error code. */
export function errorMessageKey(code: ClientErrorCode): TranslationKey {
  switch (code) {
    case 'network':
    case 'timeout':
      return 'errors.network';
    case 'invalid_response':
    case 'aborted':
      return 'errors.generic';
    default:
      return `errors.${code}`;
  }
}

/** Maps any thrown value to a dictionary key. */
export function errorKeyFor(error: unknown): TranslationKey {
  return isApiClientError(error) ? errorMessageKey(error.code) : 'errors.generic';
}

const STATUS_TO_CODE: ReadonlyMap<number, ApiErrorCode> = new Map(
  (Object.entries(API_ERROR_STATUS) as [ApiErrorCode, number][]).map(([code, status]) => [status, code]),
);

/** Best-effort error code when the server did not send an ApiError body. */
export function codeForStatus(status: number): ApiErrorCode {
  return STATUS_TO_CODE.get(status) ?? (status >= 500 ? 'internal' : 'bad_request');
}

export type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export interface ApiClientOptions {
  baseUrl: string;
  fetch?: FetchLike;
  /** Default timeouts (ms). */
  analyzeTimeoutMs?: number;
  renderTimeoutMs?: number;
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export const DEFAULT_ANALYZE_TIMEOUT_MS = 60_000;
export const DEFAULT_RENDER_TIMEOUT_MS = 120_000;

async function postJson<S extends z.ZodType>(
  fetchImpl: FetchLike,
  url: string,
  body: unknown,
  schema: S,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<z.infer<S>> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onExternalAbort = () => controller.abort();
  if (externalSignal?.aborted) controller.abort();
  externalSignal?.addEventListener('abort', onExternalAbort);

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) throw new ApiClientError('timeout', `Request timed out after ${timeoutMs} ms`);
    if (externalSignal?.aborted) throw new ApiClientError('aborted', 'Request aborted');
    throw new ApiClientError('network', error instanceof Error ? error.message : 'Network request failed');
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const parsedError = ApiErrorSchema.safeParse(json);
    if (parsedError.success) {
      throw new ApiClientError(parsedError.data.error.code, parsedError.data.error.message, response.status);
    }
    throw new ApiClientError(codeForStatus(response.status), `HTTP ${response.status}`, response.status);
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiClientError('invalid_response', 'Response did not match the expected schema', response.status);
  }
  return parsed.data;
}

function assertImage(image: string): void {
  const check = checkUploadImage(image);
  if (!check.ok) {
    throw new ApiClientError(check.reason === 'too_large' ? 'too_large' : 'bad_request', `Invalid image: ${check.reason}`);
  }
}

export function createApiClient(options: ApiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetchImpl: FetchLike = options.fetch ?? ((input, init) => fetch(input, init));
  const analyzeTimeout = options.analyzeTimeoutMs ?? DEFAULT_ANALYZE_TIMEOUT_MS;
  const renderTimeout = options.renderTimeoutMs ?? DEFAULT_RENDER_TIMEOUT_MS;

  return {
    async analyze(request: AnalyzeRequest, opts: RequestOptions = {}): Promise<AnalyzeResponse> {
      assertImage(request.image);
      const body = AnalyzeRequestSchema.safeParse(request);
      if (!body.success) throw new ApiClientError('bad_request', 'Invalid analyze request');
      return postJson(
        fetchImpl,
        `${baseUrl}/api/analyze`,
        body.data,
        AnalyzeResponseSchema,
        opts.timeoutMs ?? analyzeTimeout,
        opts.signal,
      );
    },

    async renderLook(request: RenderRequest, opts: RequestOptions = {}): Promise<RenderResponse> {
      assertImage(request.image);
      const body = RenderRequestSchema.safeParse(request);
      if (!body.success) throw new ApiClientError('bad_request', 'Invalid render request');
      return postJson(
        fetchImpl,
        `${baseUrl}/api/render-look`,
        body.data,
        RenderResponseSchema,
        opts.timeoutMs ?? renderTimeout,
        opts.signal,
      );
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
