import { describe, expect, it } from 'vitest';

import { indexLabel, paddedCounter, seasonCompassLabels, uiCopy, upper } from './ui-copy';

describe('ui-copy', () => {
  it('uppercases Turkish correctly', () => {
    expect(upper('analiz ediliyor', 'tr')).toBe('ANALİZ EDİLİYOR');
    expect(upper('kış', 'tr')).toBe('KIŞ');
    expect(upper('winter', 'en')).toBe('WINTER');
  });

  it('provides both locales', () => {
    expect(uiCopy('tr').analyzingTag).toBe('ANALİZ EDİLİYOR…');
    expect(uiCopy('en').navLooks).toBe('Looks');
    expect(seasonCompassLabels('tr')).toEqual(['İLKBAHAR', 'YAZ', 'SONBAHAR', 'KIŞ']);
  });

  it('splits the padded counter into dim zeros and digits', () => {
    expect(paddedCounter(0)).toEqual({ lead: '00', digits: '0' });
    expect(paddedCounter(7)).toEqual({ lead: '00', digits: '7' });
    expect(paddedCounter(52.4)).toEqual({ lead: '0', digits: '52' });
    expect(paddedCounter(100)).toEqual({ lead: '', digits: '100' });
    expect(indexLabel(0)).toBe('01');
  });
});
