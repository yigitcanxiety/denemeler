import { DEFAULT_LOCALE, isLocale, resolveLocale, type Locale } from '@tonelle/shared';

export const LOCALE_COOKIE = 'tonelle_locale';

/** Returns the locale prefix of a pathname (`/en/analyze` → `en`), or null if there is none. */
export function localeFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  return isLocale(segment) ? segment : null;
}

/** Chooses the locale for an un-prefixed request: saved cookie first, then Accept-Language. */
export function pickLocale(cookieValue: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  return acceptLanguage ? resolveLocale(acceptLanguage) : DEFAULT_LOCALE;
}
