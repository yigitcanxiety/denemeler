import { LOOKS, MOCK_ANALYSIS, createTranslator, recommendLooks } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import { ANALYZING_STEPS, analyzingProgress, analyzingStepIndex, isAnalysisSlow } from './analyzing';
import { pickDeviceLocale } from './locale';
import { isLookId, localizedSteps, lookShades, lookSummary, resolveRecommendedLooks } from './looks';
import { confidencePercent, profileBars, profilePoints, seasonText, topShades, traitChips } from './results';

describe('pickDeviceLocale', () => {
  it('uses Turkish on Turkish devices, English otherwise', () => {
    expect(pickDeviceLocale(['tr-TR'])).toBe('tr');
    expect(pickDeviceLocale(['de-DE', 'tr'])).toBe('tr');
    expect(pickDeviceLocale(['de-DE'])).toBe('en');
    expect(pickDeviceLocale(['en_US'])).toBe('en');
    expect(pickDeviceLocale([null, undefined])).toBe('en');
    expect(pickDeviceLocale([])).toBe('en');
  });
});

describe('analyzing progress', () => {
  it('steps through messages and holds on the last', () => {
    expect(analyzingStepIndex(0)).toBe(0);
    expect(analyzingStepIndex(2300)).toBe(1);
    expect(analyzingStepIndex(999_999)).toBe(ANALYZING_STEPS.length - 1);
    expect(analyzingStepIndex(-5)).toBe(0);
  });

  it('flags slow requests and eases progress', () => {
    expect(isAnalysisSlow(1000)).toBe(false);
    expect(isAnalysisSlow(25_000)).toBe(true);
    expect(analyzingProgress(0, false)).toBe(0);
    expect(analyzingProgress(120_000, false)).toBeLessThanOrEqual(0.95);
    expect(analyzingProgress(1000, true)).toBe(1);
  });
});

describe('looks', () => {
  it('prefers valid server recommendations', () => {
    expect(resolveRecommendedLooks(MOCK_ANALYSIS, ['bridal', 'bold_lip', 'soft_glam'])).toEqual([
      'bridal',
      'bold_lip',
      'soft_glam',
    ]);
  });

  it('falls back to shared recommendLooks', () => {
    expect(resolveRecommendedLooks(MOCK_ANALYSIS, ['bridal', 'nope'])).toEqual(recommendLooks(MOCK_ANALYSIS));
    expect(resolveRecommendedLooks(MOCK_ANALYSIS, null)).toHaveLength(3);
  });

  it('localizes steps and summaries', () => {
    const steps = localizedSteps(LOOKS.natural_glow, 'tr');
    expect(steps[0]).toMatchObject({ number: 1, title: 'Cildi hazırla' });
    expect(lookSummary('natural_glow', 'en').name).toBe('Natural Glow');
    expect(isLookId('soft_glam')).toBe(true);
    expect(isLookId('x')).toBe(false);
  });

  it('picks shades from the analysis', () => {
    const shades = lookShades(MOCK_ANALYSIS, LOOKS.natural_glow);
    expect(shades.lip).toEqual(MOCK_ANALYSIS.lip.slice(0, 2));
    expect(lookShades(MOCK_ANALYSIS, LOOKS.evening_smoky).eyeshadow).toHaveLength(3);
  });
});

describe('results helpers', () => {
  it('builds descriptive trait chips', () => {
    const chips = traitChips(MOCK_ANALYSIS, createTranslator('en'));
    expect(chips.map((c) => c.value)).toEqual(['Warm', 'Light-medium', 'Low', 'Oval', 'Almond']);
    expect(traitChips(MOCK_ANALYSIS, createTranslator('tr'))[0]?.label).not.toContain('.');
  });

  it('formats confidence and season text', () => {
    expect(confidencePercent({ seasonConfidence: 0.824 })).toBe(82);
    expect(confidencePercent({ seasonConfidence: 1.4 })).toBe(100);
    expect(seasonText(MOCK_ANALYSIS, 'en').name).toBe('Soft Autumn');
  });

  it('derives the colour profile radar and bars', () => {
    const points = profilePoints(MOCK_ANALYSIS, 'tr');
    expect(points).toHaveLength(6);
    expect(points[0]).toMatchObject({ axis: 'warmth', label: 'Sıcaklık' });
    expect(points.every((p) => p.value >= 0 && p.value <= 100)).toBe(true);
    expect(profileBars(MOCK_ANALYSIS, 'en').map((b) => b.label)).toEqual(['Warmth', 'Contrast', 'Softness']);
  });

  it('ranks the best shade per category with its fit', () => {
    const cards = topShades(MOCK_ANALYSIS);
    expect(cards.map((c) => c.kind)).toEqual(['lip', 'blush', 'eyeshadow']);
    expect(cards.every((c) => c.match >= 60 && c.match <= 98)).toBe(true);
    expect(topShades(MOCK_ANALYSIS, { lip: [], blush: ['#D98C78'], eyeshadow: [] })).toHaveLength(1);
  });
});
