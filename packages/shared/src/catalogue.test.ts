import { describe, expect, it } from 'vitest';
import { MOCK_ANALYSIS } from './fixtures';
import { LOOKS, LOOK_LIST, recommendLooks } from './looks';
import { EXPERIENCE_LEVELS, LOCALES, LOOK_IDS, OCCASIONS, SEASON_IDS, type FaceAnalysis } from './schemas';
import { SEASONS } from './seasons';

const HEX = /^#[0-9A-F]{6}$/;

describe('SEASONS', () => {
  it('covers all 12 seasons', () => {
    expect(Object.keys(SEASONS).sort()).toEqual([...SEASON_IDS].sort());
  });

  it.each(SEASON_IDS)('%s has both locales and a valid palette', (id) => {
    const season = SEASONS[id];
    expect(season.id).toBe(id);
    for (const locale of LOCALES) {
      expect(season.name[locale].trim()).not.toBe('');
      expect(season.description[locale].trim()).not.toBe('');
    }
    expect(season.palette).toHaveLength(8);
    expect(season.avoid.length).toBeGreaterThanOrEqual(3);
    for (const hex of [...season.palette, ...season.avoid]) expect(hex).toMatch(HEX);
  });
});

describe('LOOKS', () => {
  it('covers all 8 looks', () => {
    expect(Object.keys(LOOKS).sort()).toEqual([...LOOK_IDS].sort());
  });

  it.each(LOOK_IDS)('%s has both locales, 4–7 steps and a prompt template', (id) => {
    const look = LOOKS[id];
    expect(look.id).toBe(id);
    for (const locale of LOCALES) {
      expect(look.name[locale].trim()).not.toBe('');
      expect(look.description[locale].trim()).not.toBe('');
      for (const step of look.steps) {
        expect(step.title[locale].trim()).not.toBe('');
        expect(step.body[locale].trim()).not.toBe('');
      }
    }
    expect(look.steps.length).toBeGreaterThanOrEqual(4);
    expect(look.steps.length).toBeLessThanOrEqual(7);
    expect(look.occasions.length).toBeGreaterThan(0);
    expect(look.promptTemplate).toContain('{lip}');
  });
});

describe('recommendLooks', () => {
  const variants: FaceAnalysis[] = [
    MOCK_ANALYSIS,
    { ...MOCK_ANALYSIS, season: 'bright_winter', contrast: 'high' },
    { ...MOCK_ANALYSIS, season: 'light_summer', contrast: 'medium' },
  ];

  it('returns 3 unique valid ids for every combination', () => {
    for (const analysis of variants) {
      for (const occasion of OCCASIONS) {
        for (const experience of EXPERIENCE_LEVELS) {
          const ids = recommendLooks(analysis, {
            skinType: 'normal',
            eyeColor: 'brown',
            budget: 'mid',
            occasion,
            experience,
          });
          expect(ids).toHaveLength(3);
          expect(new Set(ids).size).toBe(3);
          for (const id of ids) expect(LOOK_IDS).toContain(id);
        }
      }
      expect(new Set(recommendLooks(analysis)).size).toBe(3);
    }
  });

  it('is deterministic', () => {
    expect(recommendLooks(MOCK_ANALYSIS)).toEqual(recommendLooks(MOCK_ANALYSIS));
  });

  it('puts a matching look first for the chosen occasion', () => {
    for (const occasion of OCCASIONS) {
      const [first] = recommendLooks(MOCK_ANALYSIS, {
        skinType: 'normal',
        eyeColor: 'brown',
        budget: 'mid',
        occasion,
        experience: 'intermediate',
      });
      expect(LOOK_LIST.find((l) => l.id === first)!.occasions).toContain(occasion);
    }
  });
});
