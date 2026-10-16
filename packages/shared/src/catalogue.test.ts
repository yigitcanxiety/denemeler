import { describe, expect, it } from 'vitest';
import { MOCK_ANALYSIS, mockAnalysisFor, mockSkinAnalysisFor } from './fixtures';
import { CONTENT_OVERLAYS } from './i18n/content';
import { PROFILE_AXES, PROFILE_AXIS_LABELS, shadeName, shadeNames } from './profile';
import { LOOKS, LOOK_LIST, recommendLooks } from './looks';
import { EXPERIENCE_LEVELS, EXTRA_LOCALES, LOCALES, LOOK_IDS, OCCASIONS, SEASON_IDS, type FaceAnalysis } from './schemas';
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

describe('content overlays', () => {
  it('has an overlay for every extra locale with one entry per look step', () => {
    expect(Object.keys(CONTENT_OVERLAYS).sort()).toEqual([...EXTRA_LOCALES].sort());
    for (const locale of EXTRA_LOCALES) {
      for (const id of LOOK_IDS) expect(CONTENT_OVERLAYS[locale].looks[id].steps, `${locale}:${id}`).toHaveLength(LOOKS[id].steps.length);
    }
  });

  it('localizes axis labels, shade names and mock text for every locale', () => {
    for (const locale of LOCALES) {
      for (const axis of PROFILE_AXES) expect(PROFILE_AXIS_LABELS[axis][locale].trim(), `${locale}:${axis}`).not.toBe('');
      expect(shadeName('#C08081', locale).trim(), locale).not.toBe('');
      expect(shadeNames(['#C08081', '#C08181'], locale)).toHaveLength(2);
      expect(mockAnalysisFor(locale).summary.trim()).not.toBe('');
      expect(mockSkinAnalysisFor(locale).summary.trim()).not.toBe('');
    }
  });
});
