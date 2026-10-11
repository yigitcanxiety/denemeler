import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { ServerConfig } from './env';
import { ProviderError } from './errors';
import { fetchWithTimeout } from './fetch';
import { getCustomerEmail } from './paddle';

/**
 * Paddle notifications → Meta Conversions API. No database: the transaction id is Meta's
 * event_id, so Paddle's retries and the browser pixel's copy of the same event deduplicate.
 * Only buyers who accepted ad cookies (custom_data.adConsent, set at checkout) are sent.
 */

const MAX_SKEW_SECONDS = 300;
const META_API = 'https://graph.facebook.com/v21.0';

/** Checks `Paddle-Signature: ts=…;h1=…` (HMAC-SHA256 of `${ts}:${rawBody}`), allowing key rotation. */
export function verifyPaddleSignature(rawBody: string, header: string | null, secret: string, nowSeconds = Date.now() / 1000): boolean {
  if (!header) return false;
  const parts = header.split(';').map((p) => p.split('='));
  const ts = parts.find(([k]) => k === 'ts')?.[1];
  if (!ts || Math.abs(nowSeconds - Number(ts)) > MAX_SKEW_SECONDS) return false;
  const expected = createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest();
  return parts
    .filter(([k]) => k === 'h1')
    .some(([, h]) => {
      const given = Buffer.from(h ?? '', 'hex');
      return given.length === expected.length && timingSafeEqual(given, expected);
    });
}

interface PaddleTransactionEvent {
  event_type: string;
  occurred_at: string;
  data: {
    id: string;
    origin: string;
    customer_id: string | null;
    subscription_id: string | null;
    currency_code: string;
    custom_data: Record<string, unknown> | null;
    details?: { totals?: { grand_total?: string } };
  };
}

export interface MetaEvent {
  event_name: 'Purchase' | 'StartTrial';
  event_time: number;
  event_id: string;
  action_source: 'website';
  event_source_url: string;
  user_data: Record<string, string | string[]>;
  custom_data: { currency: string; value?: number };
}

const sha256 = (value: string) => createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
const str = (value: unknown) => (typeof value === 'string' && value ? value : undefined);

/**
 * Maps a notification to the Meta event it represents, or null: first checkout of a plan →
 * StartTrial, one-time report → Purchase, renewal (incl. the first charge after the trial) → Purchase.
 */
export function toMetaEvent(event: PaddleTransactionEvent, siteUrl: string, email: string | null): MetaEvent | null {
  const txn = event.data;
  const custom = txn.custom_data ?? {};
  if (event.event_type !== 'transaction.completed' || custom.adConsent !== true) return null;
  let name: MetaEvent['event_name'];
  if (txn.origin === 'subscription_recurring') name = 'Purchase';
  else if (txn.origin === 'web') name = txn.subscription_id ? 'StartTrial' : 'Purchase';
  else return null;

  const userData: MetaEvent['user_data'] = {};
  if (email) userData.em = [sha256(email)];
  if (str(custom.appUserId)) userData.external_id = [sha256(custom.appUserId as string)];
  if (str(custom.fbp)) userData.fbp = custom.fbp as string;
  if (str(custom.fbc)) userData.fbc = custom.fbc as string;
  if (str(custom.ua)) userData.client_user_agent = custom.ua as string;

  const total = Number(txn.details?.totals?.grand_total ?? 0) / 100;
  return {
    event_name: name,
    event_time: Math.floor(Date.parse(event.occurred_at) / 1000),
    event_id: txn.id,
    action_source: 'website',
    event_source_url: siteUrl,
    user_data: userData,
    custom_data: { currency: txn.currency_code, ...(name === 'Purchase' ? { value: total } : {}) },
  };
}

/** Handles one verified notification; throws on a Meta/Paddle failure so Paddle retries. */
export async function forwardToMeta(config: ServerConfig, event: PaddleTransactionEvent): Promise<'sent' | 'skipped'> {
  if (!config.metaCapi || event.event_type !== 'transaction.completed') return 'skipped';
  const customerId = event.data.customer_id;
  const email = customerId && config.paddle ? await getCustomerEmail(config.paddle, customerId) : null;
  const metaEvent = toMetaEvent(event, config.siteUrl, email);
  if (!metaEvent) return 'skipped';
  const response = await fetchWithTimeout(
    `${META_API}/${config.metaCapi.pixelId}/events`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [metaEvent], access_token: config.metaCapi.token }),
    },
    10_000,
    'meta capi',
  );
  await response.body?.cancel().catch(() => undefined);
  if (!response.ok) throw new ProviderError(`meta capi: HTTP ${response.status}`);
  return 'sent';
}

export type { PaddleTransactionEvent };
