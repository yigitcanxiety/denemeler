/**
 * Simple in-memory sliding-window rate limiter.
 *
 * NOTE: state is per server instance (per serverless function instance on Vercel), so the
 * effective limit across a fleet is `limit × instances`. That is acceptable for launch; move to
 * a shared store (e.g. Upstash Redis) if abuse becomes a problem.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the next request would be allowed (0 when allowed). */
  retryAfterSeconds: number;
}

export class SlidingWindowRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    readonly limit: number,
    readonly windowMs: number,
    /** Sweep stale keys once the map grows past this many entries. */
    private readonly sweepThreshold = 10_000,
  ) {}

  /** Records a hit for `key` if under the limit. */
  check(key: string, now: number = Date.now()): RateLimitResult {
    const windowStart = now - this.windowMs;
    const timestamps = (this.hits.get(key) ?? []).filter((t) => t > windowStart);

    if (timestamps.length >= this.limit) {
      this.hits.set(key, timestamps);
      const oldest = timestamps[0] ?? now;
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000)),
      };
    }

    timestamps.push(now);
    this.hits.set(key, timestamps);
    if (this.hits.size > this.sweepThreshold) this.sweep(now);
    return { allowed: true, remaining: this.limit - timestamps.length, retryAfterSeconds: 0 };
  }

  reset(): void {
    this.hits.clear();
  }

  get size(): number {
    return this.hits.size;
  }

  private sweep(now: number): void {
    const windowStart = now - this.windowMs;
    for (const [key, timestamps] of this.hits) {
      if (!timestamps.some((t) => t > windowStart)) this.hits.delete(key);
    }
  }
}

const HOUR_MS = 60 * 60 * 1000;

/** `/api/analyze`: 10 requests / hour / IP. */
export const analyzeRateLimiter = new SlidingWindowRateLimiter(10, HOUR_MS);
/** `/api/render-look`: 30 requests / hour / app user. */
export const renderRateLimiter = new SlidingWindowRateLimiter(30, HOUR_MS);
/**
 * Free renders (`TONELLE_FREE_RENDERS=1`, no payment check): 6 / day / IP, one analysis' three
 * looks twice. ponytail: per instance like the others; move to Redis before real traffic.
 */
export const freeRenderRateLimiter = new SlidingWindowRateLimiter(6, 24 * HOUR_MS);
