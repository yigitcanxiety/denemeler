import {
  LOOKS,
  LookIdSchema,
  localized,
  recommendLooks,
  type FaceAnalysis,
  type Locale,
  type Look,
  type LookId,
  type LookStepArea,
  type QuizAnswers,
} from '@tonelle/shared';

/**
 * The 3 looks to show: the server's recommendation when valid, otherwise the shared
 * deterministic `recommendLooks` (same logic the server uses).
 */
export function resolveRecommendedLooks(
  analysis: FaceAnalysis,
  serverIds: readonly unknown[] | null | undefined,
  quiz?: QuizAnswers,
): LookId[] {
  const valid = (serverIds ?? []).filter((id): id is LookId => LookIdSchema.safeParse(id).success);
  const unique = [...new Set(valid)];
  if (unique.length >= 3) return unique.slice(0, 3);
  return recommendLooks(analysis, quiz);
}

export function isLookId(value: unknown): value is LookId {
  return LookIdSchema.safeParse(value).success;
}

export interface LocalizedStep {
  number: number;
  area: LookStepArea;
  title: string;
  body: string;
}

export function localizedSteps(look: Look, locale: Locale): LocalizedStep[] {
  return look.steps.map((step, index) => ({
    number: index + 1,
    area: step.area,
    title: localized(step.title, locale),
    body: localized(step.body, locale),
  }));
}

export interface LookSummary {
  id: LookId;
  name: string;
  description: string;
  occasions: Look['occasions'];
  intensity: Look['intensity'];
  level: Look['level'];
}

export function lookSummary(id: LookId, locale: Locale): LookSummary {
  const look = LOOKS[id];
  return {
    id,
    name: localized(look.name, locale),
    description: localized(look.description, locale),
    occasions: look.occasions,
    intensity: look.intensity,
    level: look.level,
  };
}

/** Shade swatches relevant to a look (lip, blush, eyeshadow from the user's analysis). */
export function lookShades(analysis: FaceAnalysis, look: Look): { lip: string[]; blush: string[]; eyeshadow: string[] } {
  const take = look.intensity === 'subtle' ? 2 : 3;
  return {
    lip: analysis.lip.slice(0, take),
    blush: analysis.blush.slice(0, take),
    eyeshadow: analysis.eyeshadow.slice(0, take),
  };
}
