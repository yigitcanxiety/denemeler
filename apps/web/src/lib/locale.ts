import { CORE_LOCALES, DEFAULT_LOCALE, isCoreLocale, resolveLocale, type CoreLocale } from '@tonelle/shared';

export const LOCALE_COOKIE = 'tonelle_locale';

/** Returns the locale prefix of a pathname (`/en/analyze` → `en`), or null if there is none. */
export function localeFromPathname(pathname: string): CoreLocale | null {
  const segment = pathname.split('/')[1];
  return isCoreLocale(segment) ? segment : null;
}

/**
 * Chooses the locale for an un-prefixed request: saved cookie first, then Accept-Language.
 * A header with neither tr nor en (e.g. de-DE) gets English; no header keeps the default.
 */
export function pickLocale(cookieValue: string | undefined, acceptLanguage: string | null): CoreLocale {
  if (isCoreLocale(cookieValue)) return cookieValue;
  return acceptLanguage ? (resolveLocale(acceptLanguage, 'en', CORE_LOCALES) as CoreLocale) : DEFAULT_LOCALE;
}
