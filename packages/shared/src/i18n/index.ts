import { DEFAULT_LOCALE, LOCALES, type Locale } from '../schemas';
import { en, type Dictionary } from './en';
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
 * All locale dictionaries. `en` is the complete reference; future locales may be partial
 * and fall back to English key by key.
 */
export const dictionaries: { en: Dictionary } & Record<Locale, DeepPartial<Dictionary>> = { en, tr };

export { en, tr };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Picks the best supported locale from an Accept-Language header or a list of language tags. */
export function resolveLocale(input: string | readonly string[] | null | undefined): Locale {
  if (!input) return DEFAULT_LOCALE;
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
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
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
