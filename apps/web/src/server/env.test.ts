import { describe, expect, it } from 'vitest';
import { getServerConfig, isAnalysisMock, isRenderMock } from './env';

describe('getServerConfig', () => {
  it('applies defaults', () => {
    const config = getServerConfig({});
    expect(config.openRouter.model).toBe('stealth/space-bunny-alpha');
    expect(config.imageProvider).toBe('gemini');
    expect(config.gemini.model).toBe('gemini-2.5-flash-image');
    expect(config.fal.model).toBe('fal-ai/nano-banana/edit');
    expect(config.siteUrl).toBe('https://tonelleapp.com');
    expect(isAnalysisMock(config)).toBe(true);
    expect(isRenderMock(config)).toBe(true);
  });

  it('strips inline comments and blank values', () => {
    const config = getServerConfig({
      ANALYSIS_MODEL: 'google/gemini-2.5-flash      # swap models here',
      OPENROUTER_API_KEY: '   ',
      IMAGE_PROVIDER: 'FAL',
    });
    expect(config.openRouter.model).toBe('google/gemini-2.5-flash');
    expect(config.openRouter.apiKey).toBeUndefined();
    expect(config.imageProvider).toBe('fal');
  });

  it('computes mock flags per capability', () => {
    const live = getServerConfig({ OPENROUTER_API_KEY: 'a', GEMINI_API_KEY: 'b', REVENUECAT_SECRET_KEY: 'r' });
    expect(isRenderMock(getServerConfig({ OPENROUTER_API_KEY: 'a', GEMINI_API_KEY: 'b' }))).toBe(true);
    expect(isAnalysisMock(live)).toBe(false);
    expect(isRenderMock(live)).toBe(false);
    expect(isRenderMock(getServerConfig({ OPENROUTER_API_KEY: 'a', GEMINI_API_KEY: 'b', IMAGE_PROVIDER: 'fal' }))).toBe(true);
    const forced = getServerConfig({ OPENROUTER_API_KEY: 'a', GEMINI_API_KEY: 'b', TONELLE_MOCK: '1' });
    expect(isAnalysisMock(forced)).toBe(true);
    expect(isRenderMock(forced)).toBe(true);
  });

  it('parses invite codes case-insensitively', () => {
    expect(getServerConfig({ TONELLE_ACCESS_CODES: ' yigit-1a2b , DOST-3C4D,, ' }).accessCodes).toEqual(['YIGIT-1A2B', 'DOST-3C4D']);
    expect(getServerConfig({}).accessCodes).toEqual([]);
  });

  it('renders for real without RevenueCat only when free renders are switched on', () => {
    expect(isRenderMock(getServerConfig({ GEMINI_API_KEY: 'b' }))).toBe(true);
    expect(isRenderMock(getServerConfig({ GEMINI_API_KEY: 'b', TONELLE_FREE_RENDERS: '1' }))).toBe(false);
    expect(isRenderMock(getServerConfig({ TONELLE_FREE_RENDERS: '1' }))).toBe(true);
  });
});

describe('analysis provider selection', () => {
  it('uses Gemini directly when only GEMINI_API_KEY is set, ahead of Kie.ai', () => {
    const config = getServerConfig({ GEMINI_API_KEY: 'g', KIE_API_KEY: 'k' });
    expect(config.analysisProvider).toBe('gemini');
    expect(config.imageProvider).toBe('gemini');
    expect(config.gemini.analysisModel).toBe('gemini-2.5-flash');
    expect(isAnalysisMock(config)).toBe(false);
    expect(getServerConfig({ GEMINI_API_KEY: 'g', GEMINI_ANALYSIS_MODEL: 'gemini-3-flash' }).gemini.analysisModel).toBe(
      'gemini-3-flash',
    );
    expect(getServerConfig({ GEMINI_API_KEY: 'g', OPENROUTER_API_KEY: 'o' }).analysisProvider).toBe('openrouter');
  });
});
