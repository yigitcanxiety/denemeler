'use client';

import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { QUIZ_KEYS, QUIZ_OPTIONS } from '../machine';
import type { StepProps } from '../types';
import { StepBar, delay } from '../ui';

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'QUIZ_BACK' })}
          aria-label={tt('common.back')}
          className="press -ml-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-mist"
        >
          <ChevronLeft aria-hidden className="size-6" strokeWidth={1.75} />
        </button>
        <StepBar current={current} total={total} label={`${copy.quizLabel}: ${tt('common.stepOf', { current, total })}`} className="flex-1" />
        <button
          type="button"
          onClick={() => dispatch({ type: 'SKIP_QUIZ' })}
          className="press h-11 rounded-pill px-3 text-[14px] font-semibold text-muted hover:bg-mist hover:text-ink"
        >
          {tt('common.skip')}
        </button>
      </div>

      <section key={key} className="enter flex flex-col gap-3">
        {state.quizIndex === 0 && <p className="caps text-violet">{tt('quiz.title')}</p>}
        <h1 ref={headingRef} tabIndex={-1} className="text-[clamp(1.7rem,7vw,2.2rem)] text-ink outline-none">
          {tt(`quiz.${key}.question`)}
        </h1>
        <p className="text-[14.5px] text-muted">{tt(`quiz.${key}.hint`)}</p>

        <div role="radiogroup" aria-label={tt(`quiz.${key}.question`)} className="mt-3 flex flex-col gap-2.5">
          {QUIZ_OPTIONS[key].map((option, i) => {
            const active = selected === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => dispatch({ type: 'ANSWER', key, value: option })}
                className={clsx(
                  'press enter flex min-h-14 items-center justify-between gap-3 rounded-card px-4 text-left text-[15px] font-semibold ring-[1.5px] ring-inset',
                  active ? 'bg-violet-soft text-ink ring-violet' : 'bg-paper text-ink ring-line hover:ring-violet/40',
                )}
                style={delay(60 + i * 40)}
              >
                {tt(`quiz.${key}.options.${option}` as Parameters<typeof tt>[0])}
                <span
                  aria-hidden
                  className={clsx(
                    'size-5 shrink-0 rounded-full transition-[border-width,border-color]',
                    active ? 'border-[6px] border-violet' : 'border-[1.5px] border-[#CFC8E6]',
                  )}
                />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
