import { describe, expect, it, vi } from 'vitest';

import { shouldAskForReview } from './review';

vi.mock('expo-store-review', () => ({ hasAction: vi.fn(), requestReview: vi.fn() }));
vi.mock('@/store/app-store', () => ({ useAppStore: { getState: vi.fn() } }));

describe('review prompt', () => {
  const now = Date.parse('2026-10-25T00:00:00Z');
  it('asks once, then waits 120 days', () => {
    expect(shouldAskForReview(null, now)).toBe(true);
    expect(shouldAskForReview('2026-09-01T00:00:00Z', now)).toBe(false);
    expect(shouldAskForReview('2026-06-01T00:00:00Z', now)).toBe(true);
    expect(shouldAskForReview('garbage', now)).toBe(true);
  });
});
