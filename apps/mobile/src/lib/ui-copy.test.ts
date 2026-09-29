import { describe, expect, it } from 'vitest';

import { matchTone, percentLabel, uiCopy, upper } from './ui-copy';

describe('ui-copy', () => {
  it('uppercases Turkish correctly', () => {
    expect(upper('kendini keşfet', 'tr')).toBe('KENDİNİ KEŞFET');
    expect(upper('kış', 'tr')).toBe('KIŞ');
    expect(upper('winter', 'en')).toBe('WINTER');
  });

  it('provides both locales', () => {
    expect(uiCopy('tr').tabToday).toBe('Bugün');
    expect(uiCopy('en').tabResults).toBe('Results');
    expect(uiCopy('tr').trialCta(3)).toBe('3 gün ücretsiz dene');
  });

  it('formats percentages per locale', () => {
    expect(percentLabel(95.4, 'tr')).toBe('%95');
    expect(percentLabel(88, 'en')).toBe('88%');
    expect(uiCopy('tr').match(percentLabel(92, 'tr'))).toBe('%92 uyum');
  });

  it('maps shade fit to badge tones', () => {
    expect(matchTone(95)).toBe('high');
    expect(matchTone(90)).toBe('high');
    expect(matchTone(89)).toBe('mid');
    expect(matchTone(75)).toBe('mid');
    expect(matchTone(74)).toBe('low');
  });
});
