import { createTranslator } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import {
  defaultPlanKey,
  devExitPlan,
  devPlans,
  yearlySavingsPercent,
  exitDiscountPercent,
  exitOfferPlanFrom,
  introOfferOf,
  legalLinesFor,
  planKindOf,
  planPriceLine,
  plansFromOfferings,
  type OfferingsLike,
  type PackageLike,
} from './paywall';

const weekly: PackageLike = {
  identifier: '$rc_weekly',
  packageType: 'WEEKLY',
  product: {
    identifier: 'tonelle_weekly',
    price: 129.99,
    priceString: '₺129,99',
    currencyCode: 'TRY',
    introPrice: { price: 39.99, priceString: '₺39,99', periodUnit: 'WEEK', periodNumberOfUnits: 1, cycles: 1 },
  },
};

const yearly: PackageLike = {
  identifier: '$rc_annual',
  packageType: 'ANNUAL',
  product: {
    identifier: 'tonelle_yearly:annual',
    price: 799.99,
    priceString: '₺799,99',
    currencyCode: 'TRY',
    pricePerWeekString: '₺15,38',
    defaultOption: {
      freePhase: { billingPeriod: { unit: 'DAY', value: 3 }, price: { formatted: 'Free', amountMicros: 0 } },
    },
  },
};

const exitYearly: PackageLike = {
  identifier: '$rc_annual',
  packageType: 'ANNUAL',
  product: { identifier: 'tonelle_yearly_exit', price: 399.99, priceString: '₺399,99', currencyCode: 'TRY' },
};

const offerings: OfferingsLike = {
  current: { identifier: 'default', availablePackages: [weekly, yearly], annual: yearly },
  all: {
    default: { identifier: 'default', availablePackages: [weekly, yearly], annual: yearly },
    exit_offer: { identifier: 'exit_offer', availablePackages: [exitYearly], annual: exitYearly },
  },
};

const tEn = createTranslator('en');

describe('plan normalisation', () => {
  it('classifies packages by type or product id', () => {
    expect(planKindOf(weekly)).toBe('weekly');
    expect(planKindOf({ ...yearly, packageType: 'CUSTOM' })).toBe('yearly');
    expect(planKindOf({ ...weekly, packageType: 'CUSTOM', product: { ...weekly.product, identifier: 'x' } })).toBe(
      'other',
    );
  });

  it('extracts trials and intro prices', () => {
    expect(introOfferOf(yearly.product)).toMatchObject({ type: 'trial', days: 3 });
    expect(introOfferOf(weekly.product)).toMatchObject({ type: 'discount', priceString: '₺39,99', days: 7 });
    expect(introOfferOf(exitYearly.product)).toBeNull();
  });

  it('lists yearly first and preselects it', () => {
    const plans = plansFromOfferings(offerings);
    expect(plans.map((p) => p.kind)).toEqual(['yearly', 'weekly']);
    expect(defaultPlanKey(plans)).toBe('$rc_annual');
    expect(plansFromOfferings(null)).toEqual([]);
    expect(defaultPlanKey([])).toBeNull();
  });

  it('finds the exit offer and its discount', () => {
    const exit = exitOfferPlanFrom(offerings);
    expect(exit?.priceString).toBe('₺399,99');
    const regular = plansFromOfferings(offerings).find((p) => p.kind === 'yearly');
    expect(exitDiscountPercent(regular, exit!)).toBe(50);
    expect(exitOfferPlanFrom({ ...offerings, all: {} })).toBeNull();
  });
});

describe('paywall copy', () => {
  it('builds price lines', () => {
    const [y, w] = plansFromOfferings(offerings);
    expect(planPriceLine(y!, tEn)).toBe('3-day free trial, then ₺799,99/year');
    expect(planPriceLine(w!, tEn)).toBe('₺39,99 for the first week, then ₺129,99/week');
  });

  it('includes auto-renewal disclosures', () => {
    const [y, w] = plansFromOfferings(offerings);
    const yearlyLines = legalLinesFor(y!, tEn, 'ios');
    expect(yearlyLines[0]).toContain('3 days free');
    expect(yearlyLines.at(-1)).toContain('Apple ID');
    const weeklyLines = legalLinesFor(w!, createTranslator('tr'), 'android');
    expect(weeklyLines).toHaveLength(2);
    expect(weeklyLines.join(' ')).toContain('Google Play');
    expect(weeklyLines.join(' ')).not.toContain('{');
  });

  it('describes the intro offer in its own period, not the plan period', () => {
    const intro = (unit: 'DAY' | 'WEEK', units: number) => ({
      ...plansFromOfferings(offerings)[1]!,
      kind: 'yearly' as const,
      intro: { type: 'discount' as const, priceString: '$1', unit, units, days: units * (unit === 'DAY' ? 1 : 7) },
    });
    expect(legalLinesFor(intro('DAY', 7), tEn, 'ios')[0]).toContain('$1 for the first 7 days, then ₺129,99 per year');
    expect(legalLinesFor(intro('WEEK', 1), createTranslator('tr'), 'ios')[0]).toContain('ilk 1 hafta $1, ardından iptal edilene kadar yıl başına');
  });
});

describe('dev purchases plans', () => {
  it('uses shared pricing', () => {
    const [y, w] = devPlans('TR', 'tr');
    expect(y?.kind).toBe('yearly');
    // No free trial since 2026-10-25.
    expect(y?.intro).toBeNull();
    expect(w?.intro).toBeNull();
    expect(devPlans('TR', 'tr').map((p) => p.kind)).toEqual(['yearly', 'weekly', 'report']);
    expect(yearlySavingsPercent(devPlans('TR', 'tr'))).toBe(85);
    expect(yearlySavingsPercent([y!])).toBeNull();
    const exit = devExitPlan('EU', 'en');
    expect(exit.price).toBeCloseTo(19.99);
  });
});
