import { ENTITLEMENT_ID, regionForLocale, type Locale } from '@tonelle/shared';
import { Platform } from 'react-native';
import Purchases, {
  INTRO_ELIGIBILITY_STATUS,
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
import { PurchaseFailureError } from '@/lib/purchase-error';
import { useAppStore } from '@/store/app-store';

/**
 * Purchases facade.
 * - 'revenuecat': real store purchases through RevenueCat (keys from EXPO_PUBLIC_RC_*_KEY).
 * - 'dev': no key, and either a dev build or EXPO_PUBLIC_ALLOW_DEV_PURCHASES=1 → plans come
 *   from the shared price list and "purchasing" only flips a local flag (labelled DEV in the UI).
 * - 'unavailable': release build without a key and without the flag → nothing can be bought
 *   or unlocked.
 */
export const purchasesMode = purchasesModeFor(env, Platform.OS as MobilePlatform, __DEV__);
export const isDevPurchases = purchasesMode === 'dev';
export const isUnavailablePurchases = purchasesMode === 'unavailable';

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
  if (isUnavailablePurchases) return { plans: [], exitOffer: null };
  if (isDevPurchases) {
    const region = regionForLocale(locale);
    return { plans: devPlans(region, locale), exitOffer: devExitPlan(region, locale) };
  }
  // The store answering without products (e.g. Paid Apps agreement not active) is not a network problem.
  const offerings = await Purchases.getOfferings().catch((error: Partial<PurchasesError>) => {
    throw error?.code === PURCHASES_ERROR_CODE.NETWORK_ERROR ? error : new PurchaseFailureError('unavailable');
  });
  const plans = plansFromOfferings(offerings);
  if (!plans.length) throw new PurchaseFailureError('unavailable');
  const exitOffer = exitOfferPlanFrom(offerings);
  return Platform.OS === 'ios' ? withIosTrialEligibility(plans, exitOffer) : { plans, exitOffer };
}

/**
 * iOS lists the trial on every product, even for people who already used it. Show it only when
 * StoreKit confirms eligibility; unknown → regular price, as RevenueCat advises (App Review 3.1.2).
 */
async function withIosTrialEligibility(plans: Plan[], exitOffer: Plan | null): Promise<PaywallData> {
  const all = exitOffer ? [...plans, exitOffer] : plans;
  const ids = all.flatMap((p) => (p.intro && p.source ? [p.source.product.identifier] : []));
  if (!ids.length) return { plans, exitOffer };
  const eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility(ids).catch(() => ({}));
  const keep = (plan: Plan): Plan =>
    plan.intro &&
    plan.source &&
    (eligibility as Record<string, { status: INTRO_ELIGIBILITY_STATUS } | undefined>)[plan.source.product.identifier]?.status !==
      INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE
      ? { ...plan, intro: null }
      : plan;
  return { plans: plans.map(keep), exitOffer: exitOffer && keep(exitOffer) };
}

function isCancelled(error: unknown): boolean {
  const e = error as Partial<PurchasesError> | null;
  return e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || e?.userCancelled === true;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Purchases a plan. Resolves 'cancelled' when the user backs out; throws on real failures
 * (a PurchaseFailureError for unavailable / pending approval / entitlement not yet active).
 */
export async function purchasePlan(plan: Plan): Promise<PurchaseOutcome> {
  if (isUnavailablePurchases) throw new PurchaseFailureError('unavailable');
  if (isDevPurchases || !plan.source) {
    await wait(600);
    useAppStore.getState().setDevEntitlement(true);
    return 'success';
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.source);
    // StoreKit may have charged already: do not claim otherwise, point to "Restore purchases".
    if (!applyCustomerInfo(customerInfo)) throw new PurchaseFailureError('not_active');
    return 'success';
  } catch (error) {
    if (isCancelled(error)) return 'cancelled';
    // Ask to Buy / deferred payment: the entitlement arrives later via the customer-info listener.
    if ((error as Partial<PurchasesError> | null)?.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
      throw new PurchaseFailureError('pending');
    }
    throw error;
  }
}

/** Restores purchases; resolves true when the premium entitlement is active afterwards. */
export async function restorePurchases(): Promise<boolean> {
  if (isUnavailablePurchases) throw new PurchaseFailureError('unavailable');
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
