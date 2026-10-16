import { resolveLocale, type Locale } from '@tonelle/shared';

/**
 * Picks the app locale from the device's preferred languages (most preferred first):
 * the first supported language wins, otherwise English.
 */
export function pickDeviceLocale(languageTags: readonly (string | null | undefined)[]): Locale {
  return resolveLocale(
    languageTags.filter((tag): tag is string => !!tag),
    'en',
  );
}
