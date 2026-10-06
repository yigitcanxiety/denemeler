import { describe, expect, it } from 'vitest';
import { MOCK_ANALYSIS, mockSkinAnalysisFor } from './fixtures';
import { LOOKS } from './looks';
import { buildAnalysisPrompt, buildRenderPrompt, buildSkinAnalysisPrompt } from './prompts';
import { LOCALES, LOOK_IDS, SEASON_IDS, SKIN_CONCERNS, SkinAnalysisSchema } from './schemas';

describe('buildAnalysisPrompt', () => {
  it('demands strict JSON matching FaceAnalysis', () => {
    const { system, user } = buildAnalysisPrompt('en');
    const text = `${system}\n${user}`;
    expect(text).toMatch(/strict JSON/i);
    expect(text).toMatch(/JSON only/i);
    for (const field of ['faceDetected', 'qualityIssues', 'seasonConfidence', 'bestColors', 'eyeshadow', 'summary']) {
      expect(system).toContain(`"${field}"`);
    }
    for (const season of SEASON_IDS) expect(system).toContain(season);
  });

  it('forbids beauty scoring and uses the requested language', () => {
    const { system, user } = buildAnalysisPrompt('tr', {
      skinType: 'oily',
      eyeColor: 'green',
      occasion: 'night',
      budget: 'high',
      experience: 'pro',
    });
    expect(system).toMatch(/never rate/i);
    expect(system).toContain('Turkish');
    expect(user).toContain('skin type: oily');
  });
});

describe('buildRenderPrompt', () => {
  it.each(LOOK_IDS)('%s preserves identity and fills placeholders', (id) => {
    const prompt = buildRenderPrompt(id, MOCK_ANALYSIS);
    expect(prompt).toMatch(/identity/i);
    expect(prompt).toMatch(/face geometry unchanged/i);
    expect(prompt).toMatch(/skin texture/i);
    expect(prompt).toMatch(/hair/i);
    expect(prompt).toMatch(/background/i);
    expect(prompt).toMatch(/lighting/i);
    expect(prompt).toMatch(/photorealistic/i);
    expect(prompt).toMatch(/only add makeup/i);
    expect(prompt).not.toMatch(/\{\w+\}/);
    expect(prompt).toContain(MOCK_ANALYSIS.lip[0]);
  });

  it('accepts a Look object', () => {
    expect(buildRenderPrompt(LOOKS.bold_lip, MOCK_ANALYSIS)).toBe(buildRenderPrompt('bold_lip', MOCK_ANALYSIS));
  });
});

describe('skin analysis', () => {
  it('mock skin analysis matches the schema in every locale', () => {
    for (const locale of LOCALES) expect(SkinAnalysisSchema.safeParse(mockSkinAnalysisFor(locale)).success).toBe(true);
  });

  it('skin prompt lists every concern and stays non-medical', () => {
    const { system } = buildSkinAnalysisPrompt('tr');
    for (const concern of SKIN_CONCERNS) expect(system).toContain(`"${concern}"`);
    expect(system).toContain('not a medical diagnosis');
    expect(system).toContain('Turkish');
  });
});
