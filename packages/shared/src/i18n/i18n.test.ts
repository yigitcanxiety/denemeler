import { describe, expect, it } from 'vitest';
import { API_ERROR_CODES, CORE_LOCALES, LOCALES, QUALITY_ISSUES } from '../schemas';
import { dictionaries, en, interpolate, resolveCoreLocale, resolveLocale, t, type TranslationKey } from './index';

function leafKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : leafKeys(value as object, path);
  });
}

describe('dictionaries', () => {
  it('every locale has the same key set as en', () => {
    for (const locale of LOCALES) {
      expect(leafKeys(dictionaries[locale]).sort(), locale).toEqual(leafKeys(en).sort());
    }
  });

  it('has no empty strings', () => {
    for (const locale of LOCALES) {
      for (const key of leafKeys(dictionaries[locale])) expect(t(locale, key as TranslationKey), `${locale}:${key}`).not.toBe('');
    }
  });

  it('uses the same placeholders in every locale', () => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const locale of LOCALES) {
      for (const key of leafKeys(en) as TranslationKey[]) {
        expect(placeholders(t(locale, key)), `${locale}:${key}`).toEqual(placeholders(t('en', key)));
      }
    }
  });

  it('names every language by its own name in every locale', () => {
    for (const locale of LOCALES) {
      for (const code of LOCALES) expect(t(locale, `language.${code}`), `${locale}:${code}`).toBe(t('en', `language.${code}`));
    }
  });

  it('has an error message for every ApiError code and quality issue', () => {
    for (const locale of LOCALES) {
      const dict = dictionaries[locale] as typeof en;
      for (const code of API_ERROR_CODES) expect(dict.errors[code], `${locale}:${code}`).toBeTruthy();
      for (const issue of QUALITY_ISSUES) expect(dict.camera.qualityIssues[issue], `${locale}:${issue}`).toBeTruthy();
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
    expect(resolveLocale('nl-NL,tr;q=0.5,en;q=0.9')).toBe('en');
    expect(resolveLocale('tr-TR')).toBe('tr');
    expect(resolveLocale(['EN_gb'])).toBe('en');
  });

  it('knows all mobile locales and falls back as asked', () => {
    expect(resolveLocale('fr-FR')).toBe('fr');
    expect(resolveLocale(['pt-BR'])).toBe('pt');
    expect(resolveLocale(['ja-JP', 'en'])).toBe('ja');
    expect(resolveLocale(['nl-NL'], 'en')).toBe('en');
    expect(resolveLocale(null, 'en')).toBe('en');
    expect(resolveLocale(['nl-NL'])).toBe('tr');
  });

  it('resolveCoreLocale only returns the website locales', () => {
    expect(resolveCoreLocale('fr-FR')).toBe('tr');
    expect(resolveCoreLocale('de-DE,tr;q=0.5,en;q=0.9')).toBe('en');
    expect(resolveCoreLocale(null)).toBe('tr');
    expect(CORE_LOCALES).toEqual(['tr', 'en']);
  });
});
