import { describe, expect, it } from 'vitest';
import { getExitOfferDisplay, getPlanDisplays, yearlySavingsPercent } from './pricing-display';

describe('pricing display', () => {
  it('shows Turkish lira plans for tr, without the app-only weekly intro price or a trial', () => {
    const plans = getPlanDisplays('tr');
    expect(plans.map((p) => p.id)).toEqual(['yearly', 'weekly', 'report']);
    const [yearly, weekly, report] = plans;
    expect(yearly?.highlighted).toBe(true);
    expect(yearly?.price).toContain('1.799,99');
    expect(yearly?.headline).not.toMatch(/7 gün/);
    expect(yearly?.legal).toContain('1.799,99');
    expect(weekly?.headline).not.toContain('39,99');
    expect(weekly?.headline).toContain('229,99');
    expect(weekly?.legal).not.toContain('39,99');
    expect(report?.plan.autoRenews).toBe(false);
    expect(plans.every((p) => p.plan.currency === 'TRY')).toBe(true);
  });

  it('shows euro plans for en, with no free trial (2026-10-25)', () => {
    const plans = getPlanDisplays('en');
    const weekly = plans.find((p) => p.id === 'weekly');
    const yearly = plans.find((p) => p.id === 'yearly');
    expect(plans.every((p) => p.plan.currency === 'EUR')).toBe(true);
    expect(weekly?.headline).not.toMatch(/trial/);
    expect(yearly?.headline).not.toMatch(/trial/);
    expect(yearly?.cta).not.toMatch(/trial/);
    expect(yearly?.subline).toBe('Only €0.77/week');
  });

  it('allows overriding the region independently of the language', () => {
    const plans = getPlanDisplays('en', 'TR');
    expect(plans[0]?.price).toContain('1,799.99');
    expect(plans[0]?.plan.currency).toBe('TRY');
  });

  it('computes savings and the exit offer', () => {
    expect(yearlySavingsPercent('EU')).toBe(87);
    const offer = getExitOfferDisplay('en');
    expect(offer.percent).toBe(50);
    expect(offer.price).toBe('€19.99');
    expect(offer.body).toContain('€19.99');
  });
});
