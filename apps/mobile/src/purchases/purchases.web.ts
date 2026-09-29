import { regionForLocale, type Locale } from '@tonelle/shared';

import { devExitPlan, devPlans, type PaywallPlan } from '@/lib/paywall';
import { useAppStore } from '@/store/app-store';

/**
 * Web (browser preview) variant of purchases/purchases.ts. There is no store on the web, so it
 * always runs in local "dev purchases" mode (clearly labelled DEV on the paywall) and never
 * loads the RevenueCat SDK. Same exports as the native module.
 */
export const purchasesMode = 'dev' as const;
export const isDevPurchases = true;

export type Plan = PaywallPlan<null>;
export type PurchaseOutcome = 'success' | 'cancelled';

export interface PaywallData {
  plans: Plan[];
  exitOffer: Plan | null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function initPurchases(_appUserId: string): void {}

export async function refreshPremium(): Promise<boolean> {
  return useAppStore.getState().devEntitlement;
}

export async function switchUser(_appUserId: string): Promise<void> {}

export async function loadPaywall(locale: Locale): Promise<PaywallData> {
  const region = regionForLocale(locale);
  return { plans: devPlans(region, locale), exitOffer: devExitPlan(region, locale) };
}

export async function purchasePlan(_plan: Plan): Promise<PurchaseOutcome> {
  await wait(600);
  useAppStore.getState().setDevEntitlement(true);
  return 'success';
}

export async function restorePurchases(): Promise<boolean> {
  await wait(400);
  return useAppStore.getState().devEntitlement;
}

export async function manageSubscriptions(): Promise<void> {}
