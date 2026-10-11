import {
  EXIT_OFFER,
  PRICING,
  exitOfferAmount,
  formatPrice,
  regionForLocale,
  t,
  weeklyEquivalent,
  type Locale,
  type PlanId,
  type PlanPrice,
  type PricingRegion,
} from '@tonelle/shared';

/** Everything a paywall / pricing card needs to render one plan, already localised. */
export interface PlanDisplay {
  id: PlanId;
  plan: PlanPrice;
  name: string;
  /** Regular price, formatted (e.g. "₺799,99"). */
  price: string;
  /** Main line under the name, e.g. "3-day free trial, then ₺799,99/year". */
  headline: string;
  /** Secondary line, e.g. "Only ₺15,38/week". */
  subline?: string;
  /** Badge text for the highlighted plan. */
  badge?: string;
  /** Savings vs. paying weekly for a year, e.g. "Save 88%". */
  savings?: string;
  cta: string;
  /** Store-mandated subscription disclosure for this plan. */
  legal: string;
  highlighted: boolean;
}

/** Plans in display order: yearly (highlighted), weekly, one-time report. */
export const PLAN_ORDER: PlanId[] = ['yearly', 'weekly', 'report'];

function periodLabel(locale: Locale, plan: PlanPrice): string {
  return plan.period === 'week' ? t(locale, 'paywall.periodWeek') : t(locale, 'paywall.periodYear');
}

function storeLabel(locale: Locale): string {
  return `${t(locale, 'paywall.storeApple')} / ${t(locale, 'paywall.storeGoogle')}`;
}

/** Percentage saved on the yearly plan compared with 52 weekly payments at the regular price. */
export function yearlySavingsPercent(region: PricingRegion): number {
  const { weekly, yearly } = PRICING[region];
  return Math.floor((1 - yearly.amount / (weekly.amount * 52)) * 100);
}

export function getPlanDisplay(locale: Locale, id: PlanId, region: PricingRegion = regionForLocale(locale)): PlanDisplay {
  const plan = PRICING[region][id];
  const fmt = (amount: number) => formatPrice(amount, plan.currency, locale);
  const price = fmt(plan.amount);
  const period = periodLabel(locale, plan);
  const store = storeLabel(locale);
  const subscriptionLegal = t(locale, 'paywall.legalSubscription', { price, period, store });

  if (id === 'report') {
    return {
      id,
      plan,
      name: t(locale, 'paywall.reportName'),
      price,
      headline: t(locale, 'paywall.oneTime', { price }),
      subline: t(locale, 'paywall.reportDescription'),
      cta: t(locale, 'paywall.ctaReport'),
      legal: t(locale, 'paywall.legalOneTime', { price }),
      highlighted: false,
    };
  }

  if (id === 'yearly') {
    const perWeek = fmt(weeklyEquivalent(plan.amount, plan.period));
    const trial = plan.trialDays;
    return {
      id,
      plan,
      name: t(locale, 'paywall.yearlyName'),
      price,
      headline: trial
        ? t(locale, 'paywall.yearlyTrial', { days: trial, price })
        : t(locale, 'paywall.perYear', { price }),
      subline: t(locale, 'paywall.yearlyEquivalent', { price: perWeek }),
      badge: t(locale, 'paywall.bestValue'),
      savings: t(locale, 'paywall.save', { percent: yearlySavingsPercent(region) }),
      cta: trial ? t(locale, 'paywall.ctaTrial') : t(locale, 'paywall.ctaSubscribe'),
      legal: trial
        ? `${t(locale, 'paywall.legalTrial', { days: trial, price, period })} ${subscriptionLegal}`
        : subscriptionLegal,
      highlighted: true,
    };
  }

  // Weekly. The app's first-week intro price (introAmount) is store-only: web checkout
  // (Paddle) charges the regular price, so the site must not advertise the intro.
  return {
    id,
    plan,
    name: t(locale, 'paywall.weeklyName'),
    price,
    headline: t(locale, 'paywall.perWeek', { price }),
    subline: t(locale, 'paywall.cancelAnytime'),
    cta: t(locale, 'paywall.ctaSubscribe'),
    legal: subscriptionLegal,
    highlighted: false,
  };
}

/** Localised plan cards for a locale's default region (TR → ₺, everything else → €). */
export function getPlanDisplays(locale: Locale, region: PricingRegion = regionForLocale(locale)): PlanDisplay[] {
  return PLAN_ORDER.map((id) => getPlanDisplay(locale, id, region));
}

export interface ExitOfferDisplay {
  percent: number;
  price: string;
  title: string;
  body: string;
  cta: string;
  dismiss: string;
}

export function getExitOfferDisplay(locale: Locale, region: PricingRegion = regionForLocale(locale)): ExitOfferDisplay {
  const plan = PRICING[region][EXIT_OFFER.plan];
  const percent = EXIT_OFFER.discountPercent;
  const price = formatPrice(exitOfferAmount(region), plan.currency, locale);
  return {
    percent,
    price,
    title: t(locale, 'paywall.exitTitle'),
    body: t(locale, 'paywall.exitBody', { percent, price }),
    cta: t(locale, 'paywall.exitCta', { percent }),
    dismiss: t(locale, 'paywall.exitDismiss'),
  };
}
