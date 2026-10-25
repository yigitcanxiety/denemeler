import type { TranslationKey } from '@tonelle/shared';

/** Messages shown in order while the analysis request is in flight. */
export const ANALYZING_STEPS = [
  'analyzing.stepFace',
  'analyzing.stepUndertone',
  'analyzing.stepContrast',
  'analyzing.stepSeason',
  'analyzing.stepPalette',
  'analyzing.stepLooks',
] as const satisfies readonly TranslationKey[];

export const ANALYZING_SLOW_MS = 20_000;
/** Minimum time on the analyzing screen: the ring climbs steadily to 90% over it, so it never flashes by. */
export const ANALYZING_MIN_MS = 9000;
/** Once the result is in, the ring glides from where it is to 100% over this long. */
export const ANALYZING_FINISH_MS = 1400;

/** Checklist steps completed at `progress` (0..count), so the list and the ring move together. */
export function analyzingStepIndex(progress: number, count: number = ANALYZING_STEPS.length): number {
  return Math.min(count, Math.max(0, Math.floor(progress * count)));
}

export function isAnalysisSlow(elapsedMs: number, slowMs: number = ANALYZING_SLOW_MS): boolean {
  return elapsedMs >= slowMs;
}

/** Progress 0..1 while waiting: a steady climb to 90% over the minimum time, then a slow creep towards 97%. */
export function analyzingProgress(elapsedMs: number): number {
  const t = Math.max(0, elapsedMs);
  if (t <= ANALYZING_MIN_MS) return 0.9 * (t / ANALYZING_MIN_MS);
  return 0.97 - 0.07 * Math.exp(-(t - ANALYZING_MIN_MS) / 10_000);
}

/** After the result arrives: eases from `from` to 1 over ANALYZING_FINISH_MS. */
export function finishingProgress(from: number, sinceDoneMs: number): number {
  const k = Math.min(1, Math.max(0, sinceDoneMs) / ANALYZING_FINISH_MS);
  return from + (1 - from) * (1 - (1 - k) ** 2);
}
