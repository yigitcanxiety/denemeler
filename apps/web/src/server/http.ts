import {
  API_ERROR_STATUS,
  MAX_IMAGE_BYTES,
  parseImageDataUrl,
  type ApiError,
  type ApiErrorCode,
} from '@tonelle/shared';
import type { ZodType } from 'zod';
import { HttpError } from './errors';

/** CORS: any origin, no credentials (the mobile app and web both call these routes). */
export const CORS_HEADERS: Readonly<Record<string, string>> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  headers: Record<string, string> = {},
): Response {
  const body: ApiError = { error: { code, message } };
  return jsonResponse(body, API_ERROR_STATUS[code], headers);
}

/** Response for CORS preflight requests. */
export function preflightResponse(): Response {
  return new Response(null, { status: 204, headers: { ...CORS_HEADERS } });
}

/**
 * Converts any thrown value into an `ApiError` response. Logs a one-line summary only —
 * never request bodies, image data, provider bodies or keys.
 */
export function handleError(error: unknown, route: string): Response {
  if (error instanceof HttpError) {
    if (error.code === 'provider_error' || error.code === 'internal') {
      console.warn(`[${route}] ${error.code}: ${error.detail ?? error.message}`);
    }
    return errorResponse(error.code, error.message);
  }
  const name = error instanceof Error ? error.name : typeof error;
  console.error(`[${route}] internal: unexpected ${name}`);
  return errorResponse('internal', 'Something went wrong. Please try again.');
}

export type ParseResult<T> = { ok: true; data: T } | { ok: false; response: Response };

/**
 * Reads the raw body enforcing `maxBytes` *before* JSON parsing (Content-Length is checked
 * first, then the stream is counted so chunked uploads cannot bypass it), then validates it.
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
  maxBytes: number,
): Promise<ParseResult<T>> {
  const tooLarge = () => ({
    ok: false as const,
    response: errorResponse('too_large', `Request body must be ${Math.floor(maxBytes / (1024 * 1024))} MB or smaller.`),
  });

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) return tooLarge();

  let text: string;
  if (!request.body) {
    text = '';
  } else {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return tooLarge();
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    text = new TextDecoder().decode(buffer);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, response: errorResponse('bad_request', 'Request body must be valid JSON.') };
  }

  // A well-formed image that is simply too big is a 413, not a generic 400.
  const image = (json as { image?: unknown } | null)?.image;
  if (typeof image === 'string' && (parseImageDataUrl(image)?.bytes ?? 0) > MAX_IMAGE_BYTES) {
    return { ok: false, response: errorResponse('too_large', 'Image must be 4 MB or smaller.') };
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    // Report field paths + messages only (never echo values: they may contain image data).
    // One message per field (the image schema has two chained refinements).
    const seen = new Set<string>();
    const issues = result.error.issues
      .filter((issue) => {
        const key = issue.path.join('.');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 5)
      .map((issue) => `${issue.path.join('.') || '(body)'}: ${issue.message}`)
      .join('; ');
    return { ok: false, response: errorResponse('bad_request', `Invalid request: ${issues}`) };
  }
  return { ok: true, data: result.data };
}

/** Best-effort client IP (Vercel sets `x-forwarded-for`; first entry is the client). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first;
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function rateLimitedResponse(retryAfterSeconds: number): Response {
  return errorResponse('rate_limited', 'Too many requests. Please try again later.', {
    'Retry-After': String(retryAfterSeconds),
  });
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
