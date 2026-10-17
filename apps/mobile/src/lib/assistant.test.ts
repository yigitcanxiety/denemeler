import { LOCALES, t } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import { TIPS } from './assistant';

describe('assistant tips', () => {
  it('has 2–3 short tips per screen in every locale', () => {
    for (const [screen, keys] of Object.entries(TIPS)) {
      expect(keys.length, screen).toBeGreaterThanOrEqual(2);
      expect(keys.length, screen).toBeLessThanOrEqual(3);
      for (const locale of LOCALES) {
        for (const key of keys) {
          const text = t(locale, key);
          expect(text.length, `${locale}:${key}`).toBeLessThanOrEqual(screen === 'camera' ? 50 : 110);
        }
      }
    }
  });
});
