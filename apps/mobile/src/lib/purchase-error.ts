import type { TranslationKey } from '@tonelle/shared';

/** Why a purchase / restore ended without an active entitlement (the UI maps it to a message). */
export type PurchaseFailure = 'unavailable' | 'pending' | 'not_active';

export class PurchaseFailureError extends Error {
  constructor(readonly reason: PurchaseFailure) {
    super(`Purchase failure: ${reason}`);
    this.name = 'PurchaseFailureError';
  }
}

const FAILURE_KEYS: Record<PurchaseFailure, TranslationKey> = {
  unavailable: 'paywall.purchaseUnavailable',
  pending: 'paywall.purchasePending',
  not_active: 'paywall.purchaseNotActive',
};

/** Localized message key for a purchase error; `fallback` for anything that is not a PurchaseFailureError. */
export function purchaseMessageKey(error: unknown, fallback: TranslationKey): TranslationKey {
  return error instanceof PurchaseFailureError ? FAILURE_KEYS[error.reason] : fallback;
}
