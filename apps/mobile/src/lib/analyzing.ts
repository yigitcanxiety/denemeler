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

export const ANALYZING_STEP_MS = 2200;
export const ANALYZING_SLOW_MS = 20_000;
/** Minimum time on the analyzing screen so the experience doesn't flash by on fast responses. */
export const ANALYZING_MIN_MS = 3500;

/** Index of the message to show after `elapsedMs`; holds on the last step once reached. */
export function analyzingStepIndex(
  elapsedMs: number,
  stepMs: number = ANALYZING_STEP_MS,
  count: number = ANALYZING_STEPS.length,
): number {
  if (count <= 0) return 0;
  const index = Math.floor(Math.max(0, elapsedMs) / stepMs);
  return Math.min(index, count - 1);
}

export function isAnalysisSlow(elapsedMs: number, slowMs: number = ANALYZING_SLOW_MS): boolean {
  return elapsedMs >= slowMs;
}

/** Progress 0..1 for the progress bar (eases towards 0.95 until the response arrives). */
export function analyzingProgress(elapsedMs: number, done: boolean): number {
  if (done) return 1;
  const t = Math.max(0, elapsedMs) / 1000;
  return Math.min(0.95, 1 - Math.exp(-t / 8));
}
