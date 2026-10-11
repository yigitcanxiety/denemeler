import { describe, expect, it } from 'vitest';
import { EXIT_OFFER, PRICING, exitOfferAmount, formatPrice, regionForCountry } from './pricing';

describe('pricing', () => {
  it('matches the documented display prices', () => {
    expect(PRICING.TR.weekly).toMatchObject({ amount: 129.99, trialDays: 7, productId: 'tonelle_weekly' });
    expect(PRICING.TR.weekly.introAmount).toBeUndefined();
    expect(PRICING.TR.yearly).toMatchObject({ amount: 799.99, trialDays: 7, productId: 'tonelle_yearly' });
    expect(PRICING.TR.report).toMatchObject({ amount: 199, autoRenews: false, productId: 'tonelle_report' });
    expect(PRICING.EU.weekly.amount).toBe(3.99);
    expect(PRICING.EU.yearly).toMatchObject({ amount: 24.99, trialDays: 7 });
    expect(PRICING.EU.report.amount).toBe(6.99);
    expect(EXIT_OFFER.discountPercent).toBe(50);
    expect(exitOfferAmount('EU')).toBe(12.49);
  });

  it('formats and resolves regions', () => {
    expect(formatPrice(3.99, 'EUR', 'en')).toContain('3.99');
    expect(formatPrice(129.99, 'TRY', 'tr')).toContain('129,99');
    expect(regionForCountry('tr')).toBe('TR');
    expect(regionForCountry('DE')).toBe('EU');
    expect(regionForCountry(undefined)).toBe('EU');
  });
});
