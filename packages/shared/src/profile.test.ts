import { describe, expect, it } from 'vitest';
import { MOCK_ANALYSIS } from './fixtures';
import { PROFILE_AXES, colorProfile, shadeMatch } from './profile';

describe('colorProfile', () => {
  it('returns every axis within 0..100', () => {
    const p = colorProfile(MOCK_ANALYSIS);
    for (const axis of PROFILE_AXES) {
      expect(p[axis]).toBeGreaterThanOrEqual(0);
      expect(p[axis]).toBeLessThanOrEqual(100);
    }
  });

  it('is deterministic and reflects undertone', () => {
    expect(colorProfile(MOCK_ANALYSIS)).toEqual(colorProfile(MOCK_ANALYSIS));
    const cool = colorProfile({ ...MOCK_ANALYSIS, undertone: 'cool' });
    expect(cool.warmth).toBeLessThan(colorProfile({ ...MOCK_ANALYSIS, undertone: 'warm' }).warmth);
  });
});

describe('shadeMatch', () => {
  it('scores a recommended colour higher than an avoided one', () => {
    const good = shadeMatch(MOCK_ANALYSIS.lip[0]!, MOCK_ANALYSIS);
    const bad = shadeMatch(MOCK_ANALYSIS.avoidColors[0]!, MOCK_ANALYSIS);
    expect(good).toBeGreaterThan(bad);
    expect(good).toBeLessThanOrEqual(98);
    expect(bad).toBeGreaterThanOrEqual(60);
  });
});
