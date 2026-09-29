'use client';

import clsx from 'clsx';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SegmentedProgress } from '@/components/lab/primitives';
import { QUIZ_KEYS, QUIZ_OPTIONS } from '../machine';
import type { StepProps } from '../types';
import { RoundButton, delay } from '../ui';

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
    <div className="flex flex-col gap-[10px]">
      {/* Progress card: back · QUESTION 02/05 · skip, then |||||||| */}
      <div className="ink-card neck-top px-3 pt-3 pb-4">
        <div className="flex items-center justify-between gap-2">
          <RoundButton tone="glass" label={tt('common.back')} onClick={() => dispatch({ type: 'QUIZ_BACK' })}>
            <ArrowLeft aria-hidden className="size-4" />
          </RoundButton>
          <p className="mono-caps text-ink-inverse-muted">
            {copy.quizLabel}{' '}
            <span className="text-ink-inverse tabular-nums">
              {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
          </p>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SKIP_QUIZ' })}
            className="press mono-caps h-11 rounded-pill px-4 text-ink-inverse-muted hover:bg-white/10 hover:text-ink-inverse"
          >
            {tt('common.skip')}
          </button>
        </div>
        <SegmentedProgress
          value={current}
          max={total}
          segments={20}
          label={`${copy.quizLabel}: ${tt('common.stepOf', { current, total })}`}
          className="mt-3 px-2"
        />
      </div>

      <section key={key} className="enter ink-card neck-top p-6" style={delay(60)}>
        {state.quizIndex === 0 && <p className="mono-caps text-accent-soft">{tt('quiz.title')}</p>}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className={clsx('text-[clamp(1.9rem,8.4vw,2.5rem)] text-ink-inverse outline-none', state.quizIndex === 0 && 'mt-3')}
        >
          {tt(`quiz.${key}.question`)}
        </h1>
        <p className="mono mt-3 text-ink-inverse-muted">{tt(`quiz.${key}.hint`)}</p>

        <div role="radiogroup" aria-label={tt(`quiz.${key}.question`)} className="mt-7 grid gap-2">
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
                  'press enter flex min-h-14 items-center justify-between gap-3 rounded-pill pr-2.5 pl-5 text-left text-[1.02rem] font-medium',
                  active ? 'bg-accent-soft text-[#231816]' : 'bg-paper-raised text-[#231816] hover:bg-white',
                )}
                style={delay(120 + i * 40)}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden className="mono w-5 text-[11px] text-[#9A8C86]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {tt(`quiz.${key}.options.${option}` as Parameters<typeof tt>[0])}
                </span>
                <span
                  aria-hidden
                  className={clsx(
                    'grid size-9 shrink-0 place-items-center rounded-full transition-colors',
                    active ? 'bg-[#231816] text-accent-soft' : 'ring-1 ring-[#231816]/15 ring-inset',
                  )}
                >
                  {active && <Check className="size-4" strokeWidth={2.5} />}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
