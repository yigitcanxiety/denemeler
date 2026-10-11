import type { Locale, PlanId } from '@tonelle/shared';
import { apiClient } from './api-client';
import type { PaymentProvider, PurchaseOutcome, PurchaseRequest } from './payments';
import { savePaddleRef } from './storage';

/**
 * Web checkout through Paddle.js (overlay). Paddle is the Merchant of Record; after
 * `checkout.completed` the server confirms the transaction and we keep its reference.
 * NEXT_PUBLIC_* values are inlined at build time, so they are read with literal access.
 */
export const PADDLE_PUBLIC = {
  token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '',
  sandbox: process.env.NEXT_PUBLIC_PADDLE_ENV !== 'production',
  prices: {
    weekly: process.env.NEXT_PUBLIC_PADDLE_PRICE_WEEKLY ?? '',
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY ?? '',
    report: process.env.NEXT_PUBLIC_PADDLE_PRICE_REPORT ?? '',
  } satisfies Record<PlanId, string>,
  exitDiscount: process.env.NEXT_PUBLIC_PADDLE_DISCOUNT_EXIT ?? '',
};

interface PaddleEvent {
  name?: string;
  data?: { transaction_id?: string };
}
interface PaddleJs {
  Environment: { set(env: 'sandbox'): void };
  Initialize(options: { token: string; eventCallback: (event: PaddleEvent) => void }): void;
  Checkout: { open(options: Record<string, unknown>): void; close(): void };
}
declare global {
  interface Window {
    Paddle?: PaddleJs;
  }
}

let ready: Promise<PaddleJs> | null = null;
/** Paddle.js allows a single event callback, so it forwards to the checkout in progress. */
let onEvent: (event: PaddleEvent) => void = () => undefined;

function loadPaddle(): Promise<PaddleJs> {
  ready ??= new Promise<PaddleJs>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      const paddle = window.Paddle;
      if (!paddle) return reject(new Error('Paddle.js did not load'));
      if (PADDLE_PUBLIC.sandbox) paddle.Environment.set('sandbox');
      paddle.Initialize({ token: PADDLE_PUBLIC.token, eventCallback: (event) => onEvent(event) });
      resolve(paddle);
    };
    script.onerror = () => {
      ready = null;
      reject(new Error('Paddle.js failed to load'));
    };
    document.head.appendChild(script);
  });
  return ready;
}

export class PaddlePaymentProvider implements PaymentProvider {
  readonly id = 'paddle';

  constructor(private readonly locale: () => Locale = () => (document.documentElement.lang === 'en' ? 'en' : 'tr')) {}

  isAvailable(): boolean {
    return Boolean(PADDLE_PUBLIC.token);
  }

  async purchase({ plan, exitOffer, appUserId }: PurchaseRequest): Promise<PurchaseOutcome> {
    let paddle: PaddleJs;
    try {
      paddle = await loadPaddle();
    } catch (error) {
      return { status: 'failed', message: error instanceof Error ? error.message : 'Paddle.js failed' };
    }

    const transactionId = await new Promise<string | null>((resolve) => {
      onEvent = (event) => {
        if (event.name === 'checkout.completed') resolve(event.data?.transaction_id ?? null);
        else if (event.name === 'checkout.closed') resolve(null);
      };
      paddle.Checkout.open({
        items: [{ priceId: PADDLE_PUBLIC.prices[plan], quantity: 1 }],
        customData: { appUserId },
        ...(exitOffer && plan === 'yearly' && PADDLE_PUBLIC.exitDiscount ? { discountId: PADDLE_PUBLIC.exitDiscount } : {}),
        settings: { displayMode: 'overlay', theme: 'light', locale: this.locale() },
      });
    });
    onEvent = () => undefined;
    if (!transactionId) return { status: 'cancelled' };

    // Paddle's success screen stays up while the server confirms the payment.
    const claim = await apiClient.claimPaddle(transactionId, appUserId);
    paddle.Checkout.close();
    if (!claim.ok) return { status: 'failed', message: claim.error.message };
    savePaddleRef(claim.data.paddleRef);
    return { status: 'purchased' };
  }
}
