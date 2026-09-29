import { describe, expect, it } from 'vitest';
import { localeFromPathname, pickLocale } from './locale';

describe('locale helpers', () => {
  it('reads the locale prefix', () => {
    expect(localeFromPathname('/en/analyze')).toBe('en');
    expect(localeFromPathname('/tr')).toBe('tr');
    expect(localeFromPathname('/')).toBeNull();
    expect(localeFromPathname('/de/x')).toBeNull();
  });

  it('prefers the cookie, then Accept-Language, then tr', () => {
    expect(pickLocale('en', 'tr-TR')).toBe('en');
    expect(pickLocale(undefined, 'en-GB,en;q=0.9')).toBe('en');
    expect(pickLocale('xx', 'tr')).toBe('tr');
    expect(pickLocale(undefined, null)).toBe('tr');
  });
});
