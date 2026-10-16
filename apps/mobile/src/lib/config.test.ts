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
      allowDevPurchases: false,
    });
    const env = readEnv({
      EXPO_PUBLIC_API_URL: 'http://192.168.1.2:3000/',
      EXPO_PUBLIC_SITE_URL: 'https://staging.tonelleapp.com/',
      EXPO_PUBLIC_RC_IOS_KEY: ' appl_123 ',
      EXPO_PUBLIC_RC_ANDROID_KEY: '',
      EXPO_PUBLIC_ALLOW_DEV_PURCHASES: '1',
    });
    expect(env.apiUrl).toBe('http://192.168.1.2:3000');
    expect(env.siteUrl).toBe('https://staging.tonelleapp.com');
    expect(env.rcIosKey).toBe('appl_123');
    expect(env.rcAndroidKey).toBeNull();
    expect(env.allowDevPurchases).toBe(true);
    expect(readEnv({ EXPO_PUBLIC_ALLOW_DEV_PURCHASES: 'true' }).allowDevPurchases).toBe(false);
  });

  it('builds localized legal URLs', () => {
    expect(legalUrl('https://tonelleapp.com/', 'tr', 'kvkk')).toBe('https://tonelleapp.com/tr/kvkk?app=1');
    expect(legalUrl('https://tonelleapp.com', 'en', 'terms')).toBe('https://tonelleapp.com/en/terms?app=1');
  });
});

describe('purchases mode & entitlement', () => {
  const env = readEnv({ EXPO_PUBLIC_RC_IOS_KEY: 'appl_x' });

  it('uses RevenueCat only when a key exists for the platform', () => {
    expect(revenueCatKeyFor(env, 'ios')).toBe('appl_x');
    expect(purchasesModeFor(env, 'ios', false)).toBe('revenuecat');
    expect(purchasesModeFor(env, 'android', true)).toBe('dev');
    expect(purchasesModeFor(env, 'web', true)).toBe('dev');
  });

  it('allows dev purchases without a key only in dev builds or with the opt-in flag', () => {
    const none = readEnv({});
    expect(purchasesModeFor(none, 'ios', true)).toBe('dev');
    expect(purchasesModeFor(none, 'ios', false)).toBe('unavailable');
    expect(purchasesModeFor(readEnv({ EXPO_PUBLIC_ALLOW_DEV_PURCHASES: '1' }), 'ios', false)).toBe('dev');
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
    expect(isPremium({ mode: 'unavailable', revenueCatActive: true, devEntitlement: true })).toBe(false);
  });
});
