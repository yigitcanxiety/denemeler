/**
 * Meta Pixel, loaded only after the visitor accepts ad cookies (privacy policy §5).
 * Without NEXT_PUBLIC_META_PIXEL_ID nothing loads and `track` is a no-op.
 * ponytail: browser pixel only; add the Conversions API (server, from Paddle webhooks) when
 * ad blockers measurably hide purchases. Pass `eventId` so the two can be deduplicated.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

const CONSENT_KEY = 'tonelle.adConsent';

export type AdConsent = 'granted' | 'denied';

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function getAdConsent(): AdConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function setAdConsent(value: AdConsent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Without storage the banner simply asks again next visit.
  }
  if (value === 'granted') loadPixel();
}

/** Meta's standard base code, written out so it only runs after consent. */
export function loadPixel(): void {
  if (!META_PIXEL_ID || window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

/** Sends a standard Meta event when the pixel is loaded (consent given). */
export function track(event: string, params?: Record<string, unknown>, eventId?: string): void {
  window.fbq?.('track', event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}
