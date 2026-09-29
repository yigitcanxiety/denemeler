import { ENTITLEMENT_ID } from '@tonelle/shared';
import { ProviderError } from './errors';
import { fetchWithTimeout, readProviderJson } from './fetch';

export const REVENUECAT_API = 'https://api.revenuecat.com/v1/subscribers/';
const REVENUECAT_TIMEOUT_MS = 10_000;
/** Positive results are cached briefly to avoid a RevenueCat round-trip per render. */
export const ENTITLEMENT_CACHE_TTL_MS = 5 * 60 * 1000;

interface EntitlementPayload {
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

const positiveCache = new Map<string, number>();

export function clearEntitlementCache(): void {
  positiveCache.clear();
}

/** Checks the `premium` entitlement via the RevenueCat REST API v1. */
export async function checkEntitlement(
  appUserId: string,
  secretKey: string,
  now: number = Date.now(),
): Promise<boolean> {
  const cachedUntil = positiveCache.get(appUserId);
  if (cachedUntil !== undefined) {
    if (cachedUntil > now) return true;
    positiveCache.delete(appUserId);
  }

  const response = await fetchWithTimeout(
    REVENUECAT_API + encodeURIComponent(appUserId),
    { method: 'GET', headers: { Authorization: `Bearer ${secretKey}`, Accept: 'application/json' } },
    REVENUECAT_TIMEOUT_MS,
    'revenuecat',
  );

  if (response.status === 404) {
    await response.body?.cancel().catch(() => undefined);
    return false;
  }
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`revenuecat: HTTP ${response.status}`, 'Could not verify your subscription. Please try again.');
  }

  const active = hasActiveEntitlement(await readProviderJson(response, 'revenuecat'), ENTITLEMENT_ID, now);
  if (active) {
    if (positiveCache.size > 10_000) positiveCache.clear();
    positiveCache.set(appUserId, now + ENTITLEMENT_CACHE_TTL_MS);
  }
  return active;
}
