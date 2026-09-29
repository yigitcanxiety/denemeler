import type { Locale } from '@tonelle/shared';

export const DEFAULT_SITE_URL = 'https://tonelle.app';

export type LegalPage = 'privacy' | 'kvkk' | 'consent' | 'terms';
export type MobilePlatform = 'ios' | 'android' | 'web' | 'windows' | 'macos';

export interface AppEnv {
  /** Base URL of the Tonelle API (apps/web), without trailing slash. */
  apiUrl: string;
  /** Marketing / legal site URL, without trailing slash. */
  siteUrl: string;
  rcIosKey: string | null;
  rcAndroidKey: string | null;
}

export interface RawEnv {
  EXPO_PUBLIC_API_URL?: string | undefined;
  EXPO_PUBLIC_SITE_URL?: string | undefined;
  EXPO_PUBLIC_RC_IOS_KEY?: string | undefined;
  EXPO_PUBLIC_RC_ANDROID_KEY?: string | undefined;
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
  };
}

/** Public legal page on the website, e.g. https://tonelle.app/tr/kvkk */
export function legalUrl(siteUrl: string, locale: Locale, page: LegalPage): string {
  return `${stripTrailingSlash(siteUrl)}/${locale}/${page}`;
}

/** RevenueCat public SDK key for the running platform, or null (→ dev purchases mode). */
export function revenueCatKeyFor(env: AppEnv, platform: MobilePlatform): string | null {
  if (platform === 'ios') return env.rcIosKey;
  if (platform === 'android') return env.rcAndroidKey;
  return null;
}
