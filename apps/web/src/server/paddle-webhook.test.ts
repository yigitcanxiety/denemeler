import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { toMetaEvent, verifyPaddleSignature, type PaddleTransactionEvent } from './paddle-webhook';

const secret = 'pdl_ntfset_test';
const sign = (body: string, ts: number, key = secret) => `ts=${ts};h1=${createHmac('sha256', key).update(`${ts}:${body}`).digest('hex')}`;

describe('verifyPaddleSignature', () => {
  const body = '{"event_type":"transaction.completed"}';
  const now = 1_800_000_000;

  it('accepts a fresh, correctly signed body, including during key rotation', () => {
    expect(verifyPaddleSignature(body, sign(body, now), secret, now)).toBe(true);
    const rotated = `${sign(body, now, 'old')};h1=${sign(body, now).split('h1=')[1]}`;
    expect(verifyPaddleSignature(body, rotated, secret, now)).toBe(true);
  });

  it('rejects tampered, stale, foreign and missing signatures', () => {
    expect(verifyPaddleSignature(`${body} `, sign(body, now), secret, now)).toBe(false);
    expect(verifyPaddleSignature(body, sign(body, now - 600), secret, now)).toBe(false);
    expect(verifyPaddleSignature(body, sign(body, now, 'other'), secret, now)).toBe(false);
    expect(verifyPaddleSignature(body, null, secret, now)).toBe(false);
    expect(verifyPaddleSignature(body, 'ts=1;h1=zz', secret, now)).toBe(false);
  });
});

describe('toMetaEvent', () => {
  const event = (data: Partial<PaddleTransactionEvent['data']>): PaddleTransactionEvent => ({
    event_type: 'transaction.completed',
    occurred_at: '2026-10-11T08:00:00Z',
    data: {
      id: 'txn_1',
      origin: 'web',
      customer_id: 'ctm_1',
      subscription_id: 'sub_1',
      currency_code: 'TRY',
      custom_data: { appUserId: 'web_a', adConsent: true, fbp: 'fb.1.1.2' },
      details: { totals: { grand_total: '79999' } },
      ...data,
    },
  });

  it('sends nothing without ad consent or for other origins', () => {
    expect(toMetaEvent(event({ custom_data: { appUserId: 'web_a' } }), 'https://x', null)).toBeNull();
    expect(toMetaEvent(event({ origin: 'api' }), 'https://x', null)).toBeNull();
  });

  it('maps a plan checkout to StartTrial and renewals/reports to Purchase with value', () => {
    const trial = toMetaEvent(event({}), 'https://x', 'A@B.com ')!;
    expect(trial).toMatchObject({ event_name: 'StartTrial', event_id: 'txn_1', event_time: 1791705600, custom_data: { currency: 'TRY' } });
    expect(trial.custom_data.value).toBeUndefined();
    expect(trial.user_data.em).toEqual([toMetaEvent(event({}), 'https://x', 'a@b.com')!.user_data.em![0]]);
    expect(trial.user_data.fbp).toBe('fb.1.1.2');

    expect(toMetaEvent(event({ origin: 'subscription_recurring' }), 'https://x', null)).toMatchObject({
      event_name: 'Purchase',
      custom_data: { currency: 'TRY', value: 799.99 },
    });
    expect(toMetaEvent(event({ subscription_id: null }), 'https://x', null)?.event_name).toBe('Purchase');
  });
});
