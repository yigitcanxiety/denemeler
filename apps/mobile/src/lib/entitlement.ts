import { ENTITLEMENT_ID } from '@tonelle/shared';

import { revenueCatKeyFor, type AppEnv, type MobilePlatform } from './config';

/**
 * 'revenuecat' when a RevenueCat key is configured for the platform; else local free 'dev'
 * purchases, but only in a dev build or with EXPO_PUBLIC_ALLOW_DEV_PURCHASES=1; otherwise
 * 'unavailable' (a release build without a key must never unlock anything).
 */
export type PurchasesMode = 'revenuecat' | 'dev' | 'unavailable';

export function purchasesModeFor(env: AppEnv, platform: MobilePlatform, isDevBuild: boolean): PurchasesMode {
  if (revenueCatKeyFor(env, platform)) return 'revenuecat';
  return isDevBuild || env.allowDevPurchases ? 'dev' : 'unavailable';
}

/** Minimal structural view of RevenueCat's CustomerInfo. */
export interface CustomerInfoLike {
  entitlements: { active: Record<string, { isActive?: boolean } | undefined> };
}

export function hasActiveEntitlement(
  info: CustomerInfoLike | null | undefined,
  entitlementId: string = ENTITLEMENT_ID,
): boolean {
  const entitlement = info?.entitlements.active[entitlementId];
  return entitlement !== undefined && entitlement.isActive !== false;
}

export interface PremiumInputs {
  mode: PurchasesMode;
  /** Entitlement state reported by RevenueCat. */
  revenueCatActive: boolean;
  /** Locally unlocked in dev purchases mode. */
  devEntitlement: boolean;
}

/** Single source of truth for "is the user premium?" across both purchase modes. */
export function isPremium({ mode, revenueCatActive, devEntitlement }: PremiumInputs): boolean {
  if (mode === 'unavailable') return false;
  return mode === 'dev' ? devEntitlement : revenueCatActive;
}
