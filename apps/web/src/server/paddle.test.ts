import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { claimPurchase, consumeRender, INCLUDED_RENDERS } from './paddle';

const config = { apiKey: 'pdl_sdbx_test', sandbox: true };
const ok = (data: unknown) => Response.json({ data });

describe('paddle', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('claims only paid transactions that belong to this browser', async () => {
    const txn = { id: 'txn_1', status: 'completed', subscription_id: 'sub_9', custom_data: { appUserId: 'web_a' } };
    fetchMock.mockImplementation(async () => ok(txn));
    expect(await claimPurchase(config, 'txn_1', 'web_a')).toBe('sub_9');
    expect(await claimPurchase(config, 'txn_1', 'web_b')).toBeNull();
    fetchMock.mockImplementation(async () => ok({ ...txn, status: 'ready' }));
    expect(await claimPurchase(config, 'txn_1', 'web_a')).toBeNull();
    expect(String(fetchMock.mock.calls[0]![0])).toBe('https://sandbox-api.paddle.com/transactions/txn_1');
  });

  it('lets active subscriptions render without counting', async () => {
    fetchMock.mockImplementation(async () => ok({ id: 'sub_1', status: 'active', custom_data: { appUserId: 'web_a' } }));
    expect(await consumeRender(config, 'sub_1', 'web_a')).toBe('ok');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await consumeRender(config, 'sub_1', 'web_b')).toBe('denied');
  });

  it('counts trial renders in custom_data and stops at the limit', async () => {
    const sub = { id: 'sub_1', status: 'trialing', custom_data: { appUserId: 'web_a', renders: 3 } };
    fetchMock.mockImplementation(async () => ok(sub));
    expect(await consumeRender(config, 'sub_1', 'web_a')).toBe('ok');
    const patch = fetchMock.mock.calls[1]!;
    expect(patch[1]?.method).toBe('PATCH');
    expect(JSON.parse(patch[1]?.body as string)).toEqual({ custom_data: { appUserId: 'web_a', renders: 4 } });

    fetchMock.mockImplementation(async () => ok({ ...sub, custom_data: { appUserId: 'web_a', renders: INCLUDED_RENDERS } }));
    expect(await consumeRender(config, 'sub_1', 'web_a')).toBe('quota_exceeded');
  });

  it('denies cancelled subscriptions and unknown references', async () => {
    fetchMock.mockImplementation(async () => ok({ id: 'sub_1', status: 'canceled', custom_data: { appUserId: 'web_a' } }));
    expect(await consumeRender(config, 'sub_1', 'web_a')).toBe('denied');
    fetchMock.mockImplementation(async () => new Response('{}', { status: 404 }));
    expect(await consumeRender(config, 'txn_1', 'web_a')).toBe('denied');
  });

  it('counts one-time report renders on the transaction', async () => {
    fetchMock.mockImplementation(async () =>
      ok({ id: 'txn_1', status: 'completed', subscription_id: null, custom_data: { appUserId: 'web_a' } }),
    );
    expect(await consumeRender(config, 'txn_1', 'web_a')).toBe('ok');
    expect(JSON.parse(fetchMock.mock.calls[1]![1]?.body as string).custom_data.renders).toBe(1);
  });
});
