import { CORE_LOCALES, DEFAULT_LOCALE, LOCALES, type CoreLocale, type Locale } from '../schemas';
import { de } from './de';
import { en, type Dictionary } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import { tr } from './tr';

export type { Dictionary };

type DeepPartial<T> = { [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> };

/** Dot-separated path of every leaf string in the dictionary, e.g. `'paywall.title'`. */
export type TranslationKey = LeafPaths<Dictionary>;
type LeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${LeafPaths<T[K]>}`;
}[keyof T & string];

export type TranslationVars = Record<string, string | number>;

/**
 * All locale dictionaries. `en` is the complete reference; every locale file is typed as the full
 * `Dictionary`, but lookups still fall back to English key by key.
 */
export const dictionaries: { en: Dictionary } & Record<Locale, DeepPartial<Dictionary>> = {
  en,
  tr,
  es,
  pt,
  de,
  fr,
  it,
  ja,
  ko,
};

export { de, en, es, fr, it, ja, ko, pt, tr };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

const INTL_TAGS: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-GB',
  es: 'es-ES',
  pt: 'pt-BR',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

/** BCP-47 tag for Intl APIs (number, date and case formatting). */
export function intlTag(locale: Locale): string {
  return INTL_TAGS[locale];
}

/** True for the locales the website serves (tr, en). */
export function isCoreLocale(value: unknown): value is CoreLocale {
  return typeof value === 'string' && (CORE_LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the best supported locale from an Accept-Language header or a list of language tags.
 * `fallback` is returned when no tag matches (mobile passes 'en'); `supported` narrows the candidates.
 */
export function resolveLocale(
  input: string | readonly string[] | null | undefined,
  fallback: Locale = DEFAULT_LOCALE,
  supported: readonly Locale[] = LOCALES,
): Locale {
  if (!input) return fallback;
  const tags =
    typeof input === 'string'
      ? input
          .split(',')
          .map((part) => {
            const [tag = '', ...params] = part.trim().split(';');
            const q = params.find((p) => p.trim().startsWith('q='));
            return { tag, q: q ? Number(q.trim().slice(2)) || 0 : 1 };
          })
          .sort((a, b) => b.q - a.q)
          .map((entry) => entry.tag)
      : input;
  for (const tag of tags) {
    const base = tag.toLowerCase().split(/[-_]/)[0];
    if (isLocale(base) && supported.includes(base)) return base;
  }
  return fallback;
}

/** `resolveLocale` for the website: only tr/en, defaulting to Turkish. */
export function resolveCoreLocale(input: string | readonly string[] | null | undefined): CoreLocale {
  return resolveLocale(input, DEFAULT_LOCALE, CORE_LOCALES) as CoreLocale;
}

function lookup(dict: unknown, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

/** Replaces `{name}` placeholders; unknown placeholders are left as-is. */
export function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/**
 * Translates `key` for `locale`, falling back to English, then to the key itself.
 * @example t('tr', 'paywall.perWeek', { price: '₺129,99' })
 */
export function t(locale: Locale, key: TranslationKey, vars?: TranslationVars): string {
  const value = lookup(dictionaries[locale], key) ?? lookup(dictionaries.en, key) ?? key;
  return interpolate(value, vars);
}

/** Returns a `t` bound to one locale, convenient for components. */
export function createTranslator(locale: Locale) {
  return (key: TranslationKey, vars?: TranslationVars) => t(locale, key, vars);
}

/** Reads a catalogue value (season/look name, step text…) for a locale, falling back to English. */
export function localized<T>(value: Partial<Record<Locale, T>> & { en: T }, locale: Locale): T {
  return value[locale] ?? value.en;
}
