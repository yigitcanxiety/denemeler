'use client';

import { SKIN_CONCERNS, SKIN_LEVELS } from '@tonelle/shared';
import clsx from 'clsx';
import { Moon, RefreshCw, Sparkles, Sun } from 'lucide-react';
import { Button, ButtonLink, delay } from '@/components/ui';
import type { StepProps } from '../types';
import { Panel } from './ResultsStep';

/** Results of the skincare-only analysis (`/analyze/skin`). */
export function SkinResultsStep({ locale, state, dispatch, copy, tt }: StepProps) {
  const skin = state.skin?.skin;
  if (!skin) return null;
  const c = copy.skin;

  const routine = [
    { icon: Sun, title: c.morning, steps: skin.routine.morning },
    { icon: Moon, title: c.evening, steps: skin.routine.evening },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[clamp(1.8rem,7vw,2.4rem)] text-ink">{c.title}</h1>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <section className="rounded-panel bg-[linear-gradient(160deg,#F8E4D8,#EFD8E6_60%,#E6E0FA)] p-5 sm:p-6">
            <span className="caps rounded-pill bg-paper/80 px-2.5 py-1 text-ink">{c.skinTypeTitle}</span>
            <h2 className="mt-3 text-[clamp(2rem,8.6vw,2.6rem)] leading-none text-ink">{tt(`quiz.skinType.options.${skin.skinType}`)}</h2>
            <p className="mt-3 text-[14.5px] text-ink/80">{skin.summary}</p>
          </section>

          <Panel title={c.concernsTitle}>
            <ul className="flex flex-col gap-3">
              {SKIN_CONCERNS.map((concern, i) => {
                const level = skin.concerns[concern];
                const filled = SKIN_LEVELS.indexOf(level) + 1;
                return (
                  <li key={concern} className="enter flex items-center justify-between gap-3" style={delay(40 + i * 40)}>
                    <span className="text-[14.5px] text-ink">{c.concerns[concern]}</span>
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className="flex gap-1">
                        {SKIN_LEVELS.map((l, n) => (
                          <i key={l} className={clsx('block h-2 w-6 rounded-pill', n < filled ? 'bg-violet' : 'bg-mist')} />
                        ))}
                      </span>
                      <span className="w-14 text-right text-[13px] font-semibold text-violet">{c.levels[level]}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title={c.routineTitle}>
            <div className="grid gap-5 sm:grid-cols-2">
              {routine.map(({ icon: Icon, title, steps }) => (
                <div key={title}>
                  <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink" style={{ fontFamily: 'var(--font-sans)' }}>
                    <Icon aria-hidden className="size-4 text-violet" strokeWidth={1.75} />
                    {title}
                  </h3>
                  <ol className="mt-2.5 flex flex-col gap-2">
                    {steps.map((step, n) => (
                      <li key={step} className="flex gap-2.5 text-[14px] text-ink">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet-soft text-[11px] font-bold text-violet">{n + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title={c.ingredientsTitle}>
            <ul className="flex flex-wrap gap-2">
              {skin.ingredients.map((name) => (
                <li key={name} className="rounded-pill bg-mist px-3 py-1.5 text-[13.5px] text-ink">
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-[12px] text-muted">{c.disclaimer}</p>
          </Panel>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row">
        <Button variant="secondary" onClick={() => dispatch({ type: 'START_OVER' })} icon={<RefreshCw aria-hidden className="size-4" />}>
          {c.startOver}
        </Button>
        <ButtonLink variant="ghost" href={`/${locale}/analyze`} icon={<Sparkles aria-hidden className="size-4" />}>
          {c.fullAnalysis}
        </ButtonLink>
      </div>
    </div>
  );
}
