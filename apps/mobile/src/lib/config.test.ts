import { describe, expect, it } from 'vitest';

import { legalUrl, readEnv, revenueCatKeyFor } from './config';
import { hasActiveEntitlement, isPremium, purchasesModeFor } from './entitlement';

describe('readEnv', () => {
  it('defaults to tonelleapp.com and trims trailing slashes', () => {
    expect(readEnv({})).toEqual({
      apiUrl: 'https://tonelleapp.com',
      siteUrl: 'https://tonelleapp.com',
      rcIosKey: null,
      rcAndroidKey: null,
    });
    const env = readEnv({
      EXPO_PUBLIC_API_URL: 'http://192.168.1.2:3000/',
      EXPO_PUBLIC_SITE_URL: 'https://staging.tonelleapp.com/',
      EXPO_PUBLIC_RC_IOS_KEY: ' appl_123 ',
      EXPO_PUBLIC_RC_ANDROID_KEY: '',
    });
    expect(env.apiUrl).toBe('http://192.168.1.2:3000');
    expect(env.siteUrl).toBe('https://staging.tonelleapp.com');
    expect(env.rcIosKey).toBe('appl_123');
    expect(env.rcAndroidKey).toBeNull();
  });

  it('builds localized legal URLs', () => {
    expect(legalUrl('https://tonelleapp.com/', 'tr', 'kvkk')).toBe('https://tonelleapp.com/tr/kvkk');
    expect(legalUrl('https://tonelleapp.com', 'en', 'terms')).toBe('https://tonelleapp.com/en/terms');
  });
});

describe('purchases mode & entitlement', () => {
  const env = readEnv({ EXPO_PUBLIC_RC_IOS_KEY: 'appl_x' });

  it('uses RevenueCat only when a key exists for the platform', () => {
    expect(revenueCatKeyFor(env, 'ios')).toBe('appl_x');
    expect(purchasesModeFor(env, 'ios')).toBe('revenuecat');
    expect(purchasesModeFor(env, 'android')).toBe('dev');
    expect(purchasesModeFor(env, 'web')).toBe('dev');
  });

  it('checks the premium entitlement', () => {
    expect(hasActiveEntitlement({ entitlements: { active: { premium: { isActive: true } } } })).toBe(true);
    expect(hasActiveEntitlement({ entitlements: { active: { other: { isActive: true } } } })).toBe(false);
    expect(hasActiveEntitlement({ entitlements: { active: { premium: { isActive: false } } } })).toBe(false);
    expect(hasActiveEntitlement(null)).toBe(false);
  });

  it('resolves premium per mode', () => {
    expect(isPremium({ mode: 'dev', revenueCatActive: true, devEntitlement: false })).toBe(false);
    expect(isPremium({ mode: 'dev', revenueCatActive: false, devEntitlement: true })).toBe(true);
    expect(isPremium({ mode: 'revenuecat', revenueCatActive: true, devEntitlement: false })).toBe(true);
    expect(isPremium({ mode: 'revenuecat', revenueCatActive: false, devEntitlement: true })).toBe(false);
  });
});
