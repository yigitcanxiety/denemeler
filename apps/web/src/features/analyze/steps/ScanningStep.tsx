'use client';

import type { TranslationKey } from '@tonelle/shared';
import clsx from 'clsx';
import { Check, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Eyebrow, ProgressRing } from '@/components/ui';
import type { StepProps } from '../types';

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

/** Face-mesh dots and lines over the photo (decorative). */
function FaceMesh() {
  const pts: [number, number][] = [
    [50, 22],
    [34, 40],
    [66, 40],
    [28, 55],
    [72, 55],
    [50, 52],
    [40, 66],
    [60, 66],
    [50, 80],
  ];
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full">
      <g fill="none" stroke="rgb(255 255 255 / 0.6)" strokeWidth="0.4">
        <path d="M34 40 50 22 66 40 72 55 60 66 50 80 40 66 28 55Z" />
        <path d="M34 40 50 52 66 40M40 66 50 52 60 66M28 55 50 52 72 55" />
      </g>
      {pts.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#fff" />
      ))}
    </svg>
  );
}

export function ScanningStep({ locale, state, copy, tt }: StepProps) {
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
  const shown = Math.round(percent);

  return (
    <div className="flex flex-col items-center gap-6 text-center" aria-busy="true">
      <Eyebrow>{copy.scanningChip}</Eyebrow>
      <h1 className="-mt-2 text-[clamp(1.7rem,7vw,2.2rem)] text-ink">{copy.scanningTitle}</h1>

      <ProgressRing value={percent} size={248} stroke={3.2} label={copy.scanningLabel}>
        <div className="absolute inset-[14px] overflow-hidden rounded-full bg-mist">
          {state.photo && (
            // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL
            <img src={state.photo} alt="" className="size-full object-cover" />
          )}
          <FaceMesh />
          <div aria-hidden className="scan-band" />
        </div>
      </ProgressRing>

      <p aria-hidden className="serif text-[3rem] leading-none text-ink tabular-nums">
        {locale === 'tr' ? `%${shown}` : `${shown}%`}
      </p>

      <ol className="flex w-full max-w-xs flex-col gap-2.5 text-left" aria-live="polite">
        {MESSAGES.map((key, i) => (
          <li
            key={key}
            className={clsx(
              'flex items-center gap-2.5 text-[14px] transition-colors',
              i < index ? 'text-ink' : i === index ? 'font-semibold text-violet' : 'text-muted',
            )}
            aria-current={i === index ? 'step' : undefined}
          >
            <span
              aria-hidden
              className={clsx(
                'grid size-5 shrink-0 place-items-center rounded-full',
                i < index ? 'bg-violet text-white' : i === index ? 'bg-violet-soft' : 'bg-mist',
              )}
            >
              {i < index ? <Check className="size-3" strokeWidth={3} /> : i === index ? <span className="pulse size-2 rounded-full bg-violet" /> : null}
            </span>
            {tt(key)}
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">
        {tt(message)}
      </p>
      {slow && <p className="text-[13.5px] text-muted">{tt('analyzing.slow')}</p>}

      <p className="flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted">
        <ShieldCheck aria-hidden className="size-4 shrink-0 text-mint-ink" strokeWidth={1.75} />
        {tt('analyzing.privacy')}
      </p>
    </div>
  );
}
