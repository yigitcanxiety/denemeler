'use client';

import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { TranslationKey } from '@tonelle/shared';
import type { StepProps } from '../types';

const MESSAGES: TranslationKey[] = [
  'analyzing.stepFace',
  'analyzing.stepUndertone',
  'analyzing.stepContrast',
  'analyzing.stepSeason',
  'analyzing.stepPalette',
  'analyzing.stepLooks',
];

export function ScanningStep({ state, copy, tt }: StepProps) {
  const [index, setIndex] = useState(0);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const rotate = window.setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 1500);
    const slowTimer = window.setTimeout(() => setSlow(true), 14000);
    return () => {
      window.clearInterval(rotate);
      window.clearTimeout(slowTimer);
    };
  }, []);

  const message = MESSAGES[index] ?? MESSAGES[0]!;

  return (
    <div className="tonelle-enter text-center" aria-busy="true">
      <h1 className="text-3xl text-ink sm:text-4xl">{tt('analyzing.title')}</h1>
      <div
        role="img"
        aria-label={copy.scanningLabel}
        className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-card bg-surface-sunken shadow-lift"
      >
        {state.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL
          <img src={state.photo} alt="" className="size-full object-cover" />
        )}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgb(184_92_100/0.12))]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.12)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div aria-hidden className="tonelle-scanline absolute inset-x-0 h-0.5 bg-white shadow-[0_0_18px_6px_rgb(234_174_177/0.85)]" />
        <svg aria-hidden viewBox="0 0 300 375" className="absolute inset-0 size-full">
          <ellipse cx="150" cy="172" rx="92" ry="124" fill="none" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeDasharray="5 8" />
        </svg>
      </div>
      <ol className="mx-auto mt-8 max-w-xs space-y-2 text-left" aria-live="polite">
        {MESSAGES.map((key, i) => (
          <li
            key={key}
            className={
              i < index
                ? 'flex items-center gap-2 text-sm text-ink-muted'
                : i === index
                  ? 'flex items-center gap-2 text-sm font-semibold text-ink'
                  : 'sr-only'
            }
            aria-current={i === index ? 'step' : undefined}
          >
            <span
              aria-hidden
              className={
                i < index
                  ? 'size-2 rounded-full bg-success'
                  : 'size-2 animate-pulse rounded-full bg-accent'
              }
            />
            {tt(key)}
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">
        {tt(message)}
      </p>
      {slow && <p className="mt-4 text-sm text-ink-muted">{tt('analyzing.slow')}</p>}
      <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
        <ShieldCheck aria-hidden className="size-4 text-success" />
        {tt('analyzing.privacy')}
      </p>
    </div>
  );
}
