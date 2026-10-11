import { ProviderError } from './errors';
import { fetchWithTimeout, readProviderJson } from './fetch';

/**
 * Paddle Billing as the source of truth for web purchases. No database: the buyer's anonymous
 * app user id travels in the checkout's custom_data, and render counters for trials and
 * one-time reports live in the Paddle entity's own custom_data.
 */

export interface PaddleConfig {
  apiKey: string;
  sandbox: boolean;
}

/** Looks a trialing subscription or a one-time report may create (DEVAM.md, 2026-10-11). */
export const INCLUDED_RENDERS = 10;

const TIMEOUT_MS = 10_000;

type CustomData = Record<string, unknown> | null;

interface PaddleTransaction {
  id: string;
  status: string;
  subscription_id: string | null;
  custom_data: CustomData;
}

interface PaddleSubscription {
  id: string;
  status: string;
  custom_data: CustomData;
}

async function api<T>(config: PaddleConfig, path: string, init: RequestInit = {}): Promise<T> {
  const base = config.sandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
  const label = `paddle ${init.method ?? 'GET'} ${path.split('/')[1]}`;
  const response = await fetchWithTimeout(
    `${base}${path}`,
    { ...init, headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' } },
    TIMEOUT_MS,
    label,
  );
  if (response.status === 404) throw new NotFound();
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`${label}: HTTP ${response.status}`, 'The payment service did not respond. Please try again.');
  }
  return ((await readProviderJson(response, label)) as { data: T }).data;
}

class NotFound extends Error {}

const ownedBy = (entity: { custom_data: CustomData }, appUserId: string) => entity.custom_data?.appUserId === appUserId;
const rendersUsed = (entity: { custom_data: CustomData }) => Number(entity.custom_data?.renders ?? 0) || 0;

/**
 * After checkout: confirms the transaction is paid and belongs to this browser, and returns
 * the reference to keep (the subscription for plans, the transaction for a one-time report).
 */
export async function claimPurchase(config: PaddleConfig, transactionId: string, appUserId: string): Promise<string | null> {
  try {
    const txn = await api<PaddleTransaction>(config, `/transactions/${transactionId}`);
    if (!['paid', 'completed'].includes(txn.status) || !ownedBy(txn, appUserId)) return null;
    return txn.subscription_id ?? txn.id;
  } catch (error) {
    if (error instanceof NotFound) return null;
    throw error;
  }
}

export type RenderAllowance = 'ok' | 'denied' | 'quota_exceeded';

/**
 * Checks (and, when it is limited, consumes) one render for a Paddle purchase.
 * Active subscriptions are unlimited (the per-user rate limit still applies); trials and
 * one-time reports get INCLUDED_RENDERS.
 * ponytail: read-then-write counter, so two parallel renders can both pass at the limit;
 * the client renders one look at a time, move to Redis if that ever matters.
 */
export async function consumeRender(config: PaddleConfig, paddleRef: string, appUserId: string): Promise<RenderAllowance> {
  try {
    if (paddleRef.startsWith('sub_')) {
      const sub = await api<PaddleSubscription>(config, `/subscriptions/${paddleRef}`);
      if (!ownedBy(sub, appUserId)) return 'denied';
      if (sub.status === 'active') return 'ok';
      if (sub.status !== 'trialing') return 'denied';
      return consume(config, `/subscriptions/${sub.id}`, sub);
    }
    const txn = await api<PaddleTransaction>(config, `/transactions/${paddleRef}`);
    if (!ownedBy(txn, appUserId) || txn.subscription_id || !['paid', 'completed'].includes(txn.status)) return 'denied';
    return consume(config, `/transactions/${txn.id}`, txn);
  } catch (error) {
    if (error instanceof NotFound) return 'denied';
    throw error;
  }
}

async function consume(config: PaddleConfig, path: string, entity: { custom_data: CustomData }): Promise<RenderAllowance> {
  const used = rendersUsed(entity);
  if (used >= INCLUDED_RENDERS) return 'quota_exceeded';
  await api(config, path, { method: 'PATCH', body: JSON.stringify({ custom_data: { ...entity.custom_data, renders: used + 1 } }) });
  return 'ok';
}
