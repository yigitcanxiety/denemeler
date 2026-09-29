import { MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL, RenderResponseSchema } from '@tonelle/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRateLimiter } from '@/server/rate-limit';
import { clearEntitlementCache } from '@/server/revenuecat';
import { OPTIONS, POST } from './route';

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/render-look', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    }),
  );
const request = (extra: Record<string, unknown> = {}) => ({
  image: MOCK_IMAGE_DATA_URL,
  lookId: 'soft_glam',
  analysis: MOCK_ANALYSIS,
  locale: 'en',
  ...extra,
});

describe('POST /api/render-look', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    renderRateLimiter.reset();
    clearEntitlementCache();
    fetchMock.mockReset();
    fetchMock.mockRejectedValue(new Error('network must not be used'));
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('mock mode', () => {
    beforeEach(() => vi.stubEnv('TONELLE_MOCK', '1'));

    it('echoes the input image with mock:true and skips entitlement checks', async () => {
      const res = await post(request());
      expect(res.status).toBe(200);
      const json = RenderResponseSchema.parse(await res.json());
      expect(json).toEqual({ image: MOCK_IMAGE_DATA_URL, lookId: 'soft_glam', mock: true });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('validates the body', async () => {
      expect((await post(request({ lookId: 'nope' }))).status).toBe(400);
      expect((await post(request({ analysis: { faceDetected: true } }))).status).toBe(400);
      expect((await post('{')).status).toBe(400);
    });

    it('is used automatically when the selected provider has no key', async () => {
      vi.stubEnv('TONELLE_MOCK', '');
      vi.stubEnv('IMAGE_PROVIDER', 'fal');
      vi.stubEnv('GEMINI_API_KEY', 'set-but-not-selected');
      vi.stubEnv('FAL_KEY', '');
      const res = await post(request());
      expect((await res.json()).mock).toBe(true);
    });
  });

  describe('live mode', () => {
    beforeEach(() => {
      vi.stubEnv('TONELLE_MOCK', '');
      vi.stubEnv('IMAGE_PROVIDER', 'gemini');
      vi.stubEnv('GEMINI_API_KEY', 'g-test');
      vi.stubEnv('REVENUECAT_SECRET_KEY', 'sk_rc_test');
    });

    it('returns 402 without an appUserId', async () => {
      const res = await post(request());
      expect(res.status).toBe(402);
      expect((await res.json()).error.code).toBe('payment_required');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns 402 when RevenueCat has no active premium entitlement', async () => {
      fetchMock.mockResolvedValueOnce(
        Response.json({ subscriber: { entitlements: { premium: { expires_date: '2020-01-01T00:00:00Z' } } } }),
      );
      const res = await post(request({ appUserId: 'rc_user_1' }));
      expect(res.status).toBe(402);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]![0]).toBe('https://api.revenuecat.com/v1/subscribers/rc_user_1');
    });

    it('renders through the provider when entitled', async () => {
      fetchMock
        .mockResolvedValueOnce(Response.json({ subscriber: { entitlements: { premium: { expires_date: null } } } }))
        .mockResolvedValueOnce(
          Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'QUJD' } }] } }] }),
        );
      const res = await post(request({ appUserId: 'rc_user_2' }));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ image: 'data:image/png;base64,QUJD', lookId: 'soft_glam', mock: false });
      const prompt = JSON.parse(fetchMock.mock.calls[1]![1]!.body as string).contents[0].parts[1].text as string;
      expect(prompt).toContain('makeup');
    });

    it('returns 502 when the provider fails', async () => {
      fetchMock
        .mockResolvedValueOnce(Response.json({ subscriber: { entitlements: { premium: { expires_date: null } } } }))
        .mockResolvedValueOnce(new Response('quota exceeded for key AIza-secret', { status: 429 }));
      const res = await post(request({ appUserId: 'rc_user_3' }));
      expect(res.status).toBe(502);
      expect(await res.text()).not.toContain('AIza');
    });

    it('rate limits at 30 per hour per user', async () => {
      fetchMock.mockImplementation(async (url) =>
        String(url).includes('revenuecat')
          ? Response.json({ subscriber: { entitlements: {} } })
          : Response.json({}),
      );
      for (let i = 0; i < 30; i++) expect((await post(request({ appUserId: 'busy' }))).status).toBe(402);
      expect((await post(request({ appUserId: 'busy' }))).status).toBe(429);
      expect((await post(request({ appUserId: 'other' }))).status).toBe(402);
    });

    it('fails closed when RevenueCat is not configured', async () => {
      vi.stubEnv('REVENUECAT_SECRET_KEY', '');
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const res = await post(request({ appUserId: 'u' }));
      expect(res.status).toBe(500);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  it('answers CORS preflight', () => {
    expect(OPTIONS().status).toBe(204);
  });
});
