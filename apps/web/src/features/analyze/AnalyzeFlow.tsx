'use client';

import { createTranslator, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Chip } from '@/components/lab/primitives';
import { LanguageSwitcher } from '@/components/site/LanguageSwitcher';
import { Logo } from '@/components/site/Logo';
import { apiClient, type ApiClient } from '@/lib/api-client';
import { clearAllData, clearAnalysis, loadAnalysis, saveAnalysis } from '@/lib/storage';
import { completeQuiz, flowReducer, initialState, type FlowEvent, type FlowState } from './machine';
import { ConsentStep } from './steps/ConsentStep';
import { PaywallStep } from './steps/PaywallStep';
import { QuizStep } from './steps/QuizStep';
import { ResultsStep } from './steps/ResultsStep';
import { ScanningStep } from './steps/ScanningStep';
import { SelfieStep } from './steps/SelfieStep';
import { TeaserStep } from './steps/TeaserStep';
import type { AnalyzeCopy, StoreCopy } from './types';
import { Note } from './ui';

/** Position of each step in the free part of the flow (chip `2/5`); paid steps show PREMIUM. */
const STEP_NUMBER: Partial<Record<FlowState['step'], number>> = { consent: 1, quiz: 2, selfie: 3, scanning: 4, teaser: 5 };

const noopSubscribe = () => () => undefined;

/** Minimum time the scanning animation stays up, so the step never flashes by. */
const MIN_SCAN_MS = 3200;

export function AnalyzeFlow({
  locale,
  copy,
  stores,
  client = apiClient,
}: {
  locale: Locale;
  copy: AnalyzeCopy;
  stores: StoreCopy;
  client?: ApiClient;
}) {
  const [state, dispatch] = useReducer(flowReducer, initialState);
  const demoParam = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get('demo') === '1',
    () => false,
  );
  const demoAllowed = process.env.NODE_ENV !== 'production' || demoParam;
  const tt = useMemo(() => createTranslator(locale), [locale]);
  const restored = useRef(false);

  // Restore the last analysis (never a photo) after hydration.
  useEffect(() => {
    const saved = loadAnalysis();
    if (saved) dispatch({ type: 'RESTORE', response: saved.response, quiz: saved.quiz, unlocked: saved.unlocked });
    restored.current = true;
  }, []);

  // Persist derived results whenever they change.
  useEffect(() => {
    if (!restored.current) return;
    if (state.result) saveAnalysis({ response: state.result, quiz: completeQuiz(state.quiz), unlocked: state.unlocked });
  }, [state.result, state.unlocked, state.quiz]);

  // Storage side effects of user actions, then the pure transition.
  const [notice, setNotice] = useState<string | null>(null);
  const send = useCallback(
    (event: FlowEvent) => {
      if (event.type === 'DELETE_DATA') {
        clearAllData();
        setNotice(tt('settings.deleteDataDone'));
      } else if (event.type === 'START_OVER') {
        clearAnalysis();
        setNotice(null);
      } else if (event.type !== 'SET_CONSENT') {
        setNotice(null);
      }
      dispatch(event);
    },
    [tt],
  );

  // Run the analysis while on the scanning step.
  useEffect(() => {
    if (state.step !== 'scanning' || !state.photo) return;
    const controller = new AbortController();
    const started = Date.now();
    void client
      .analyze({ image: state.photo, locale, quiz: completeQuiz(state.quiz) }, { signal: controller.signal })
      .then(async (res) => {
        const wait = MIN_SCAN_MS - (Date.now() - started);
        if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
        if (controller.signal.aborted) return;
        if (res.ok) dispatch({ type: 'ANALYSIS_SUCCEEDED', response: res.data });
        else dispatch({ type: 'ANALYSIS_FAILED', code: res.error.code });
      });
    return () => controller.abort();
    // The photo/quiz cannot change while scanning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, client, locale]);

  // Scroll to top on step change (keeps the flow feeling like separate screens).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [state.step]);

  const stepProps = { locale, state, dispatch: send, copy, tt };
  const wide = state.step === 'results';

  const n = STEP_NUMBER[state.step];

  return (
    <div className={clsx('relative mx-auto w-full px-3 pt-3 pb-16 sm:px-6 sm:pt-6', wide ? 'max-w-5xl' : 'max-w-[34rem]')}>
      {/* BRIK top bar card: wordmark + step chip */}
      <header className="ink-card flex h-16 items-center justify-between gap-3 pr-2.5 pl-5">
        <Link href={`/${locale}`} aria-label={copy.homeLink} className="rounded-md">
          <Logo inverse className="text-[1.25rem]" />
        </Link>
        <div className="flex items-center gap-2">
          {n ? (
            <Chip tone="soft">
              <span aria-hidden>{`${n}/5`}</span>
              <span className="sr-only">{tt('common.stepOf', { current: n, total: 5 })}</span>
            </Chip>
          ) : (
            <Chip tone="soft">Premium</Chip>
          )}
          <LanguageSwitcher locale={locale} compact tone="ink" className="border-0" />
        </div>
      </header>
      <div aria-live="polite">
        {notice && (
          <Note tone="success" className="mt-3">
            {notice}
          </Note>
        )}
      </div>
      <div className="mt-[10px]">
        {state.step === 'consent' && <ConsentStep {...stepProps} />}
        {state.step === 'quiz' && <QuizStep {...stepProps} />}
        {state.step === 'selfie' && <SelfieStep {...stepProps} />}
        {state.step === 'scanning' && <ScanningStep {...stepProps} />}
        {state.step === 'teaser' && <TeaserStep {...stepProps} />}
        {state.step === 'paywall' && <PaywallStep {...stepProps} stores={stores} demoAllowed={demoAllowed} />}
        {state.step === 'results' && <ResultsStep {...stepProps} client={client} />}
      </div>
    </div>
  );
}
