import { MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL, type AnalyzeResponse } from '@tonelle/shared';
import { describe, expect, it, vi } from 'vitest';

import { ApiClientError, codeForStatus, createApiClient, errorKeyFor, errorMessageKey, type FetchLike } from './api';

const okResponse: AnalyzeResponse = {
  analysis: MOCK_ANALYSIS,
  recommendedLookIds: ['natural_glow', 'office_chic', 'soft_glam'],
  mock: true,
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function client(fetchImpl: FetchLike, extra: Partial<Parameters<typeof createApiClient>[0]> = {}) {
  return createApiClient({ baseUrl: 'https://api.example.com/', fetch: fetchImpl, ...extra });
}

describe('createApiClient.analyze', () => {
  it('posts to /api/analyze and validates the response', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () => jsonResponse(200, okResponse));
    const result = await client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'tr' });
    expect(result.analysis.season).toBe('soft_autumn');
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('https://api.example.com/api/analyze');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ image: MOCK_IMAGE_DATA_URL, locale: 'tr' });
  });

  it('maps ApiError bodies to their code', async () => {
    const fetchImpl: FetchLike = async () => jsonResponse(422, { error: { code: 'no_face', message: 'No face' } });
    await expect(client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'en' })).rejects.toMatchObject({
      code: 'no_face',
      status: 422,
    });
  });

  it('falls back to the HTTP status when the error body is not an ApiError', async () => {
    const fetchImpl: FetchLike = async () => new Response('<html>busy</html>', { status: 429 });
    await expect(client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'en' })).rejects.toMatchObject({
      code: 'rate_limited',
    });
  });

  it('rejects responses that do not match the schema', async () => {
    const fetchImpl: FetchLike = async () => jsonResponse(200, { analysis: { season: 'nope' } });
    await expect(client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'en' })).rejects.toMatchObject({
      code: 'invalid_response',
    });
  });

  it('reports network failures', async () => {
    const fetchImpl: FetchLike = async () => {
      throw new TypeError('Network request failed');
    };
    await expect(client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'en' })).rejects.toMatchObject({
      code: 'network',
    });
  });

  it('times out slow requests', async () => {
    const fetchImpl: FetchLike = (_url, init) =>
      new Promise((_, reject) => {
        init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });
    await expect(
      client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'en' }, { timeoutMs: 20 }),
    ).rejects.toMatchObject({ code: 'timeout' });
  });

  it('distinguishes caller aborts from timeouts', async () => {
    const controller = new AbortController();
    const fetchImpl: FetchLike = (_url, init) =>
      new Promise((_, reject) => {
        init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });
    const pending = client(fetchImpl).analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'en' }, { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: 'aborted' });
  });

  it('validates the image before sending', async () => {
    const fetchImpl = vi.fn<FetchLike>();
    await expect(client(fetchImpl).analyze({ image: 'data:image/gif;base64,AAAA', locale: 'en' })).rejects.toMatchObject(
      { code: 'bad_request' },
    );
    const huge = `data:image/jpeg;base64,${'A'.repeat(6 * 1024 * 1024)}`;
    await expect(client(fetchImpl).analyze({ image: huge, locale: 'en' })).rejects.toMatchObject({ code: 'too_large' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('createApiClient.renderLook', () => {
  it('posts appUserId and returns the rendered image', async () => {
    const fetchImpl = vi.fn<FetchLike>(async () =>
      jsonResponse(200, { image: MOCK_IMAGE_DATA_URL, lookId: 'soft_glam', mock: true }),
    );
    const result = await client(fetchImpl).renderLook({
      image: MOCK_IMAGE_DATA_URL,
      lookId: 'soft_glam',
      analysis: MOCK_ANALYSIS,
      appUserId: 'user-1',
      locale: 'en',
    });
    expect(result.lookId).toBe('soft_glam');
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('https://api.example.com/api/render-look');
    expect(JSON.parse(init.body as string).appUserId).toBe('user-1');
  });

  it('surfaces payment_required', async () => {
    const fetchImpl: FetchLike = async () =>
      jsonResponse(402, { error: { code: 'payment_required', message: 'Premium only' } });
    const error = await client(fetchImpl)
      .renderLook({ image: MOCK_IMAGE_DATA_URL, lookId: 'bridal', analysis: MOCK_ANALYSIS, locale: 'tr' })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiClientError);
    expect(errorKeyFor(error)).toBe('errors.payment_required');
  });
});

describe('error mapping', () => {
  it('maps codes to dictionary keys', () => {
    expect(errorMessageKey('no_face')).toBe('errors.no_face');
    expect(errorMessageKey('provider_error')).toBe('errors.provider_error');
    expect(errorMessageKey('timeout')).toBe('errors.network');
    expect(errorMessageKey('network')).toBe('errors.network');
    expect(errorMessageKey('invalid_response')).toBe('errors.generic');
    expect(errorKeyFor(new Error('x'))).toBe('errors.generic');
  });

  it('maps HTTP statuses to codes', () => {
    expect(codeForStatus(413)).toBe('too_large');
    expect(codeForStatus(402)).toBe('payment_required');
    expect(codeForStatus(503)).toBe('internal');
    expect(codeForStatus(404)).toBe('bad_request');
  });
});
