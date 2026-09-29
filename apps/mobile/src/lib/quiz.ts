import {
  BUDGETS,
  EXPERIENCE_LEVELS,
  EYE_COLORS,
  OCCASIONS,
  QuizAnswersSchema,
  SKIN_TYPES,
  type QuizAnswers,
  type TranslationKey,
} from '@tonelle/shared';

export type QuizStepId = keyof QuizAnswers;

export interface QuizStep {
  id: QuizStepId;
  questionKey: TranslationKey;
  hintKey: TranslationKey;
  options: { value: string; labelKey: TranslationKey }[];
}

function step<K extends QuizStepId>(id: K, values: readonly QuizAnswers[K][]): QuizStep {
  return {
    id,
    questionKey: `quiz.${id}.question` as TranslationKey,
    hintKey: `quiz.${id}.hint` as TranslationKey,
    options: values.map((value) => ({ value, labelKey: `quiz.${id}.options.${value}` as TranslationKey })),
  };
}

/** The 5 quiz steps, in order, built from the shared schema enums and quiz dictionary. */
export const QUIZ_STEPS: readonly QuizStep[] = [
  step('skinType', SKIN_TYPES),
  step('eyeColor', EYE_COLORS),
  step('occasion', OCCASIONS),
  step('budget', BUDGETS),
  step('experience', EXPERIENCE_LEVELS),
];

/** Complete answers for the API, or undefined if the quiz was skipped / partially answered. */
export function completeQuiz(answers: Partial<QuizAnswers>): QuizAnswers | undefined {
  const parsed = QuizAnswersSchema.safeParse(answers);
  return parsed.success ? parsed.data : undefined;
}

/** Index of the first unanswered step (QUIZ_STEPS.length when complete). */
export function firstUnansweredStep(answers: Partial<QuizAnswers>): number {
  const index = QUIZ_STEPS.findIndex((s) => answers[s.id] === undefined);
  return index === -1 ? QUIZ_STEPS.length : index;
}
