import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { consumeAppRender, hasActiveEntitlement, renderPeriod } from './revenuecat';

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

describe('renderPeriod', () => {
  const sub = (premium: Record<string, unknown>, periodType = 'normal') => ({
    subscriber: {
      entitlements: { premium },
      subscriptions: { [String(premium.product_identifier)]: { period_type: periodType } },
    },
  });
  const weekly = { product_identifier: 'tonelle_weekly', purchase_date: '2026-09-29T00:00:00Z', expires_date: '2026-10-06T00:00:00Z' };
  const yearly = { product_identifier: 'tonelle_yearly', purchase_date: '2026-01-01T00:00:00Z', expires_date: '2027-01-01T00:00:00Z' };

  it('gives each plan its own quota', () => {
    expect(renderPeriod(sub(weekly), NOW)?.limit).toBe(25);
    expect(renderPeriod(sub(weekly, 'trial'), NOW)?.limit).toBe(10);
    expect(renderPeriod(sub(yearly), NOW)?.limit).toBe(15);
    expect(renderPeriod(sub({ product_identifier: 'tonelle_report', expires_date: null }), NOW)?.limit).toBe(10);
    expect(renderPeriod(subscriber({}), NOW)).toBeNull();
  });

  it('starts a new yearly period every 30 days', () => {
    const a = renderPeriod(sub(yearly), NOW)!.key;
    expect(renderPeriod(sub(yearly), NOW + 86_400_000)!.key).toBe(a);
    expect(renderPeriod(sub(yearly), NOW + 31 * 86_400_000)!.key).not.toBe(a);
  });
});

describe('consumeAppRender', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  const lifetime = (counter?: string) => ({
    subscriber: {
      entitlements: { premium: { product_identifier: 'tonelle_report', expires_date: null } },
      subscriber_attributes: counter ? { tonelle_renders: { value: counter } } : {},
    },
  });

  it('counts a render in a subscriber attribute', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(lifetime())).mockResolvedValueOnce(Response.json({}));
    expect(await consumeAppRender('user 1', 'sk_test', NOW)).toBe('ok');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.revenuecat.com/v1/subscribers/user%201');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer sk_test');
    const [writeUrl, write] = fetchMock.mock.calls[1]!;
    expect(writeUrl).toBe('https://api.revenuecat.com/v1/subscribers/user%201/attributes');
    expect(JSON.parse(write!.body as string).attributes.tonelle_renders.value).toBe('once:0:0|1');
  });

  it('stops at the limit and resets in a new period', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(lifetime('once:0:0|10')));
    expect(await consumeAppRender('u', 'sk', NOW)).toBe('quota_exceeded');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fetchMock.mockResolvedValueOnce(Response.json(lifetime('weekly:1:3|25'))).mockResolvedValueOnce(Response.json({}));
    expect(await consumeAppRender('u', 'sk', NOW)).toBe('ok');
  });

  it('fails closed when the counter cannot be written', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(lifetime())).mockResolvedValueOnce(new Response('x', { status: 500 }));
    await expect(consumeAppRender('u', 'sk', NOW)).rejects.toMatchObject({ code: 'provider_error' });
  });

  it('treats 404 and inactive entitlements as denied and other errors as provider errors', async () => {
    fetchMock.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    expect(await consumeAppRender('u', 'sk', NOW)).toBe('denied');
    fetchMock.mockResolvedValueOnce(Response.json(subscriber({})));
    expect(await consumeAppRender('u', 'sk', NOW)).toBe('denied');
    fetchMock.mockResolvedValueOnce(new Response('secret details', { status: 500 }));
    await expect(consumeAppRender('u', 'sk', NOW)).rejects.toMatchObject({ code: 'provider_error' });
  });
});
