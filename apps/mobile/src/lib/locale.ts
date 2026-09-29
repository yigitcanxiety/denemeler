import { LOCALES, isLocale, type Locale } from '@tonelle/shared';

/**
 * Picks the app locale from the device's preferred languages (most preferred first):
 * the first supported language wins, otherwise English (Turkish devices get `tr`).
 */
export function pickDeviceLocale(languageTags: readonly (string | null | undefined)[]): Locale {
  for (const tag of languageTags) {
    const base = tag?.toLowerCase().split(/[-_]/)[0];
    if (isLocale(base)) return base;
  }
  return 'en';
}

export const SUPPORTED_LOCALES: readonly Locale[] = LOCALES;

/** BCP-47 tag for Intl APIs. */
export function intlTag(locale: Locale): string {
  return locale === 'tr' ? 'tr-TR' : 'en-GB';
}
