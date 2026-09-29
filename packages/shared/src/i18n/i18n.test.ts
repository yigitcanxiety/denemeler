import { describe, expect, it } from 'vitest';
import { API_ERROR_CODES, QUALITY_ISSUES } from '../schemas';
import { en, interpolate, resolveLocale, t, tr, type TranslationKey } from './index';

function leafKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : leafKeys(value as object, path);
  });
}

describe('dictionaries', () => {
  it('tr and en have identical key sets', () => {
    expect(leafKeys(tr).sort()).toEqual(leafKeys(en).sort());
  });

  it('has no empty strings', () => {
    for (const dict of [en, tr]) {
      for (const key of leafKeys(dict)) expect(t(dict === en ? 'en' : 'tr', key as TranslationKey)).not.toBe('');
    }
  });

  it('uses the same placeholders in both locales', () => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const key of leafKeys(en) as TranslationKey[]) {
      expect(placeholders(t('tr', key)), key).toEqual(placeholders(t('en', key)));
    }
  });

  it('has an error message for every ApiError code and quality issue', () => {
    for (const code of API_ERROR_CODES) {
      expect(en.errors[code]).toBeTruthy();
      expect(tr.errors[code]).toBeTruthy();
    }
    for (const issue of QUALITY_ISSUES) {
      expect(en.camera.qualityIssues[issue]).toBeTruthy();
      expect(tr.camera.qualityIssues[issue]).toBeTruthy();
    }
  });
});

describe('t', () => {
  it('translates and interpolates', () => {
    expect(t('en', 'paywall.perWeek', { price: '€3.99' })).toBe('€3.99/week');
    expect(t('tr', 'common.aiGenerated')).toBe('AI ile oluşturuldu');
    expect(t('en', 'common.aiGenerated')).toBe('AI-generated');
  });

  it('falls back to the key for unknown keys', () => {
    expect(t('tr', 'nope.missing' as TranslationKey)).toBe('nope.missing');
  });

  it('keeps unknown placeholders', () => {
    expect(interpolate('{a} {b}', { a: 1 })).toBe('1 {b}');
  });
});

describe('resolveLocale', () => {
  it('parses Accept-Language with q-values', () => {
    expect(resolveLocale('en-US,en;q=0.9,tr;q=0.8')).toBe('en');
    expect(resolveLocale('de-DE,tr;q=0.5,en;q=0.9')).toBe('en');
    expect(resolveLocale('tr-TR')).toBe('tr');
    expect(resolveLocale('fr-FR')).toBe('tr');
    expect(resolveLocale(null)).toBe('tr');
    expect(resolveLocale(['EN_gb'])).toBe('en');
  });
});
