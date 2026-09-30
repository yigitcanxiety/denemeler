import { describe, expect, it } from 'vitest';
import { getServerConfig, isAnalysisMock, isRenderMock } from './env';

describe('getServerConfig', () => {
  it('applies defaults', () => {
    const config = getServerConfig({});
    expect(config.openRouter.model).toBe('stealth/space-bunny-alpha');
    expect(config.imageProvider).toBe('gemini');
    expect(config.gemini.model).toBe('gemini-2.5-flash-image');
    expect(config.fal.model).toBe('fal-ai/nano-banana/edit');
    expect(config.siteUrl).toBe('https://tonelle.app');
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
});
