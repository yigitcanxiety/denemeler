'use client';

import clsx from 'clsx';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useScrollSteps } from '@/components/motion/useScrollProgress';
import { AccentCircle, ConnectorBar, NumberTag, SegmentedProgress } from '@/components/lab/primitives';
import { PhoneFrame } from './PhoneFrame';

/**
 * Sticky scroll story: a pinned phone whose screen changes selfie → scan → season → look.
 * Desktop: numbered annotation cards left/right, linked to the phone by accent lines that
 * draw in for the active step. Mobile: a full-width sticky stage with stacked annotations
 * crossfading beneath. Every step's text is in the DOM (crawlers, screen readers).
 */
export function Story({
  title,
  subtitle,
  steps,
  screens,
  progressLabel,
}: {
  title: string;
  subtitle: string;
  steps: { title: string; body: string }[];
  screens: ReactNode[];
  progressLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const step = useScrollSteps(ref, steps.length);
  const total = steps.length;

  return (
    <section id="how" ref={ref} aria-labelledby="how-title" className="relative h-[400svh] border-t border-line-strong">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cgrid">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <span className="hline top-[32%] hidden lg:block" />
          <span className="hline top-[70%] hidden lg:block" />
        </div>
        <AccentCircle className="top-1/2 left-1/2 w-[125vw] -translate-x-1/2 -translate-y-1/2 lg:w-[62vw]" />
        <AccentCircle tone="line" className="top-1/2 left-[4%] hidden w-[26vw] -translate-y-1/2 lg:block" />
        <AccentCircle tone="line" className="top-1/2 right-[4%] hidden w-[26vw] -translate-y-1/2 lg:block" />

        <div className="shell relative flex h-full flex-col pt-[84px] pb-[92px] lg:pt-[108px] lg:pb-[100px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mono-caps text-ink-muted">
                /{String(step + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
              </p>
              <h2 id="how-title" className="mt-2 text-[clamp(1.6rem,5.4vw,3rem)] text-ink">
                {title}
              </h2>
            </div>
            <p className="mono hidden max-w-[28ch] text-right text-ink-muted sm:block">{subtitle}</p>
          </div>

          <div className="relative mt-4 flex min-h-0 flex-1 flex-col items-center lg:mt-2 lg:justify-center">
            {/* Phone */}
            <div className="relative flex h-full min-h-[240px] w-full justify-center rounded-card bg-paper-raised/70 py-4 ring-1 ring-line-strong ring-inset lg:bg-transparent lg:py-0 lg:ring-0">
              <PhoneFrame className="h-full max-h-[470px] lg:max-h-[min(64svh,620px)]">
                {screens.map((screen, i) => (
                  <div
                    key={i}
                    aria-hidden={i !== step}
                    className={clsx(
                      'absolute inset-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transform-none motion-reduce:duration-150',
                      i === step ? 'opacity-100' : 'translate-y-[3%] opacity-0',
                    )}
                  >
                    {screen}
                  </div>
                ))}
              </PhoneFrame>
              <span aria-hidden className="mono-caps absolute top-4 left-4 text-ink-muted lg:hidden">
                {String(step + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Desktop annotation cards */}
            <ol className="pointer-events-none absolute inset-0 hidden lg:block">
              {steps.map((s, i) => {
                const left = i % 2 === 0;
                const active = i === step;
                const top = i < 2 ? '12%' : '56%';
                return (
                  <li
                    key={s.title}
                    className={clsx(
                      'absolute w-[min(26vw,340px)] transition-opacity duration-500',
                      active ? 'opacity-100' : 'opacity-40',
                    )}
                    style={{ top, [left ? 'right' : 'left']: 'calc(50% + min(18vw, 200px))' } as CSSProperties}
                  >
                    <div className={clsx('relative border bg-paper/80 p-5 transition-colors duration-500', active ? 'border-accent' : 'border-line-strong')}>
                      <NumberTag n={i + 1} tone={active ? 'ink' : 'ink'} />
                      <h3 className="mt-6 text-[1.35rem] leading-none text-ink">{s.title}</h3>
                      <p className="mono mt-3 text-ink-muted">{s.body}</p>
                      {/* line to the phone */}
                      <span
                        aria-hidden
                        className={clsx(
                          'absolute top-6 h-px w-[min(8vw,120px)] bg-accent transition-transform duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
                          left ? 'left-full origin-left' : 'right-full origin-right',
                          active ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </div>
                    <div
                      className={clsx(
                        'absolute top-[13px] w-[30vw] transition-opacity duration-500',
                        left ? 'right-full' : 'left-full',
                        active ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      <ConnectorBar from={left ? 'left' : 'right'} enter="none" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Mobile / tablet: stacked crossfading annotations */}
          <div className="relative mt-4 lg:hidden">
            <SegmentedProgress value={step + 1} max={total} segments={total * 6} label={progressLabel} tone="light" className="h-2.5" />
            <ol className="relative mt-4 grid">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  aria-current={i === step ? 'step' : undefined}
                  className={clsx(
                    'col-start-1 row-start-1 flex gap-3 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transform-none motion-reduce:duration-150',
                    i === step ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                  )}
                >
                  <NumberTag n={i + 1} />
                  <div>
                    <h3 className="text-[1.25rem] leading-none text-ink">{s.title}</h3>
                    <p className="mono mt-2 text-ink-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
