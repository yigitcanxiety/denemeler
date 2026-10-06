import {
  API_ERROR_STATUS,
  AnalyzeResponseSchema,
  ApiErrorSchema,
  RenderResponseSchema,
  SkinAnalyzeResponseSchema,
  type AnalyzeRequest,
  type AnalyzeResponse,
  type ApiErrorCode,
  type RenderRequest,
  type RenderResponse,
  type SkinAnalyzeResponse,
  type TranslationKey,
} from '@tonelle/shared';
import type { z } from 'zod';

/** Error codes the client can surface: the API's own codes plus transport-level failures. */
export type ClientErrorCode = ApiErrorCode | 'network' | 'invalid_response' | 'aborted';

export interface ClientError {
  code: ClientErrorCode;
  /** HTTP status, or 0 when the request never got a response. */
  status: number;
  /** Developer-facing message (never shown to users; use `errorMessageKey`). */
  message: string;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ClientError };

export interface ApiClientOptions {
  /** Origin to call, '' for same-origin (default). */
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface RequestOptions {
  signal?: AbortSignal;
}

const STATUS_TO_CODE = new Map<number, ApiErrorCode>(
  (Object.entries(API_ERROR_STATUS) as [ApiErrorCode, number][]).map(([code, status]) => [status, code]),
);

/** Best-effort error code for a non-2xx response whose body is not a valid ApiError. */
export function codeForStatus(status: number): ApiErrorCode {
  return STATUS_TO_CODE.get(status) ?? (status >= 400 && status < 500 ? 'bad_request' : 'internal');
}

/** Maps any client error code to the shared `errors.*` copy key. */
export function errorMessageKey(code: ClientErrorCode): TranslationKey {
  switch (code) {
    case 'network':
      return 'errors.network';
    case 'invalid_response':
    case 'aborted':
      return 'errors.generic';
    default:
      return `errors.${code}`;
  }
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: unknown }).name === 'AbortError'
  );
}

async function postJson<S extends z.ZodType>(
  path: string,
  body: unknown,
  schema: S,
  options: ApiClientOptions & RequestOptions,
): Promise<ApiResult<z.infer<S>>> {
  const doFetch = options.fetch ?? globalThis.fetch;
  let response: Response;
  try {
    response = await doFetch(`${options.baseUrl ?? ''}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      signal: options.signal,
    });
  } catch (error) {
    if (isAbortError(error)) return { ok: false, error: { code: 'aborted', status: 0, message: 'Request aborted' } };
    return {
      ok: false,
      error: { code: 'network', status: 0, message: error instanceof Error ? error.message : 'Network error' },
    };
  }

  let json: unknown = undefined;
  try {
    json = await response.json();
  } catch {
    // Non-JSON body (e.g. an HTML error page from a proxy); handled below.
  }

  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(json);
    if (parsed.success) {
      return { ok: false, error: { ...parsed.data.error, status: response.status } };
    }
    const code = codeForStatus(response.status);
    return { ok: false, error: { code, status: response.status, message: `HTTP ${response.status}` } };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error: { code: 'invalid_response', status: response.status, message: parsed.error.message },
    };
  }
  return { ok: true, data: parsed.data };
}

export function createApiClient(clientOptions: ApiClientOptions = {}) {
  return {
    /** POST /api/analyze — the photo goes only to our own API. */
    analyze(request: AnalyzeRequest, options: RequestOptions = {}): Promise<ApiResult<AnalyzeResponse>> {
      return postJson('/api/analyze', request, AnalyzeResponseSchema, { ...clientOptions, ...options });
    },
    /** POST /api/analyze-skin — skincare-only analysis; the photo goes only to our own API. */
    analyzeSkin(request: AnalyzeRequest, options: RequestOptions = {}): Promise<ApiResult<SkinAnalyzeResponse>> {
      return postJson('/api/analyze-skin', request, SkinAnalyzeResponseSchema, { ...clientOptions, ...options });
    },
    /** POST /api/render-look — Premium only; 402 `payment_required` without entitlement. */
    renderLook(request: RenderRequest, options: RequestOptions = {}): Promise<ApiResult<RenderResponse>> {
      return postJson('/api/render-look', request, RenderResponseSchema, { ...clientOptions, ...options });
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

/** Same-origin client used by the web app. */
export const apiClient = createApiClient();
