'use client';

import type { TranslationKey } from '@tonelle/shared';
import clsx from 'clsx';
import { Check, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sunburst } from '@/components/lab/Sunburst';
import { AccentTag, SegmentedProgress } from '@/components/lab/primitives';
import { Counter } from '@/components/landing/Preloader';
import type { StepProps } from '../types';
import { Eyebrow, delay } from '../ui';

const MESSAGES: TranslationKey[] = [
  'analyzing.stepFace',
  'analyzing.stepUndertone',
  'analyzing.stepContrast',
  'analyzing.stepSeason',
  'analyzing.stepPalette',
  'analyzing.stepLooks',
];

/** Time constant of the counter: it approaches (never reaches) 100% until the result arrives. */
const TAU_MS = 1500;

export function ScanningStep({ state, copy, tt }: StepProps) {
  const [index, setIndex] = useState(0);
  const [slow, setSlow] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const rotate = window.setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 1100);
    const slowTimer = window.setTimeout(() => setSlow(true), 14000);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setPercent(Math.min(99, 99 * (1 - Math.exp(-(now - start) / TAU_MS))));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      window.clearInterval(rotate);
      window.clearTimeout(slowTimer);
      cancelAnimationFrame(frame);
    };
  }, []);

  const message = MESSAGES[index] ?? MESSAGES[0]!;
  const labels = [
    { text: tt('results.undertoneTitle'), angle: 0 },
    { text: tt('results.contrastTitle'), angle: 90 },
    { text: tt('results.skinDepthTitle'), angle: 180 },
    { text: tt('results.faceShapeTitle'), angle: 270 },
  ];

  return (
    <div className="flex flex-col gap-[10px]" aria-busy="true">
      <section className="enter ink-card neck-top p-6" style={delay(40)}>
        <Eyebrow n="04">{copy.scanningLabel}</Eyebrow>
        <h1 className="mt-4 text-[clamp(1.9rem,8.4vw,2.5rem)] text-ink-inverse">{tt('analyzing.title')}</h1>
      </section>

      {/* Sunburst wrapped around the user's photo */}
      <div role="img" aria-label={copy.scanningLabel} className="relative mx-auto w-full max-w-[440px] overflow-x-clip px-6 py-6 sm:px-10">
        <Sunburst labels={labels} inner={46} lines={84} enter="play" rotateSides labelClassName="text-[9.5px] sm:text-[11px]">
          <div className="relative size-full overflow-hidden rounded-full bg-paper-sunken ring-1 ring-line-strong">
            {state.photo && (
              // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL
              <img src={state.photo} alt="" className="size-full object-cover" />
            )}
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,transparent_40%,rgb(22_16_16/0.35))]" />
            <div aria-hidden className="absolute inset-0">
              <div className="scanline h-full w-full">
                <div className="h-px w-full bg-accent" />
                <div className="h-12 w-full bg-gradient-to-b from-accent/25 to-transparent" />
              </div>
            </div>
          </div>
        </Sunburst>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AccentTag blink>{copy.analyzingTag}</AccentTag>
        </div>
      </div>

      <section className="enter ink-card p-6" style={delay(120)}>
        <div className="flex items-end justify-between gap-4">
          <p aria-hidden className="text-[clamp(3.4rem,17vw,4.6rem)] leading-[0.85] font-light tracking-[-0.05em] text-ink-inverse">
            <Counter value={percent} className="font-light" />
          </p>
          <SegmentedProgress value={Math.round(percent)} max={100} segments={16} label={copy.scanningLabel} className="mb-1 h-9 w-[46%]" />
        </div>
        <ol className="mt-6 grid gap-2 border-t border-white/10 pt-5" aria-live="polite">
          {MESSAGES.map((key, i) => (
            <li
              key={key}
              className={clsx(
                'mono flex items-center gap-2.5 transition-opacity',
                i < index ? 'text-ink-inverse-muted' : i === index ? 'text-ink-inverse' : 'text-ink-inverse-muted opacity-35',
              )}
              aria-current={i === index ? 'step' : undefined}
            >
              <span aria-hidden className="grid size-4 shrink-0 place-items-center">
                {i < index ? (
                  <Check className="size-3.5 text-accent-soft" strokeWidth={2.5} />
                ) : i === index ? (
                  <span className="blink size-2 bg-accent" />
                ) : (
                  <span className="size-1.5 bg-white/30" />
                )}
              </span>
              {tt(key)}
            </li>
          ))}
        </ol>
        <p className="sr-only" role="status">
          {tt(message)}
        </p>
        {slow && <p className="mono mt-4 text-ink-inverse-muted">{tt('analyzing.slow')}</p>}
      </section>

      <p className="mono mt-3 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-ink-muted">
        <ShieldCheck aria-hidden className="size-4 shrink-0 text-success" />
        {tt('analyzing.privacy')}
      </p>
    </div>
  );
}
