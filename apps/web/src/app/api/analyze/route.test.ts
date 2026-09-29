import { AnalyzeResponseSchema, MAX_BODY_BYTES, MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL } from '@tonelle/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeRateLimiter } from '@/server/rate-limit';
import { OPTIONS, POST } from './route';

const URL_ = 'http://localhost/api/analyze';
const post = (body: string, headers: Record<string, string> = {}) =>
  POST(new Request(URL_, { method: 'POST', body, headers: { 'content-type': 'application/json', ...headers } }));
const validBody = (extra: Record<string, unknown> = {}) =>
  JSON.stringify({ image: MOCK_IMAGE_DATA_URL, locale: 'tr', ...extra });

describe('POST /api/analyze', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    analyzeRateLimiter.reset();
    fetchMock.mockReset();
    fetchMock.mockRejectedValue(new Error('network must not be used'));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('TONELLE_MOCK', '1');
    vi.stubEnv('TONELLE_MOCK_DELAY_MS', '0');
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns a localized mock analysis with 3 looks and CORS headers', async () => {
    const res = await post(validBody({ quiz: { skinType: 'dry', eyeColor: 'brown', occasion: 'night', budget: 'mid', experience: 'pro' } }));
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const json = AnalyzeResponseSchema.parse(await res.json());
    expect(json.mock).toBe(true);
    expect(json.recommendedLookIds).toHaveLength(3);
    expect(json.analysis.summary).not.toBe(MOCK_ANALYSIS.summary); // Turkish text
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects invalid bodies with 400', async () => {
    for (const body of ['not json', JSON.stringify({ image: 'hello', locale: 'en' }), JSON.stringify({ image: MOCK_IMAGE_DATA_URL, locale: 'xx' })]) {
      const res = await post(body);
      expect(res.status).toBe(400);
      expect((await res.json()).error.code).toBe('bad_request');
    }
  });

  it('rejects oversize bodies with 413 before parsing', async () => {
    const huge = 'x'.repeat(MAX_BODY_BYTES + 1);
    const res = await post(huge);
    expect(res.status).toBe(413);
    expect((await res.json()).error.code).toBe('too_large');
  });

  it('rejects an oversize body even when content-length lies', async () => {
    const huge = new TextEncoder().encode('x'.repeat(MAX_BODY_BYTES + 1));
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(huge);
        controller.close();
      },
    });
    const req = new Request(URL_, { method: 'POST', body: stream, headers: { 'content-length': '10' }, duplex: 'half' } as RequestInit);
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it('rate limits at 10 requests per hour per IP', async () => {
    for (let i = 0; i < 10; i++) expect((await post(validBody(), { 'x-forwarded-for': '1.2.3.4' })).status).toBe(200);
    const limited = await post(validBody(), { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' });
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get('retry-after'))).toBeGreaterThan(0);
    expect((await post(validBody(), { 'x-forwarded-for': '5.6.7.8' })).status).toBe(200);
  });

  it('answers CORS preflight', () => {
    const res = OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-methods')).toContain('POST');
    expect(res.headers.get('access-control-allow-headers')).toBe('Content-Type');
  });

  describe('live mode (mocked OpenRouter)', () => {
    beforeEach(() => {
      vi.stubEnv('TONELLE_MOCK', '');
      vi.stubEnv('OPENROUTER_API_KEY', 'or-test');
      vi.stubEnv('ANALYSIS_MODEL', 'test/model');
      vi.stubEnv('ANALYSIS_FALLBACK_MODEL', '');
    });
    const completion = (content: unknown) =>
      Response.json({ choices: [{ message: { content: JSON.stringify(content) } }] });

    it('returns mock:false with the model analysis', async () => {
      fetchMock.mockResolvedValueOnce(completion(MOCK_ANALYSIS));
      const res = await post(validBody());
      expect(res.status).toBe(200);
      const json = AnalyzeResponseSchema.parse(await res.json());
      expect(json.mock).toBe(false);
      expect(json.analysis).toEqual(MOCK_ANALYSIS);
      expect(JSON.parse(fetchMock.mock.calls[0]![1]!.body as string).model).toBe('test/model');
    });

    it('returns 422 no_face when faceDetected=false', async () => {
      fetchMock.mockResolvedValueOnce(completion({ ...MOCK_ANALYSIS, faceDetected: false }));
      const res = await post(validBody());
      expect(res.status).toBe(422);
      expect((await res.json()).error.code).toBe('no_face');
    });

    it('returns 502 provider_error without leaking the upstream body', async () => {
      fetchMock.mockResolvedValue(new Response('sk-or-secret upstream failure', { status: 500 }));
      const res = await post(validBody());
      expect(res.status).toBe(502);
      const text = await res.text();
      expect(text).not.toContain('secret');
      expect(JSON.parse(text).error.code).toBe('provider_error');
    });
  });
});

describe('POST /api/analyze image size', () => {
  beforeEach(() => {
    vi.stubEnv('TONELLE_MOCK', '1');
    vi.stubEnv('TONELLE_MOCK_DELAY_MS', '0');
    analyzeRateLimiter.reset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('returns 413 for a valid data URL whose decoded image exceeds 4 MB', async () => {
    const big = 'data:image/jpeg;base64,' + 'A'.repeat(Math.ceil((4 * 1024 * 1024 + 10) / 3) * 4);
    const res = await post(JSON.stringify({ image: big, locale: 'en' }));
    expect(res.status).toBe(413);
  });
});
