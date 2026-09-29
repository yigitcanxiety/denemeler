import { createTranslator } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import {
  defaultPlanKey,
  devExitPlan,
  devPlans,
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
});

describe('dev purchases plans', () => {
  it('uses shared pricing', () => {
    const [y, w] = devPlans('TR', 'tr');
    expect(y?.kind).toBe('yearly');
    expect(y?.intro).toMatchObject({ type: 'trial', days: 3 });
    expect(w?.intro).toMatchObject({ type: 'discount' });
    expect(devPlans('EU', 'en')[1]?.intro).toBeNull();
    const exit = devExitPlan('EU', 'en');
    expect(exit.price).toBeCloseTo(12.49);
  });
});
