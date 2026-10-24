import { AnalyzeResponseSchema, MOCK_IMAGE_DATA_URL, RenderResponseSchema } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import { isWebDemoMode } from './config';
import { createDemoApiClient } from './demo-api';

describe('web demo mode', () => {
  it('is only on for web without an API URL', () => {
    expect(isWebDemoMode({}, 'web')).toBe(true);
    expect(isWebDemoMode({ EXPO_PUBLIC_API_URL: '  ' }, 'web')).toBe(true);
    expect(isWebDemoMode({ EXPO_PUBLIC_API_URL: 'http://localhost:3000' }, 'web')).toBe(false);
    expect(isWebDemoMode({}, 'ios')).toBe(false);
    expect(isWebDemoMode({}, 'android')).toBe(false);
  });

  it('answers with the shared mock analysis and echoes renders', async () => {
    const client = createDemoApiClient({ delayMs: 0 });
    const analyzed = await client.analyze({ image: MOCK_IMAGE_DATA_URL, locale: 'tr' });
    expect(AnalyzeResponseSchema.parse(analyzed).mock).toBe(true);
    const lookId = analyzed.recommendedLookIds[0]!;
    const rendered = await client.renderLook({
      image: MOCK_IMAGE_DATA_URL,
      lookId,
      analysis: analyzed.analysis,
      locale: 'tr',
    });
    expect(RenderResponseSchema.parse(rendered)).toEqual({ image: MOCK_IMAGE_DATA_URL, lookId, mock: true });
  });

  it('rejects when aborted', async () => {
    const controller = new AbortController();
    const pending = createDemoApiClient({ delayMs: 50 }).analyze(
      { image: MOCK_IMAGE_DATA_URL, locale: 'en' },
      { signal: controller.signal },
    );
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: 'aborted' });
  });
});
