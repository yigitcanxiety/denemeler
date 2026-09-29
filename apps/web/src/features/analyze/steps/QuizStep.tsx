'use client';

import clsx from 'clsx';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button, Progress } from '@/components/ui';
import { QUIZ_KEYS, QUIZ_OPTIONS } from '../machine';
import type { StepProps } from '../types';

export function QuizStep({ state, dispatch, copy, tt }: StepProps) {
  const key = QUIZ_KEYS[state.quizIndex] ?? QUIZ_KEYS[0];
  const total = QUIZ_KEYS.length;
  const current = state.quizIndex + 1;
  const selected = state.quiz[key];
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the new question for screen-reader and keyboard users.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [key]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'QUIZ_BACK' })} icon={<ArrowLeft aria-hidden className="size-4" />}>
          {tt('common.back')}
        </Button>
        <span className="text-sm font-medium text-ink-muted">{tt('quiz.progress', { current, total })}</span>
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'SKIP_QUIZ' })}>
          {tt('common.skip')}
        </Button>
      </div>
      <Progress value={current} max={total} label={`${copy.quizLabel}: ${tt('common.stepOf', { current, total })}`} className="mt-3" />

      <div key={key} className="tonelle-enter mt-8">
        {state.quizIndex === 0 && <p className="text-sm font-semibold text-accent">{tt('quiz.title')}</p>}
        <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl text-ink outline-none sm:text-4xl">
          {tt(`quiz.${key}.question`)}
        </h1>
        <p className="mt-2 text-ink-muted">{tt(`quiz.${key}.hint`)}</p>

        <div role="radiogroup" aria-label={tt(`quiz.${key}.question`)} className="mt-6 grid gap-2.5">
          {QUIZ_OPTIONS[key].map((option) => {
            const active = selected === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => dispatch({ type: 'ANSWER', key, value: option })}
                className={clsx(
                  'flex min-h-14 items-center justify-between rounded-2xl border px-5 py-3.5 text-left text-base font-medium transition-all',
                  active
                    ? 'border-accent bg-accent-soft text-ink shadow-soft'
                    : 'border-border bg-surface-raised text-ink hover:border-border-strong hover:bg-nude-50 active:scale-[0.99]',
                )}
              >
                {tt(`quiz.${key}.options.${option}` as Parameters<typeof tt>[0])}
                <span
                  aria-hidden
                  className={clsx(
                    'grid size-6 place-items-center rounded-full border-2 transition-colors',
                    active ? 'border-accent bg-accent text-white' : 'border-border-strong',
                  )}
                >
                  {active && <Check className="size-3.5" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
