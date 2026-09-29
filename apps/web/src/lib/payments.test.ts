import { describe, expect, it } from 'vitest';
import { StoreRedirectPaymentProvider, detectPlatform, storeLinksFor } from './payments';

const both = { appStore: 'https://apps.apple.com/x', playStore: 'https://play.google.com/x' };

describe('payments', () => {
  it('detects platforms from user agents', () => {
    expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe('ios');
    expect(detectPlatform('Mozilla/5.0 (Linux; Android 15; Pixel 9)')).toBe('android');
    expect(detectPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('other');
  });

  it('offers the matching store on phones and both on desktop', () => {
    expect(storeLinksFor('ios', both).map((l) => l.store)).toEqual(['app_store']);
    expect(storeLinksFor('android', both).map((l) => l.store)).toEqual(['play_store']);
    expect(storeLinksFor('other', both)).toHaveLength(2);
    expect(storeLinksFor('ios', { appStore: '', playStore: both.playStore }).map((l) => l.store)).toEqual(['play_store']);
  });

  it('is unavailable without store URLs and redirects otherwise', async () => {
    const none = new StoreRedirectPaymentProvider({ appStore: '', playStore: '' }, () => '');
    expect(none.isAvailable()).toBe(false);
    expect(await none.purchase({ plan: 'yearly', appUserId: 'u' })).toEqual({ status: 'unavailable' });

    const ios = new StoreRedirectPaymentProvider(both, () => 'iPhone');
    expect(await ios.purchase({ plan: 'weekly', appUserId: 'u' })).toEqual({
      status: 'redirect',
      links: [{ store: 'app_store', url: both.appStore }],
    });
  });
});
