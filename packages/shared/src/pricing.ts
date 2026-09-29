import type { Locale } from './schemas';

/**
 * Display-only plan definitions. Real prices always come from the App Store / Play Store
 * via RevenueCat; these are fallbacks for the web paywall and marketing pages.
 */

export const ENTITLEMENT_ID = 'premium';

export const PRODUCT_IDS = {
  weekly: 'tonelle_weekly',
  yearly: 'tonelle_yearly',
  report: 'tonelle_report',
} as const;

export type PlanId = keyof typeof PRODUCT_IDS;
export type ProductId = (typeof PRODUCT_IDS)[PlanId];
export type PricingRegion = 'TR' | 'EU';
export type Currency = 'TRY' | 'EUR';
export type BillingPeriod = 'week' | 'year' | 'once';

export interface PlanPrice {
  id: PlanId;
  productId: ProductId;
  period: BillingPeriod;
  currency: Currency;
  /** Regular price in major units (e.g. 129.99). */
  amount: number;
  /** Discounted price for the first billing period, if any. */
  introAmount?: number;
  /** Free trial length in days, if any. */
  trialDays?: number;
  /** Auto-renewing subscription (false for one-time purchases). */
  autoRenews: boolean;
}

export const PRICING: Record<PricingRegion, Record<PlanId, PlanPrice>> = {
  TR: {
    weekly: {
      id: 'weekly',
      productId: PRODUCT_IDS.weekly,
      period: 'week',
      currency: 'TRY',
      amount: 129.99,
      introAmount: 39.99,
      autoRenews: true,
    },
    yearly: {
      id: 'yearly',
      productId: PRODUCT_IDS.yearly,
      period: 'year',
      currency: 'TRY',
      amount: 799.99,
      trialDays: 3,
      autoRenews: true,
    },
    report: {
      id: 'report',
      productId: PRODUCT_IDS.report,
      period: 'once',
      currency: 'TRY',
      amount: 199,
      autoRenews: false,
    },
  },
  EU: {
    weekly: {
      id: 'weekly',
      productId: PRODUCT_IDS.weekly,
      period: 'week',
      currency: 'EUR',
      amount: 3.99,
      autoRenews: true,
    },
    yearly: {
      id: 'yearly',
      productId: PRODUCT_IDS.yearly,
      period: 'year',
      currency: 'EUR',
      amount: 24.99,
      trialDays: 3,
      autoRenews: true,
    },
    report: {
      id: 'report',
      productId: PRODUCT_IDS.report,
      period: 'once',
      currency: 'EUR',
      amount: 6.99,
      autoRenews: false,
    },
  },
};

/** Exit offer shown when the paywall is dismissed: 50% off the yearly plan. */
export const EXIT_OFFER = { plan: 'yearly' as PlanId, discountPercent: 50 } as const;

/** Picks the display region from an ISO 3166-1 alpha-2 country code (anything but TR → EU). */
export function regionForCountry(countryCode: string | null | undefined): PricingRegion {
  return countryCode?.toUpperCase() === 'TR' ? 'TR' : 'EU';
}

/** Best guess when only the UI locale is known. */
export function regionForLocale(locale: Locale): PricingRegion {
  return locale === 'tr' ? 'TR' : 'EU';
}

export function formatPrice(amount: number, currency: Currency, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function exitOfferAmount(region: PricingRegion): number {
  const yearly = PRICING[region][EXIT_OFFER.plan];
  return Math.floor(yearly.amount * (100 - EXIT_OFFER.discountPercent)) / 100;
}

/** Yearly price expressed per week, for "only X / week" copy. */
export function weeklyEquivalent(amount: number, period: BillingPeriod): number {
  if (period === 'year') return Math.round((amount / 52) * 100) / 100;
  return amount;
}
