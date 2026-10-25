import * as StoreReview from 'expo-store-review';

import { useAppStore } from '@/store/app-store';

/** Days before asking again; iOS itself also caps the prompt at 3 times a year. */
const REVIEW_COOLDOWN_DAYS = 120;

export function shouldAskForReview(askedAt: string | null, now: number = Date.now()): boolean {
  if (!askedAt) return true;
  const at = Date.parse(askedAt);
  return Number.isNaN(at) || now - at >= REVIEW_COOLDOWN_DAYS * 86_400_000;
}

/** Shows the native App Store rating prompt at most once per cooldown; silently skips where unavailable. */
export async function maybeAskForReview(): Promise<void> {
  const { reviewAskedAt, markReviewAsked } = useAppStore.getState();
  if (!shouldAskForReview(reviewAskedAt)) return;
  try {
    if (!(await StoreReview.hasAction())) return;
    markReviewAsked();
    await StoreReview.requestReview();
  } catch {
    // Rating prompt is best-effort.
  }
}
