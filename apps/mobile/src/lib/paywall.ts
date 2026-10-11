import {
  EXIT_OFFER,
  PRICING,
  PRODUCT_IDS,
  formatPrice,
  regionForLocale,
  weeklyEquivalent,
  type Locale,
  type PlanId,
  type PricingRegion,
  type TranslationKey,
  type TranslationVars,
} from '@tonelle/shared';

/** Identifier of the RevenueCat offering used for the paywall exit offer. */
export const EXIT_OFFER_IDENTIFIER = 'exit_offer';

export type PlanKind = PlanId | 'other';
export type PeriodUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'UNKNOWN';

/* ---------- Structural views of RevenueCat types (keeps this module RN-free) ---------- */

export interface PricingPhaseLike {
  billingPeriod: { unit: string; value: number };
  price: { formatted: string; amountMicros: number };
}

export interface StoreProductLike {
  identifier: string;
  price: number;
  priceString: string;
  currencyCode: string;
  pricePerWeekString?: string | null;
  introPrice?: {
    price: number;
    priceString: string;
    periodUnit: string;
    periodNumberOfUnits: number;
    cycles: number;
  } | null;
  defaultOption?: { freePhase?: PricingPhaseLike | null; introPhase?: PricingPhaseLike | null } | null;
}

export interface PackageLike {
  identifier: string;
  packageType: string;
  product: StoreProductLike;
}

export interface OfferingLike<P extends PackageLike = PackageLike> {
  identifier: string;
  availablePackages: P[];
  annual?: P | null;
}

export interface OfferingsLike<P extends PackageLike = PackageLike> {
  current: OfferingLike<P> | null;
  all: Record<string, OfferingLike<P>>;
}

/* ---------- Normalised plan used by the paywall UI ---------- */

export interface IntroOffer {
  /** Free trial or discounted first period(s). */
  type: 'trial' | 'discount';
  priceString: string;
  unit: PeriodUnit;
  units: number;
  /** Trial / intro length in days (approximate for months/years). */
  days: number;
}

export interface PaywallPlan<P = unknown> {
  /** Stable key (package identifier). */
  key: string;
  kind: PlanKind;
  priceString: string;
  price: number;
  /** Price expressed per week for yearly plans ("only X/week"). */
  pricePerWeekString: string | null;
  intro: IntroOffer | null;
  /** The underlying store package (RevenueCat `PurchasesPackage`), null in dev mode. */
  source: P | null;
}

const UNIT_DAYS: Record<PeriodUnit, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365, UNKNOWN: 0 };

export function normalizeUnit(unit: string): PeriodUnit {
  const upper = unit.toUpperCase();
  return upper === 'DAY' || upper === 'WEEK' || upper === 'MONTH' || upper === 'YEAR' ? upper : 'UNKNOWN';
}

export function periodDays(unit: string, units: number): number {
  return UNIT_DAYS[normalizeUnit(unit)] * units;
}

/** Store product ids may carry an Android base-plan suffix, e.g. "tonelle_yearly:annual". */
function baseProductId(productId: string): string {
  return productId.split(':')[0] ?? productId;
}

export function planKindOf(pkg: PackageLike): PlanKind {
  const productId = baseProductId(pkg.product.identifier);
  if (pkg.packageType === 'WEEKLY' || productId === PRODUCT_IDS.weekly) return 'weekly';
  if (pkg.packageType === 'ANNUAL' || productId === PRODUCT_IDS.yearly) return 'yearly';
  if (productId === PRODUCT_IDS.report) return 'report';
  return 'other';
}

function phaseToIntro(phase: PricingPhaseLike, type: IntroOffer['type']): IntroOffer {
  const unit = normalizeUnit(phase.billingPeriod.unit);
  return {
    type,
    priceString: phase.price.formatted,
    unit,
    units: phase.billingPeriod.value,
    days: periodDays(unit, phase.billingPeriod.value),
  };
}

/** Extracts the free trial / intro price from a store product (iOS introPrice or Android offer phases). */
export function introOfferOf(product: StoreProductLike): IntroOffer | null {
  const option = product.defaultOption;
  if (option?.freePhase) return phaseToIntro(option.freePhase, 'trial');
  if (option?.introPhase) return phaseToIntro(option.introPhase, 'discount');
  const intro = product.introPrice;
  if (intro) {
    const unit = normalizeUnit(intro.periodUnit);
    const units = intro.periodNumberOfUnits * Math.max(1, intro.cycles);
    return {
      type: intro.price === 0 ? 'trial' : 'discount',
      priceString: intro.priceString,
      unit,
      units,
      days: periodDays(unit, units),
    };
  }
  return null;
}

export function toPaywallPlan<P extends PackageLike>(pkg: P): PaywallPlan<P> {
  const kind = planKindOf(pkg);
  return {
    key: pkg.identifier,
    kind,
    priceString: pkg.product.priceString,
    price: pkg.product.price,
    pricePerWeekString: kind === 'yearly' ? (pkg.product.pricePerWeekString ?? null) : null,
    intro: introOfferOf(pkg.product),
    source: pkg,
  };
}

const KIND_ORDER: Record<PlanKind, number> = { yearly: 0, weekly: 1, report: 2, other: 3 };

/** Plans from the current offering (yearly, weekly, one-time report), yearly first. */
export function plansFromOfferings<P extends PackageLike>(offerings: OfferingsLike<P> | null): PaywallPlan<P>[] {
  const packages = offerings?.current?.availablePackages ?? [];
  return packages
    .map((pkg) => toPaywallPlan(pkg))
    .filter((plan) => plan.kind !== 'other')
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
}

/** Package of the "exit_offer" offering (its annual package, else its first package), if configured. */
export function exitOfferPlanFrom<P extends PackageLike>(offerings: OfferingsLike<P> | null): PaywallPlan<P> | null {
  const offering = offerings?.all[EXIT_OFFER_IDENTIFIER];
  const pkg = offering?.annual ?? offering?.availablePackages[0];
  return pkg ? toPaywallPlan(pkg) : null;
}

/** Plan pre-selected on open: the yearly plan (trial highlighted), else the first one. */
export function defaultPlanKey(plans: readonly PaywallPlan[]): string | null {
  return (plans.find((p) => p.kind === 'yearly') ?? plans[0])?.key ?? null;
}

/** Discount of the exit offer vs. the regular yearly price, falling back to the configured percent. */
export function exitDiscountPercent(regular: PaywallPlan | undefined, offer: PaywallPlan): number {
  if (regular && regular.price > 0 && offer.price > 0 && offer.price < regular.price) {
    return Math.round((1 - offer.price / regular.price) * 100);
  }
  return EXIT_OFFER.discountPercent;
}

/** Saving of the yearly plan vs. paying weekly for a year ("En avantajlı · %88"), or null. */
export function yearlySavingsPercent(plans: readonly PaywallPlan[]): number | null {
  const yearly = plans.find((p) => p.kind === 'yearly');
  const weekly = plans.find((p) => p.kind === 'weekly');
  if (!yearly || !weekly || yearly.price <= 0 || weekly.price <= 0) return null;
  const percent = Math.round((1 - yearly.price / (weekly.price * 52)) * 100);
  return percent > 0 ? percent : null;
}

/* ---------- Legal copy ---------- */

export type Translate = (key: TranslationKey, vars?: TranslationVars) => string;
export type StorePlatform = 'ios' | 'android';

function periodLabel(t: Translate, kind: PlanKind): string {
  return kind === 'weekly' ? t('paywall.periodWeek') : t('paywall.periodYear');
}

/** Auto-renewal disclosure lines required by Apple/Google for the selected plan. */
export function legalLinesFor(plan: PaywallPlan, t: Translate, platform: StorePlatform): string[] {
  const store = platform === 'ios' ? t('paywall.storeApple') : t('paywall.storeGoogle');
  if (plan.kind === 'report' || plan.kind === 'other') {
    return [t('paywall.legalOneTime', { price: plan.priceString })];
  }
  const period = periodLabel(t, plan.kind);
  const lines: string[] = [];
  if (plan.intro?.type === 'trial') {
    lines.push(t('paywall.legalTrial', { days: plan.intro.days, price: plan.priceString, period }));
  } else if (plan.intro?.type === 'discount') {
    lines.push(t('paywall.legalIntro', { introPrice: plan.intro.priceString, price: plan.priceString, period }));
  }
  lines.push(t('paywall.legalSubscription', { price: plan.priceString, period, store }));
  return lines;
}

/** Short price line shown on a plan card. */
export function planPriceLine(plan: PaywallPlan, t: Translate): string {
  if (plan.kind === 'weekly') {
    if (plan.intro?.type === 'trial') return t('paywall.weeklyTrial', { days: plan.intro.days, price: plan.priceString });
    return plan.intro?.type === 'discount'
      ? t('paywall.weeklyIntro', { introPrice: plan.intro.priceString, price: plan.priceString })
      : t('paywall.perWeek', { price: plan.priceString });
  }
  if (plan.kind === 'yearly') {
    return plan.intro?.type === 'trial'
      ? t('paywall.yearlyTrial', { days: plan.intro.days, price: plan.priceString })
      : t('paywall.perYear', { price: plan.priceString });
  }
  return t('paywall.oneTime', { price: plan.priceString });
}

/** Trial length and yearly price from the shared price list, for copy shown before the paywall. */
export function displayTrial(locale: Locale): { days: number; yearlyPrice: string } {
  const { yearly } = PRICING[regionForLocale(locale)];
  return { days: yearly.trialDays ?? 0, yearlyPrice: formatPrice(yearly.amount, yearly.currency, locale) };
}

/* ---------- Dev purchases mode ---------- */

/** Display plans built from the shared price list, used when RevenueCat is not configured. */
export function devPlans(region: PricingRegion, locale: Locale): PaywallPlan<null>[] {
  const { weekly, yearly, report } = PRICING[region];
  const fmt = (amount: number) => formatPrice(amount, weekly.currency, locale);
  return [
    {
      key: 'dev_yearly',
      kind: 'yearly',
      price: yearly.amount,
      priceString: fmt(yearly.amount),
      pricePerWeekString: fmt(weeklyEquivalent(yearly.amount, 'year')),
      intro: yearly.trialDays
        ? { type: 'trial', priceString: fmt(0), unit: 'DAY', units: yearly.trialDays, days: yearly.trialDays }
        : null,
      source: null,
    },
    {
      key: 'dev_weekly',
      kind: 'weekly',
      price: weekly.amount,
      priceString: fmt(weekly.amount),
      pricePerWeekString: null,
      intro: weekly.trialDays
        ? { type: 'trial', priceString: fmt(0), unit: 'DAY', units: weekly.trialDays, days: weekly.trialDays }
        : weekly.introAmount !== undefined
          ? { type: 'discount', priceString: fmt(weekly.introAmount), unit: 'WEEK', units: 1, days: 7 }
          : null,
      source: null,
    },
    {
      key: 'dev_report',
      kind: 'report',
      price: report.amount,
      priceString: fmt(report.amount),
      pricePerWeekString: null,
      intro: null,
      source: null,
    },
  ];
}

/** Dev-mode exit offer: yearly at the configured discount, no trial. */
export function devExitPlan(region: PricingRegion, locale: Locale): PaywallPlan<null> {
  const yearly = PRICING[region].yearly;
  const amount = Math.floor(yearly.amount * (100 - EXIT_OFFER.discountPercent)) / 100;
  const fmt = (value: number) => formatPrice(value, yearly.currency, locale);
  return {
    key: 'dev_exit_offer',
    kind: 'yearly',
    price: amount,
    priceString: fmt(amount),
    pricePerWeekString: fmt(weeklyEquivalent(amount, 'year')),
    intro: null,
    source: null,
  };
}
