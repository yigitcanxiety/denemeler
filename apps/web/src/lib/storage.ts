import { AnalyzeResponseSchema, QuizAnswersSchema, type AnalyzeResponse, type QuizAnswers } from '@tonelle/shared';
import { z } from 'zod';

/**
 * Browser persistence for the web flow. Only derived results are stored, NEVER the photo.
 * Every access is guarded: storage can be unavailable (private mode, blocked site data).
 */

const ANALYSIS_KEY = 'tonelle.analysis.v1';
const APP_USER_KEY = 'tonelle.appUserId';

const PersistedAnalysisSchema = z.object({
  version: z.literal(1),
  savedAt: z.string(),
  response: AnalyzeResponseSchema,
  quiz: QuizAnswersSchema.optional(),
  unlocked: z.boolean(),
});
export type PersistedAnalysis = z.infer<typeof PersistedAnalysisSchema>;

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadAnalysis(): PersistedAnalysis | null {
  try {
    const raw = storage()?.getItem(ANALYSIS_KEY);
    if (!raw) return null;
    const parsed = PersistedAnalysisSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveAnalysis(data: { response: AnalyzeResponse; quiz?: QuizAnswers; unlocked: boolean }): void {
  const value: PersistedAnalysis = { version: 1, savedAt: new Date().toISOString(), ...data };
  try {
    storage()?.setItem(ANALYSIS_KEY, JSON.stringify(value));
  } catch {
    // Quota or privacy mode: results simply won't survive a reload.
  }
}

/** Removes the saved analysis (keeps the anonymous id so purchases stay linked). */
export function clearAnalysis(): void {
  try {
    storage()?.removeItem(ANALYSIS_KEY);
  } catch {
    // ignore
  }
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Anonymous id used as RevenueCat app user id for entitlement checks; created on first use. */
export function getAppUserId(): string {
  const store = storage();
  try {
    const existing = store?.getItem(APP_USER_KEY);
    if (existing) return existing;
  } catch {
    // ignore
  }
  const id = `web_${randomId()}`;
  try {
    store?.setItem(APP_USER_KEY, id);
  } catch {
    // ignore
  }
  return id;
}

/** "Delete my data": removes everything Tonelle stored in this browser. */
export function clearAllData(): void {
  const store = storage();
  if (!store) return;
  try {
    for (const key of Object.keys(store)) {
      if (key.startsWith('tonelle.')) store.removeItem(key);
    }
  } catch {
    // ignore
  }
}
