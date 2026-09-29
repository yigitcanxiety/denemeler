import { describe, expect, it } from 'vitest';
import { MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL, mockAnalysisFor } from './fixtures';
import {
  AnalyzeRequestSchema,
  AnalyzeResponseSchema,
  ApiErrorSchema,
  FaceAnalysisSchema,
  MAX_IMAGE_BYTES,
  RenderRequestSchema,
  parseImageDataUrl,
} from './schemas';

describe('FaceAnalysisSchema', () => {
  it('accepts MOCK_ANALYSIS and its localized variants', () => {
    expect(FaceAnalysisSchema.parse(MOCK_ANALYSIS)).toEqual(MOCK_ANALYSIS);
    expect(FaceAnalysisSchema.safeParse(mockAnalysisFor('tr')).success).toBe(true);
    expect(FaceAnalysisSchema.safeParse(mockAnalysisFor('en')).success).toBe(true);
  });

  it.each([
    ['unknown season', { season: 'mid_spring' }],
    ['confidence above 1', { seasonConfidence: 1.2 }],
    ['non-hex colour', { bestColors: ['red', '#FFFFFF', '#000000', '#111111', '#222222', '#333333'] }],
    ['too few best colours', { bestColors: ['#FFFFFF'] }],
    ['too many lip colours', { lip: Array(6).fill('#AA0000') }],
    ['unknown quality issue', { qualityIssues: ['too_pretty'] }],
    ['missing summary', { summary: undefined }],
  ])('rejects %s', (_label, patch) => {
    expect(FaceAnalysisSchema.safeParse({ ...MOCK_ANALYSIS, ...patch }).success).toBe(false);
  });
});

describe('request/response schemas', () => {
  it('accepts a valid analyze request', () => {
    const result = AnalyzeRequestSchema.safeParse({
      image: MOCK_IMAGE_DATA_URL,
      locale: 'tr',
      quiz: { skinType: 'dry', eyeColor: 'hazel', occasion: 'work', budget: 'mid', experience: 'beginner' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-data-URL images, unsupported types and unknown locales', () => {
    expect(AnalyzeRequestSchema.safeParse({ image: 'https://x.test/a.jpg', locale: 'en' }).success).toBe(false);
    expect(AnalyzeRequestSchema.safeParse({ image: 'data:image/gif;base64,R0lGOD==', locale: 'en' }).success).toBe(
      false,
    );
    expect(AnalyzeRequestSchema.safeParse({ image: MOCK_IMAGE_DATA_URL, locale: 'de' }).success).toBe(false);
  });

  it('rejects images over 4 MB decoded', () => {
    const big = `data:image/jpeg;base64,${'A'.repeat(Math.ceil((MAX_IMAGE_BYTES + 3) / 3) * 4)}`;
    expect(parseImageDataUrl(big)!.bytes).toBeGreaterThan(MAX_IMAGE_BYTES);
    expect(AnalyzeRequestSchema.safeParse({ image: big, locale: 'en' }).success).toBe(false);
  });

  it('validates responses, render requests and errors', () => {
    expect(
      AnalyzeResponseSchema.safeParse({
        analysis: MOCK_ANALYSIS,
        recommendedLookIds: ['natural_glow', 'office_chic', 'bridal'],
        mock: true,
      }).success,
    ).toBe(true);
    expect(
      AnalyzeResponseSchema.safeParse({ analysis: MOCK_ANALYSIS, recommendedLookIds: ['natural_glow'], mock: true })
        .success,
    ).toBe(false);
    expect(
      RenderRequestSchema.safeParse({
        image: MOCK_IMAGE_DATA_URL,
        lookId: 'soft_glam',
        analysis: MOCK_ANALYSIS,
        locale: 'en',
      }).success,
    ).toBe(true);
    expect(RenderRequestSchema.safeParse({ image: MOCK_IMAGE_DATA_URL, lookId: 'nope', analysis: MOCK_ANALYSIS, locale: 'en' }).success).toBe(false);
    expect(ApiErrorSchema.safeParse({ error: { code: 'no_face', message: 'x' } }).success).toBe(true);
    expect(ApiErrorSchema.safeParse({ error: { code: 'teapot', message: 'x' } }).success).toBe(false);
  });
});
