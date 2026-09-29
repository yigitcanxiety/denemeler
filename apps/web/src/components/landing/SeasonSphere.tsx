'use client';

import type { SeasonFamily } from '@tonelle/shared';
import clsx from 'clsx';
import { useRef, type CSSProperties } from 'react';
import { GlassSphere } from '@/components/lab/GlassSphere';
import { HeatFace } from '@/components/lab/HeatFace';
import { AccentCircle, PaletteBar, SegmentedProgress } from '@/components/lab/primitives';
import { useScrollSteps } from '@/components/motion/useScrollProgress';
import { HEAT_SEASONS } from '@/lib/heat';

const FAMILIES: SeasonFamily[] = ['spring', 'summer', 'autumn', 'winter'];

/**
 * Dark section: a glass sphere holds the heat-map face, which recolours through the four
 * season-family palettes as you scroll; a side panel swaps its mono title and body.
 * Colour changes are opacity crossfades between pre-rendered layers (no layout work).
 */
export function SeasonSphere({
  eyebrow,
  title,
  steps,
  progressLabel,
}: {
  eyebrow: string;
  title: string;
  steps: { title: string; body: string }[];
  progressLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const step = useScrollSteps(ref, FAMILIES.length);

  return (
    <section
      ref={ref}
      aria-labelledby="sphere-title"
      data-header-theme="night"
      className="theme-night relative h-[400svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cgrid">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <span className="hline top-[22%]" />
          <span className="hline top-[78%]" />
          <span className="absolute top-[30%] left-[-10%] h-px w-[70%] origin-left rotate-[22deg] bg-accent/70" />
          <span className="absolute right-[-10%] bottom-[20%] h-px w-[60%] origin-right rotate-[22deg] bg-accent/70" />
        </div>
        <AccentCircle className="top-1/2 left-1/2 w-[150vw] -translate-x-1/2 -translate-y-1/2 lg:w-[92vw]" />

        <div className="shell relative flex h-full flex-col pt-[84px] pb-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-6 lg:pt-[96px]">
          <div className="lg:col-span-4 lg:self-stretch lg:pt-6">
            <p className="mono-caps text-ink-muted">{eyebrow}</p>
            <h2 id="sphere-title" className="mt-2 text-[clamp(1.7rem,5.6vw,3.4rem)] text-ink">
              {title}
            </h2>
          </div>

          <div className="relative mx-auto my-4 w-[min(78vw,46svh,560px)] shrink-0 lg:col-span-4 lg:my-0 lg:w-full">
            <GlassSphere
              badge={
                <span className="font-mono text-[10px] text-ink-muted tabular-nums sm:text-[12px]">
                  {String(step + 1).padStart(2, '0')}/04
                </span>
              }
            >
              {FAMILIES.map((family, i) => (
                <div
                  key={family}
                  aria-hidden
                  className={clsx(
                    'absolute inset-0 transition-opacity duration-700 motion-reduce:duration-150',
                    i === step ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <HeatFace id={`sphere-${family}`} palette={HEAT_SEASONS[family]} tone="night" showBody={false} className="size-full" animated={i === step} />
                </div>
              ))}
            </GlassSphere>
          </div>

          <div className="relative mt-auto lg:col-span-4 lg:mt-0">
            <ol className="grid">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  aria-current={i === step ? 'step' : undefined}
                  className={clsx(
                    'col-start-1 row-start-1 border border-line-strong bg-paper-raised/80 p-5 backdrop-blur-sm transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transform-none motion-reduce:duration-150 lg:p-6',
                    i === step ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                  )}
                  style={{ '--i': i } as CSSProperties}
                >
                  <span aria-hidden className="grid size-7 place-items-center bg-ink">
                    <span className="size-3 rounded-full bg-night" />
                  </span>
                  <h3 className="mono mt-5 text-[14px] font-medium text-ink lg:mt-16">{s.title}</h3>
                  <p className="mono mt-3 text-ink-muted">{s.body}</p>
                  <PaletteBar colors={[...HEAT_SEASONS[FAMILIES[i] ?? 'spring']].reverse()} height="h-2.5" className="mt-5 rounded-[4px]" />
                </li>
              ))}
            </ol>
            <SegmentedProgress value={step + 1} max={4} segments={24} label={progressLabel} className="mt-4 h-2.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
