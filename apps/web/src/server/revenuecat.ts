import { ENTITLEMENT_ID } from '@tonelle/shared';
import { ProviderError } from './errors';
import { fetchWithTimeout, readProviderJson } from './fetch';
import { INCLUDED_RENDERS, type RenderAllowance } from './paddle';

export const REVENUECAT_API = 'https://api.revenuecat.com/v1/subscribers/';
const REVENUECAT_TIMEOUT_MS = 10_000;
const DAY_MS = 24 * 60 * 60 * 1000;

interface EntitlementPayload {
  product_identifier?: string;
  purchase_date?: string;
  expires_date?: string | null;
  grace_period_expires_date?: string | null;
}

/**
 * True when the subscriber payload has an active `entitlementId`:
 * `expires_date` null (lifetime / non-consumable) or in the future, or a future grace period.
 */
export function hasActiveEntitlement(payload: unknown, entitlementId: string = ENTITLEMENT_ID, now = Date.now()): boolean {
  const entitlements = (payload as { subscriber?: { entitlements?: Record<string, EntitlementPayload> } } | null)
    ?.subscriber?.entitlements;
  const entitlement = entitlements?.[entitlementId];
  if (!entitlement || typeof entitlement !== 'object') return false;

  const isFuture = (value: string | null | undefined) => {
    if (typeof value !== 'string') return false;
    const time = Date.parse(value);
    return Number.isFinite(time) && time > now;
  };

  if (entitlement.expires_date === null) return true;
  return isFuture(entitlement.expires_date) || isFuture(entitlement.grace_period_expires_date);
}

/**
 * Render allowance per plan (2026-10-19 prices). A render is ~$0.04 (~₺2 with retries); a user
 * who maxes out costs at most ~37% of Apple's net (weekly ₺134/week, yearly ₺1,050/yr) and still
 * leaves a profit on the yearly exit offer (₺525/yr). Trials and lifetime purchases get 10.
 */
export const RENDER_LIMITS = {
  trial: { limit: INCLUDED_RENDERS, periodMs: Infinity },
  once: { limit: INCLUDED_RENDERS, periodMs: Infinity },
  weekly: { limit: 25, periodMs: 7 * DAY_MS },
  yearly: { limit: 15, periodMs: 30 * DAY_MS },
} as const;

/** Subscriber attribute holding `<period key>|<renders used>`. */
const COUNTER_ATTRIBUTE = 'tonelle_renders';

interface SubscriberPayload {
  subscriber?: {
    entitlements?: Record<string, EntitlementPayload>;
    subscriptions?: Record<string, { period_type?: string }>;
    subscriber_attributes?: Record<string, { value?: string }>;
  };
}

/** Which quota applies and which period it counts in, or null when not entitled. */
export function renderPeriod(payload: unknown, now = Date.now()): { key: string; limit: number } | null {
  if (!hasActiveEntitlement(payload, ENTITLEMENT_ID, now)) return null;
  const subscriber = (payload as SubscriberPayload).subscriber!;
  const entitlement = subscriber.entitlements![ENTITLEMENT_ID]!;
  const product = entitlement.product_identifier ?? '';
  const start = Date.parse(entitlement.purchase_date ?? '') || 0;
  const plan =
    entitlement.expires_date === null
      ? 'once'
      : subscriber.subscriptions?.[product]?.period_type === 'trial'
        ? 'trial'
        : product.includes('yearly')
          ? 'yearly'
          : 'weekly';
  const { limit, periodMs } = RENDER_LIMITS[plan];
  const bucket = Number.isFinite(periodMs) ? Math.floor(Math.max(0, now - start) / periodMs) : 0;
  return { key: `${plan}:${start}:${bucket}`, limit };
}

/**
 * Checks the `premium` entitlement via the RevenueCat REST API v1 and consumes one render from
 * the plan's quota. The counter lives in a subscriber attribute, so no database is needed.
 * ponytail: read-then-write counter, two parallel renders can both pass at the limit; the
 * client renders one look at a time, move to Redis if that ever matters.
 */
export async function consumeAppRender(appUserId: string, secretKey: string, now: number = Date.now()): Promise<RenderAllowance> {
  const url = REVENUECAT_API + encodeURIComponent(appUserId);
  const headers = { Authorization: `Bearer ${secretKey}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  const payload = await fetchSubscriber(url, headers);
  if (!payload) return 'denied';
  const period = renderPeriod(payload, now);
  if (!period) return 'denied';

  const [key, count] = (payload.subscriber?.subscriber_attributes?.[COUNTER_ATTRIBUTE]?.value ?? '').split('|');
  const used = key === period.key ? Number(count) || 0 : 0;
  if (used >= period.limit) return 'quota_exceeded';

  const write = await fetchWithTimeout(
    `${url}/attributes`,
    { method: 'POST', headers, body: JSON.stringify({ attributes: { [COUNTER_ATTRIBUTE]: { value: `${period.key}|${used + 1}` } } }) },
    REVENUECAT_TIMEOUT_MS,
    'revenuecat',
  );
  await write.body?.cancel().catch(() => undefined);
  // Fail closed: an uncounted render would be a free one.
  if (!write.ok) throw new ProviderError(`revenuecat attributes: HTTP ${write.status}`, 'Could not verify your subscription. Please try again.');
  return 'ok';
}

/** True when the app user has an active `premium` entitlement (no quota is consumed). */
export async function hasAppEntitlement(appUserId: string, secretKey: string, now: number = Date.now()): Promise<boolean> {
  const url = REVENUECAT_API + encodeURIComponent(appUserId);
  const payload = await fetchSubscriber(url, { Authorization: `Bearer ${secretKey}`, Accept: 'application/json' });
  return payload !== null && hasActiveEntitlement(payload, ENTITLEMENT_ID, now);
}

/** GET /v1/subscribers/{id}; null for an unknown subscriber (404), throws on other errors. */
async function fetchSubscriber(url: string, headers: Record<string, string>): Promise<SubscriberPayload | null> {
  const response = await fetchWithTimeout(url, { method: 'GET', headers }, REVENUECAT_TIMEOUT_MS, 'revenuecat');
  if (response.status === 404) {
    await response.body?.cancel().catch(() => undefined);
    return null;
  }
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`revenuecat: HTTP ${response.status}`, 'Could not verify your subscription. Please try again.');
  }
  return (await readProviderJson(response, 'revenuecat')) as SubscriberPayload;
}
