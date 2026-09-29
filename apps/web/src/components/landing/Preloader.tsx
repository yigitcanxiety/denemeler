'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { HeatFace } from '@/components/lab/HeatFace';
import { Sunburst } from '@/components/lab/Sunburst';

const DURATION = 2000;
const LEAVE_MS = 650;
const SESSION_KEY = 'tonelle.preloaded';

const noopSubscribe = () => () => undefined;

/** Leading zeros dimmed, like the reference counter (`001%`). */
export function Counter({ value, className }: { value: number; className?: string }) {
  const s = String(Math.round(value)).padStart(3, '0');
  const lead = s.match(/^0*(?=\d)/)?.[0] ?? '';
  return (
    <span className={clsx('font-sans font-medium tabular-nums', className)}>
      <span className="opacity-40">{lead}</span>
      {s.slice(lead.length)}%
    </span>
  );
}

/**
 * First-visit-per-session preloader (≤ 2.2 s, skippable). Whether it plays is decided by an
 * inline script before first paint (`html[data-preload]`), which also skips it for reduced
 * motion, bots and headless browsers. The real page is rendered underneath the whole time.
 */
export function Preloader({ seasons, label, skip }: { seasons: string[]; label: string; skip: string }) {
  const active = useSyncExternalStore(
    noopSubscribe,
    () => document.documentElement.hasAttribute('data-preload'),
    () => true,
  );
  const [phase, setPhase] = useState<'run' | 'leaving' | 'done'>('run');
  const [count, setCount] = useState(0);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage blocked: the preloader simply plays again next time */
    }
    document.documentElement.removeAttribute('data-preload');
    setCount(100);
    setPhase('leaving');
    window.setTimeout(() => setPhase('done'), LEAVE_MS);
  };

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setCount(Math.round((1 - (1 - t) ** 2.2) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  if (!active || phase === 'done') return null;

  const labels = seasons.map((text, i) => ({ text, angle: i * 90 }));

  return (
    <div
      className="preloader fixed inset-0 z-[65] items-center justify-center overflow-hidden bg-paper"
      data-leaving={phase === 'leaving' ? '' : undefined}
      onClick={finish}
      role="presentation"
    >
      <p className="sr-only" role="status">
        {label}
      </p>
      <div className="preloader-stage relative w-[min(88vw,560px)]">
        <Sunburst labels={labels} inner={30} enter="play" labelClassName="text-[10px] sm:text-[12px]">
          <div className="preloader-core grid size-full place-items-center rounded-full">
            <HeatFace id="pre-face" showBody={false} className="h-[88%] w-auto" />
          </div>
        </Sunburst>
      </div>
      <div aria-hidden className="absolute bottom-4 left-4 rounded-[14px] bg-ink px-4 py-3 text-[22px] leading-none text-ink-inverse sm:bottom-6 sm:left-6 sm:text-[28px]">
        <Counter value={count} />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="press mono absolute right-4 bottom-4 flex h-11 items-center gap-2 rounded-[12px] px-4 text-ink ring-1 ring-line-strong hover:bg-paper-raised sm:right-6 sm:bottom-6"
      >
        {skip} <span aria-hidden>→</span>
      </button>
    </div>
  );
}
