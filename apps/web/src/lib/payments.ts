import type { PlanId } from '@tonelle/shared';
import { STORE_URLS } from '@/config/company';
import { PADDLE_PUBLIC, PaddlePaymentProvider } from './paddle-checkout';

export type StoreId = 'app_store' | 'play_store';

export interface StoreLink {
  store: StoreId;
  url: string;
}

/** Outcome of asking a provider to buy a plan. */
export type PurchaseOutcome =
  /** Payment completed on the web; entitlement is active. (Future web checkout.) */
  | { status: 'purchased' }
  /** User must finish in a store app; `links` are ordered by relevance to their device. */
  | { status: 'redirect'; links: StoreLink[] }
  /** No purchase channel is live yet. */
  | { status: 'unavailable' }
  | { status: 'cancelled' }
  | { status: 'failed'; message: string };

export interface PurchaseRequest {
  plan: PlanId;
  /** Exit-offer purchase (50% off yearly). */
  exitOffer?: boolean;
  appUserId: string;
}

/**
 * Seam for web payments: `PaddlePaymentProvider` (web checkout) or `StoreRedirectPaymentProvider`
 * (send buyers to the native apps).
 */
export interface PaymentProvider {
  readonly id: string;
  /** Whether any purchase channel is available (controls "coming soon" UI). */
  isAvailable(): boolean;
  purchase(request: PurchaseRequest): Promise<PurchaseOutcome>;
}

export type DevicePlatform = 'ios' | 'android' | 'other';

export function detectPlatform(userAgent: string): DevicePlatform {
  if (/android/i.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && /mobile/i.test(userAgent))) return 'ios';
  return 'other';
}

/** Store links that are configured, most relevant first for the given platform. */
export function storeLinksFor(
  platform: DevicePlatform,
  urls: { appStore: string; playStore: string } = STORE_URLS,
): StoreLink[] {
  const links: StoreLink[] = [];
  if (urls.appStore) links.push({ store: 'app_store', url: urls.appStore });
  if (urls.playStore) links.push({ store: 'play_store', url: urls.playStore });
  // On a phone, only offer that phone's store when it is configured.
  const preferred: StoreId | null = platform === 'ios' ? 'app_store' : platform === 'android' ? 'play_store' : null;
  const match = preferred ? links.filter((link) => link.store === preferred) : [];
  return match.length ? match : links;
}

/** Sends buyers to the native app, where purchases run through Apple / Google + RevenueCat. */
export class StoreRedirectPaymentProvider implements PaymentProvider {
  readonly id = 'store-redirect';

  constructor(
    private readonly urls: { appStore: string; playStore: string } = STORE_URLS,
    private readonly getUserAgent: () => string = () =>
      typeof navigator === 'undefined' ? '' : navigator.userAgent,
  ) {}

  isAvailable(): boolean {
    return Boolean(this.urls.appStore || this.urls.playStore);
  }

  async purchase(request: PurchaseRequest): Promise<PurchaseOutcome> {
    void request; // Plan selection happens again in the app's native paywall.
    if (!this.isAvailable()) return { status: 'unavailable' };
    return { status: 'redirect', links: storeLinksFor(detectPlatform(this.getUserAgent()), this.urls) };
  }
}

/** Paddle on the web when its client token is configured; otherwise send buyers to the apps. */
export const paymentProvider: PaymentProvider = PADDLE_PUBLIC.token ? new PaddlePaymentProvider() : new StoreRedirectPaymentProvider();
