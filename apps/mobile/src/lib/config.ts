import { isCoreLocale, type Locale } from '@tonelle/shared';

export const DEFAULT_SITE_URL = 'https://tonelleapp.com';

export type LegalPage = 'privacy' | 'kvkk' | 'consent' | 'terms';
export type MobilePlatform = 'ios' | 'android' | 'web' | 'windows' | 'macos';

export interface AppEnv {
  /** Base URL of the Tonelle API (apps/web), without trailing slash. */
  apiUrl: string;
  /** Marketing / legal site URL, without trailing slash. */
  siteUrl: string;
  rcIosKey: string | null;
  rcAndroidKey: string | null;
  /** Explicit opt-in (`EXPO_PUBLIC_ALLOW_DEV_PURCHASES=1`) for free dev purchases in a release build. */
  allowDevPurchases: boolean;
}

export interface RawEnv {
  EXPO_PUBLIC_API_URL?: string | undefined;
  EXPO_PUBLIC_SITE_URL?: string | undefined;
  EXPO_PUBLIC_RC_IOS_KEY?: string | undefined;
  EXPO_PUBLIC_RC_ANDROID_KEY?: string | undefined;
  EXPO_PUBLIC_ALLOW_DEV_PURCHASES?: string | undefined;
}

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export function readEnv(raw: RawEnv): AppEnv {
  const siteUrl = stripTrailingSlash(clean(raw.EXPO_PUBLIC_SITE_URL) ?? DEFAULT_SITE_URL);
  return {
    siteUrl,
    apiUrl: stripTrailingSlash(clean(raw.EXPO_PUBLIC_API_URL) ?? siteUrl),
    rcIosKey: clean(raw.EXPO_PUBLIC_RC_IOS_KEY),
    rcAndroidKey: clean(raw.EXPO_PUBLIC_RC_ANDROID_KEY),
    allowDevPurchases: clean(raw.EXPO_PUBLIC_ALLOW_DEV_PURCHASES) === '1',
  };
}

/**
 * Public legal page on the website, e.g. https://tonelleapp.com/tr/kvkk?app=1 (English for non-tr/en app languages). `app=1` hides the
 * site navigation, so the app never links towards web checkout (App Review 3.1.1).
 */
export function legalUrl(siteUrl: string, locale: Locale, page: LegalPage): string {
  // The site only exists in Turkish and English; every other app language reads the English page.
  return `${stripTrailingSlash(siteUrl)}/${isCoreLocale(locale) ? locale : 'en'}/${page}?app=1`;
}

/** RevenueCat public SDK key for the running platform, or null (→ dev / unavailable purchases mode). */
export function revenueCatKeyFor(env: AppEnv, platform: MobilePlatform): string | null {
  if (platform === 'ios') return env.rcIosKey;
  if (platform === 'android') return env.rcAndroidKey;
  return null;
}

/**
 * Web-only offline demo: the browser preview (`expo export --platform web`) runs without an API
 * when EXPO_PUBLIC_API_URL is unset and answers with the shared mock analysis instead.
 * Native builds always talk to the API.
 */
export function isWebDemoMode(raw: RawEnv, platform: MobilePlatform): boolean {
  return platform === 'web' && !clean(raw.EXPO_PUBLIC_API_URL);
}
