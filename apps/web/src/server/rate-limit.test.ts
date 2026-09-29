import { describe, expect, it } from 'vitest';
import { SlidingWindowRateLimiter } from './rate-limit';

describe('SlidingWindowRateLimiter', () => {
  it('allows up to the limit then blocks with Retry-After', () => {
    const limiter = new SlidingWindowRateLimiter(3, 60_000);
    const t0 = 1_000_000;
    expect(limiter.check('a', t0)).toMatchObject({ allowed: true, remaining: 2 });
    expect(limiter.check('a', t0 + 1)).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.check('a', t0 + 2)).toMatchObject({ allowed: true, remaining: 0 });
    const blocked = limiter.check('a', t0 + 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(50);
  });

  it('slides: old hits expire individually', () => {
    const limiter = new SlidingWindowRateLimiter(2, 1_000);
    expect(limiter.check('k', 0).allowed).toBe(true);
    expect(limiter.check('k', 500).allowed).toBe(true);
    expect(limiter.check('k', 900).allowed).toBe(false);
    expect(limiter.check('k', 1_001).allowed).toBe(true); // first hit expired
    expect(limiter.check('k', 1_200).allowed).toBe(false);
  });

  it('keeps keys independent and sweeps stale keys', () => {
    const limiter = new SlidingWindowRateLimiter(1, 1_000, 2);
    expect(limiter.check('a', 0).allowed).toBe(true);
    expect(limiter.check('b', 0).allowed).toBe(true);
    expect(limiter.check('a', 10).allowed).toBe(false);
    limiter.check('c', 5_000); // exceeds sweep threshold → a, b swept
    expect(limiter.size).toBe(1);
    limiter.reset();
    expect(limiter.size).toBe(0);
  });
});
