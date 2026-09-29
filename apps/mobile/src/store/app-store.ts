import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FaceAnalysisSchema,
  LookIdSchema,
  QuizAnswersSchema,
  isLocale,
  type AnalyzeResponse,
  type FaceAnalysis,
  type Locale,
  type LookId,
  type QuizAnswers,
} from '@tonelle/shared';
import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';

/** Photo kept in memory for the current session only — never persisted. */
export interface SessionPhoto {
  uri: string;
  dataUrl: string;
  width: number;
  height: number;
}

interface PersistedState {
  /** null until the user picks one; the UI falls back to the device locale. */
  locale: Locale | null;
  /** Anonymous id used as RevenueCat appUserID and for /api/render-look. */
  anonId: string | null;
  consentAt: string | null;
  quiz: Partial<QuizAnswers>;
  analysis: FaceAnalysis | null;
  recommendedLookIds: LookId[] | null;
  analyzedAt: string | null;
  /** Dev purchases mode only: locally unlocked premium. */
  devEntitlement: boolean;
}

interface SessionState {
  hydrated: boolean;
  photo: SessionPhoto | null;
  /** Rendered looks (data URLs) for the current session only — they show the user's face. */
  renders: Partial<Record<LookId, string>>;
  /** Entitlement reported by RevenueCat (not persisted; RevenueCat caches it itself). */
  revenueCatPremium: boolean;
}

interface Actions {
  setLocale(locale: Locale): void;
  ensureAnonId(): string;
  acceptConsent(): void;
  setQuizAnswer<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]): void;
  setPhoto(photo: SessionPhoto | null): void;
  setAnalysis(response: AnalyzeResponse): void;
  setRender(lookId: LookId, dataUrl: string): void;
  setRevenueCatPremium(active: boolean): void;
  setDevEntitlement(active: boolean): void;
  /** "Delete my data": wipes analysis, answers, ids, photo and preferences. Returns the new anon id. */
  deleteAllData(): string;
}

export type AppState = PersistedState & SessionState & Actions;

const initialPersisted: PersistedState = {
  locale: null,
  anonId: null,
  consentAt: null,
  quiz: {},
  analysis: null,
  recommendedLookIds: null,
  analyzedAt: null,
  devEntitlement: false,
};

function sanitizePersisted(value: unknown): Partial<PersistedState> {
  if (!value || typeof value !== 'object') return {};
  const raw = value as Record<string, unknown>;
  const analysis = FaceAnalysisSchema.safeParse(raw.analysis);
  const lookIds = z.array(LookIdSchema).safeParse(raw.recommendedLookIds);
  const quiz = QuizAnswersSchema.partial().safeParse(raw.quiz);
  return {
    locale: isLocale(raw.locale) ? raw.locale : null,
    anonId: typeof raw.anonId === 'string' && raw.anonId ? raw.anonId : null,
    consentAt: typeof raw.consentAt === 'string' ? raw.consentAt : null,
    quiz: quiz.success ? quiz.data : {},
    analysis: analysis.success ? analysis.data : null,
    recommendedLookIds: analysis.success && lookIds.success ? lookIds.data : null,
    analyzedAt: analysis.success && typeof raw.analyzedAt === 'string' ? raw.analyzedAt : null,
    devEntitlement: raw.devEntitlement === true,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      hydrated: false,
      photo: null,
      renders: {},
      revenueCatPremium: false,

      setLocale: (locale) => set({ locale }),
      ensureAnonId: () => {
        const existing = get().anonId;
        if (existing) return existing;
        const id = randomUUID();
        set({ anonId: id });
        return id;
      },
      acceptConsent: () => set({ consentAt: new Date().toISOString() }),
      setQuizAnswer: (key, value) => set((state) => ({ quiz: { ...state.quiz, [key]: value } })),
      setPhoto: (photo) => set({ photo, renders: {} }),
      setAnalysis: (response) =>
        set({
          analysis: response.analysis,
          recommendedLookIds: response.recommendedLookIds,
          analyzedAt: new Date().toISOString(),
        }),
      setRender: (lookId, dataUrl) => set((state) => ({ renders: { ...state.renders, [lookId]: dataUrl } })),
      setRevenueCatPremium: (active) => set({ revenueCatPremium: active }),
      setDevEntitlement: (active) => set({ devEntitlement: active }),
      deleteAllData: () => {
        const anonId = randomUUID();
        set({ ...initialPersisted, anonId, photo: null, renders: {} });
        return anonId;
      },
    }),
    {
      name: 'tonelle-app',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Only durable, non-biometric data is persisted. Photos and rendered looks stay in memory.
      partialize: (state): PersistedState => ({
        locale: state.locale,
        anonId: state.anonId,
        consentAt: state.consentAt,
        quiz: state.quiz,
        analysis: state.analysis,
        recommendedLookIds: state.recommendedLookIds,
        analyzedAt: state.analyzedAt,
        devEntitlement: state.devEntitlement,
      }),
      // Drop saved data that no longer matches the shared schemas (e.g. after an app update).
      merge: (persisted, current) => ({ ...current, ...sanitizePersisted(persisted) }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('Failed to restore saved data', error);
        useAppStore.getState().ensureAnonId();
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);
