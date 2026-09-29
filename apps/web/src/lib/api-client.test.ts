import { MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL, type AnalyzeResponse } from '@tonelle/shared';
import { describe, expect, it, vi } from 'vitest';
import { codeForStatus, createApiClient, errorMessageKey } from './api-client';

const validResponse: AnalyzeResponse = {
  analysis: MOCK_ANALYSIS,
  recommendedLookIds: ['natural_glow', 'office_chic', 'soft_glam'],
  mock: true,
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

const request = { image: MOCK_IMAGE_DATA_URL, locale: 'tr' as const };

describe('api-client', () => {
  it('posts JSON to /api/analyze and returns the validated response', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(validResponse));
    const client = createApiClient({ fetch: fetchMock as unknown as typeof fetch });
    const result = await client.analyze(request);
    expect(result).toEqual({ ok: true, data: validResponse });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/analyze');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual(request);
  });

  it('uses the base URL for render-look', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ image: MOCK_IMAGE_DATA_URL, lookId: 'bridal', mock: true }),
    );
    const client = createApiClient({ baseUrl: 'https://api.example', fetch: fetchMock as unknown as typeof fetch });
    const result = await client.renderLook({ ...request, lookId: 'bridal', analysis: MOCK_ANALYSIS });
    expect(result.ok).toBe(true);
    expect((fetchMock.mock.calls[0] as unknown as [string])[0]).toBe('https://api.example/api/render-look');
  });

  it('maps a typed ApiError body (422 no_face)', async () => {
    const client = createApiClient({
      fetch: (async () => jsonResponse({ error: { code: 'no_face', message: 'No face' } }, 422)) as typeof fetch,
    });
    const result = await client.analyze(request);
    expect(result).toEqual({ ok: false, error: { code: 'no_face', message: 'No face', status: 422 } });
    if (!result.ok) expect(errorMessageKey(result.error.code)).toBe('errors.no_face');
  });

  it('falls back to the status code when the error body is not an ApiError', async () => {
    const client = createApiClient({
      fetch: (async () => new Response('<html>Too many</html>', { status: 429 })) as typeof fetch,
    });
    const result = await client.analyze(request);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('rate_limited');
  });

  it('flags a 200 with an invalid body as invalid_response', async () => {
    const client = createApiClient({
      fetch: (async () => jsonResponse({ analysis: { season: 'not_a_season' } })) as typeof fetch,
    });
    const result = await client.analyze(request);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_response');
      expect(errorMessageKey(result.error.code)).toBe('errors.generic');
    }
  });

  it('maps thrown fetch errors to network, and aborts to aborted', async () => {
    const offline = createApiClient({
      fetch: (async () => {
        throw new TypeError('Failed to fetch');
      }) as typeof fetch,
    });
    const r1 = await offline.analyze(request);
    expect(!r1.ok && r1.error).toMatchObject({ code: 'network', status: 0 });
    expect(errorMessageKey('network')).toBe('errors.network');

    const aborted = createApiClient({
      fetch: (async () => {
        throw new DOMException('The operation was aborted.', 'AbortError');
      }) as typeof fetch,
    });
    const r2 = await aborted.analyze(request);
    expect(!r2.ok && r2.error.code).toBe('aborted');
  });

  it('derives codes from HTTP statuses', () => {
    expect(codeForStatus(402)).toBe('payment_required');
    expect(codeForStatus(413)).toBe('too_large');
    expect(codeForStatus(502)).toBe('provider_error');
    expect(codeForStatus(404)).toBe('bad_request');
    expect(codeForStatus(503)).toBe('internal');
  });
});
