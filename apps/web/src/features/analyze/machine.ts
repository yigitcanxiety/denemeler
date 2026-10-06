import {
  BUDGETS,
  EXPERIENCE_LEVELS,
  EYE_COLORS,
  OCCASIONS,
  QuizAnswersSchema,
  SKIN_TYPES,
  type AnalyzeResponse,
  type QuizAnswers,
  type SkinAnalyzeResponse,
  type TranslationKey,
} from '@tonelle/shared';
import { errorMessageKey, type ClientErrorCode } from '@/lib/api-client';

/** Pure state machine for the web analysis flow (no side effects; see AnalyzeFlow.tsx). */

/** `full` = colour + makeup flow; `color` and `skin` are single, free analyses without quiz or paywall. */
export type AnalyzeMode = 'full' | 'color' | 'skin';

export type Step = 'consent' | 'quiz' | 'selfie' | 'scanning' | 'teaser' | 'paywall' | 'results';

export const QUIZ_KEYS = ['skinType', 'eyeColor', 'occasion', 'budget', 'experience'] as const;
export type QuizKey = (typeof QUIZ_KEYS)[number];

export const QUIZ_OPTIONS: { [K in QuizKey]: readonly QuizAnswers[K][] } = {
  skinType: SKIN_TYPES,
  eyeColor: EYE_COLORS,
  occasion: OCCASIONS,
  budget: BUDGETS,
  experience: EXPERIENCE_LEVELS,
};

export interface FlowState {
  mode: AnalyzeMode;
  step: Step;
  consent: { explicit: boolean; terms: boolean };
  /** User pressed continue without ticking both boxes. */
  consentAttempted: boolean;
  consentDeclined: boolean;
  quizIndex: number;
  quiz: Partial<QuizAnswers>;
  /** Downscaled selfie as a data URL. In memory only: never persisted. */
  photo: string | null;
  photoTooDark: boolean;
  /** Error shown on the selfie step (shared `errors.*` / `camera.*` key). */
  errorKey: TranslationKey | null;
  result: AnalyzeResponse | null;
  skin: SkinAnalyzeResponse | null;
  unlocked: boolean;
  exitOfferOpen: boolean;
  exitOfferSeen: boolean;
}

export const initialState: FlowState = {
  mode: 'full',
  step: 'consent',
  consent: { explicit: false, terms: false },
  consentAttempted: false,
  consentDeclined: false,
  quizIndex: 0,
  quiz: {},
  photo: null,
  photoTooDark: false,
  errorKey: null,
  result: null,
  skin: null,
  unlocked: false,
  exitOfferOpen: false,
  exitOfferSeen: false,
};

export type FlowEvent =
  | { type: 'SET_CONSENT'; field: 'explicit' | 'terms'; value: boolean }
  | { type: 'ACCEPT_CONSENT' }
  | { type: 'DECLINE_CONSENT' }
  | { type: 'ANSWER'; key: QuizKey; value: string }
  | { type: 'QUIZ_BACK' }
  | { type: 'SKIP_QUIZ' }
  | { type: 'SET_PHOTO'; dataUrl: string; tooDark: boolean }
  | { type: 'CLEAR_PHOTO' }
  | { type: 'SELFIE_ERROR'; errorKey: TranslationKey }
  | { type: 'START_ANALYSIS' }
  | { type: 'ANALYSIS_SUCCEEDED'; response: AnalyzeResponse }
  | { type: 'SKIN_SUCCEEDED'; response: SkinAnalyzeResponse }
  | { type: 'ANALYSIS_FAILED'; code: ClientErrorCode }
  | { type: 'OPEN_PAYWALL' }
  | { type: 'DISMISS_PAYWALL' }
  | { type: 'CLOSE_EXIT_OFFER' }
  | { type: 'UNLOCK' }
  | { type: 'RESTORE'; response: AnalyzeResponse; quiz?: QuizAnswers; unlocked: boolean }
  | { type: 'NEW_SELFIE' }
  | { type: 'START_OVER' }
  | { type: 'DELETE_DATA' };

export function hasConsent(state: FlowState): boolean {
  return state.consent.explicit && state.consent.terms;
}

/** Complete quiz answers, or undefined when the quiz was skipped / partially answered. */
export function completeQuiz(quiz: Partial<QuizAnswers>): QuizAnswers | undefined {
  const parsed = QuizAnswersSchema.safeParse(quiz);
  return parsed.success ? parsed.data : undefined;
}

function isOption<K extends QuizKey>(key: K, value: string): value is QuizAnswers[K] {
  return (QUIZ_OPTIONS[key] as readonly string[]).includes(value);
}

export function flowReducer(state: FlowState, event: FlowEvent): FlowState {
  switch (event.type) {
    case 'SET_CONSENT':
      return { ...state, consent: { ...state.consent, [event.field]: event.value }, consentDeclined: false };

    case 'ACCEPT_CONSENT':
      if (state.step !== 'consent') return state;
      if (!hasConsent(state)) return { ...state, consentAttempted: true };
      return { ...state, step: state.mode === 'full' ? 'quiz' : 'selfie', quizIndex: 0, consentAttempted: false, consentDeclined: false };

    case 'DECLINE_CONSENT':
      return { ...state, consentDeclined: true };

    case 'ANSWER': {
      if (state.step !== 'quiz' || !isOption(event.key, event.value)) return state;
      const quiz = { ...state.quiz, [event.key]: event.value };
      const last = state.quizIndex >= QUIZ_KEYS.length - 1;
      return last
        ? { ...state, quiz, step: 'selfie' }
        : { ...state, quiz, quizIndex: state.quizIndex + 1 };
    }

    case 'QUIZ_BACK':
      if (state.step === 'selfie' && state.mode !== 'full') return { ...state, step: 'consent', errorKey: null };
      if (state.step === 'selfie') return { ...state, step: 'quiz', quizIndex: QUIZ_KEYS.length - 1, errorKey: null };
      if (state.step !== 'quiz') return state;
      return state.quizIndex === 0 ? { ...state, step: 'consent' } : { ...state, quizIndex: state.quizIndex - 1 };

    case 'SKIP_QUIZ':
      return state.step === 'quiz' ? { ...state, step: 'selfie' } : state;

    case 'SET_PHOTO':
      return { ...state, photo: event.dataUrl, photoTooDark: event.tooDark, errorKey: null };

    case 'CLEAR_PHOTO':
      return { ...state, photo: null, photoTooDark: false };

    case 'SELFIE_ERROR':
      return { ...state, errorKey: event.errorKey };

    case 'START_ANALYSIS':
      if (state.step !== 'selfie' || !state.photo || !hasConsent(state)) return state;
      return { ...state, step: 'scanning', errorKey: null };

    case 'ANALYSIS_SUCCEEDED':
      if (state.step !== 'scanning') return state;
      return { ...state, result: event.response, step: state.unlocked || state.mode !== 'full' ? 'results' : 'teaser' };

    case 'SKIN_SUCCEEDED':
      if (state.step !== 'scanning') return state;
      return { ...state, skin: event.response, step: 'results' };

    case 'ANALYSIS_FAILED':
      if (state.step !== 'scanning') return state;
      if (event.code === 'aborted') return { ...state, step: 'selfie' };
      return {
        ...state,
        step: 'selfie',
        // A photo without a detectable face is useless: ask for a new one.
        photo: event.code === 'no_face' ? null : state.photo,
        errorKey: errorMessageKey(event.code),
      };

    case 'OPEN_PAYWALL':
      return state.result ? { ...state, step: 'paywall' } : state;

    case 'DISMISS_PAYWALL':
      if (state.step !== 'paywall') return state;
      if (!state.exitOfferSeen) return { ...state, exitOfferOpen: true, exitOfferSeen: true };
      return { ...state, step: 'teaser', exitOfferOpen: false };

    case 'CLOSE_EXIT_OFFER':
      return { ...state, exitOfferOpen: false, step: state.step === 'paywall' ? 'teaser' : state.step };

    case 'UNLOCK':
      return state.result ? { ...state, unlocked: true, exitOfferOpen: false, step: 'results' } : state;

    case 'RESTORE':
      return {
        ...state,
        consent: { explicit: true, terms: true },
        quiz: event.quiz ?? {},
        result: event.response,
        unlocked: event.unlocked,
        step: event.unlocked ? 'results' : 'teaser',
      };

    case 'NEW_SELFIE':
      return { ...state, step: 'selfie', photo: null, photoTooDark: false, errorKey: null };

    case 'START_OVER':
      return {
        ...initialState,
        mode: state.mode,
        consent: state.consent,
        unlocked: state.unlocked,
        exitOfferSeen: state.exitOfferSeen,
        step: !hasConsent(state) ? 'consent' : state.mode === 'full' ? 'quiz' : 'selfie',
      };

    case 'DELETE_DATA':
      return { ...initialState, mode: state.mode };

    default:
      return state;
  }
}
