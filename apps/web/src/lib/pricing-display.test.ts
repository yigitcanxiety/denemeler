import { describe, expect, it } from 'vitest';
import { getExitOfferDisplay, getPlanDisplays, yearlySavingsPercent } from './pricing-display';

describe('pricing display', () => {
  it('shows Turkish lira plans for tr, with the weekly intro price and yearly trial', () => {
    const plans = getPlanDisplays('tr');
    expect(plans.map((p) => p.id)).toEqual(['yearly', 'weekly', 'report']);
    const [yearly, weekly, report] = plans;
    expect(yearly?.highlighted).toBe(true);
    expect(yearly?.price).toContain('799,99');
    expect(yearly?.headline).toMatch(/7 gün/);
    expect(yearly?.legal).toContain('799,99');
    expect(weekly?.introPrice).toContain('39,99');
    expect(weekly?.headline).toContain('39,99');
    expect(weekly?.headline).toContain('129,99');
    expect(weekly?.legal).toContain('39,99');
    expect(report?.plan.autoRenews).toBe(false);
    expect(plans.every((p) => p.plan.currency === 'TRY')).toBe(true);
  });

  it('shows euro plans for en, without a weekly intro offer', () => {
    const plans = getPlanDisplays('en');
    const weekly = plans.find((p) => p.id === 'weekly');
    const yearly = plans.find((p) => p.id === 'yearly');
    expect(plans.every((p) => p.plan.currency === 'EUR')).toBe(true);
    expect(weekly?.introPrice).toBeUndefined();
    expect(weekly?.headline).toBe('€3.99/week');
    expect(yearly?.headline).toBe('7-day free trial, then €24.99/year');
    expect(yearly?.cta).toBe('Start free trial');
    expect(yearly?.subline).toBe('Only €0.48/week');
  });

  it('allows overriding the region independently of the language', () => {
    const plans = getPlanDisplays('en', 'TR');
    expect(plans[0]?.price).toContain('799.99');
    expect(plans[0]?.plan.currency).toBe('TRY');
  });

  it('computes savings and the exit offer', () => {
    expect(yearlySavingsPercent('EU')).toBe(87);
    const offer = getExitOfferDisplay('en');
    expect(offer.percent).toBe(50);
    expect(offer.price).toBe('€12.49');
    expect(offer.body).toContain('€12.49');
  });
});
