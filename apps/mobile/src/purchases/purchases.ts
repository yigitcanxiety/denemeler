import { ENTITLEMENT_ID, regionForLocale, type Locale } from '@tonelle/shared';
import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesPackage,
} from 'react-native-purchases';

import { revenueCatKeyFor, type MobilePlatform } from '@/lib/config';
import { hasActiveEntitlement, purchasesModeFor } from '@/lib/entitlement';
import { env } from '@/lib/env';
import {
  devExitPlan,
  devPlans,
  exitOfferPlanFrom,
  plansFromOfferings,
  type PaywallPlan,
} from '@/lib/paywall';
import { useAppStore } from '@/store/app-store';

/**
 * Purchases facade.
 * - 'revenuecat': real store purchases through RevenueCat (keys from EXPO_PUBLIC_RC_*_KEY).
 * - 'dev': no keys configured → plans come from the shared price list and "purchasing"
 *   only flips a local flag. Clearly labelled DEV in the UI. Never ship without keys.
 */
export const purchasesMode = purchasesModeFor(env, Platform.OS as MobilePlatform);
export const isDevPurchases = purchasesMode === 'dev';

export type Plan = PaywallPlan<PurchasesPackage | null>;
export type PurchaseOutcome = 'success' | 'cancelled';

let configured = false;

function applyCustomerInfo(info: CustomerInfo): boolean {
  const active = hasActiveEntitlement(info, ENTITLEMENT_ID);
  useAppStore.getState().setRevenueCatPremium(active);
  return active;
}

/** Configures RevenueCat once with the persisted anonymous id as appUserID. */
export function initPurchases(appUserId: string): void {
  if (isDevPurchases || configured) return;
  const apiKey = revenueCatKeyFor(env, Platform.OS as MobilePlatform);
  if (!apiKey) return;
  if (__DEV__) void Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({ apiKey, appUserID: appUserId });
  configured = true;
  Purchases.addCustomerInfoUpdateListener(applyCustomerInfo);
  void refreshPremium();
}

export async function refreshPremium(): Promise<boolean> {
  if (isDevPurchases) return useAppStore.getState().devEntitlement;
  if (!configured) return false;
  try {
    return applyCustomerInfo(await Purchases.getCustomerInfo());
  } catch {
    return useAppStore.getState().revenueCatPremium;
  }
}

/** Switches RevenueCat to a new anonymous id (after "delete my data"). */
export async function switchUser(appUserId: string): Promise<void> {
  if (isDevPurchases || !configured) return;
  try {
    const { customerInfo } = await Purchases.logIn(appUserId);
    applyCustomerInfo(customerInfo);
  } catch {
    // Non-fatal: purchases can still be restored later.
  }
}

export interface PaywallData {
  plans: Plan[];
  exitOffer: Plan | null;
}

export async function loadPaywall(locale: Locale): Promise<PaywallData> {
  if (isDevPurchases) {
    const region = regionForLocale(locale);
    return { plans: devPlans(region, locale), exitOffer: devExitPlan(region, locale) };
  }
  const offerings = await Purchases.getOfferings();
  return { plans: plansFromOfferings(offerings), exitOffer: exitOfferPlanFrom(offerings) };
}

function isCancelled(error: unknown): boolean {
  const e = error as Partial<PurchasesError> | null;
  return e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || e?.userCancelled === true;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Purchases a plan. Resolves 'cancelled' when the user backs out; throws on real failures. */
export async function purchasePlan(plan: Plan): Promise<PurchaseOutcome> {
  if (isDevPurchases || !plan.source) {
    await wait(600);
    useAppStore.getState().setDevEntitlement(true);
    return 'success';
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.source);
    if (!applyCustomerInfo(customerInfo)) throw new Error('Entitlement not active after purchase');
    return 'success';
  } catch (error) {
    if (isCancelled(error)) return 'cancelled';
    throw error;
  }
}

/** Restores purchases; resolves true when the premium entitlement is active afterwards. */
export async function restorePurchases(): Promise<boolean> {
  if (isDevPurchases) {
    await wait(400);
    return useAppStore.getState().devEntitlement;
  }
  return applyCustomerInfo(await Purchases.restorePurchases());
}

export async function manageSubscriptions(): Promise<void> {
  if (isDevPurchases || !configured) return;
  await Purchases.showManageSubscriptions();
}
