import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkEntitlement, clearEntitlementCache, hasActiveEntitlement } from './revenuecat';

const NOW = Date.parse('2026-09-29T12:00:00Z');
const subscriber = (entitlements: Record<string, unknown>) => ({ subscriber: { entitlements } });

describe('hasActiveEntitlement', () => {
  it('is active when premium expires in the future', () => {
    expect(hasActiveEntitlement(subscriber({ premium: { expires_date: '2026-10-06T12:00:00Z' } }), 'premium', NOW)).toBe(true);
  });

  it('is active for lifetime purchases (expires_date null)', () => {
    expect(hasActiveEntitlement(subscriber({ premium: { expires_date: null } }), 'premium', NOW)).toBe(true);
  });

  it('is inactive when expired, unless in a grace period', () => {
    expect(hasActiveEntitlement(subscriber({ premium: { expires_date: '2026-09-01T00:00:00Z' } }), 'premium', NOW)).toBe(false);
    expect(
      hasActiveEntitlement(
        subscriber({ premium: { expires_date: '2026-09-01T00:00:00Z', grace_period_expires_date: '2026-10-01T00:00:00Z' } }),
        'premium',
        NOW,
      ),
    ).toBe(true);
  });

  it('is inactive when the entitlement or payload is missing', () => {
    expect(hasActiveEntitlement(subscriber({}), 'premium', NOW)).toBe(false);
    expect(hasActiveEntitlement(subscriber({ other: { expires_date: null } }), 'premium', NOW)).toBe(false);
    expect(hasActiveEntitlement({}, 'premium', NOW)).toBe(false);
    expect(hasActiveEntitlement(null, 'premium', NOW)).toBe(false);
    expect(hasActiveEntitlement(subscriber({ premium: {} }), 'premium', NOW)).toBe(false);
  });
});

describe('checkEntitlement', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    clearEntitlementCache();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('calls the v1 subscribers endpoint with a bearer key and caches positive results', async () => {
    fetchMock.mockImplementation(async () => Response.json(subscriber({ premium: { expires_date: null } })));
    expect(await checkEntitlement('user 1', 'sk_test', NOW)).toBe(true);
    expect(await checkEntitlement('user 1', 'sk_test', NOW + 60_000)).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.revenuecat.com/v1/subscribers/user%201');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer sk_test');
    // Cache expires after 5 minutes.
    await checkEntitlement('user 1', 'sk_test', NOW + 6 * 60_000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not cache negative results', async () => {
    fetchMock.mockImplementation(async () => Response.json(subscriber({})));
    expect(await checkEntitlement('u', 'sk', NOW)).toBe(false);
    expect(await checkEntitlement('u', 'sk', NOW)).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('treats 404 as not entitled and other errors as provider errors', async () => {
    fetchMock.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    expect(await checkEntitlement('u', 'sk', NOW)).toBe(false);
    fetchMock.mockResolvedValueOnce(new Response('secret details', { status: 500 }));
    await expect(checkEntitlement('u', 'sk', NOW)).rejects.toMatchObject({ code: 'provider_error' });
  });
});
