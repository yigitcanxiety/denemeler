import type { Locale } from '@tonelle/shared';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { GiantWordmark } from '@/components/lab/GiantWordmark';
import { HeatFace } from '@/components/lab/HeatFace';
import { AccentCircle, AccentTag, ConnectorBar, ConstructionGrid, NumberTag } from '@/components/lab/primitives';
import type { SiteContent } from '@/content';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** The hero object: line-art face with breathing heat-map makeup, crosshair, scan line and tag. */
export function HeroObject({ label, tag, className }: { label: string; tag: string; className?: string }) {
  return (
    <figure role="img" aria-label={label} className={className}>
      <div className="relative aspect-square w-full">
        <svg aria-hidden viewBox="0 0 100 100" className="intro-draw absolute inset-0 size-full overflow-visible">
          <circle className="draw" cx="50" cy="50" r="49.6" fill="none" stroke="var(--color-line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} style={d(500)} />
          <circle className="draw" cx="50" cy="50" r="33" fill="none" stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} style={d(700)} />
          <path className="draw" d="M50 -6V106" stroke="var(--color-line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} style={d(600)} />
          <path className="draw" d="M-6 50H106" stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} style={d(650)} />
        </svg>
        <div
          aria-hidden
          className="intro-fade absolute inset-[3%] rounded-full"
          style={{ background: 'radial-gradient(circle at 50% 55%, rgb(243 178 122 / 0.28), rgb(224 119 94 / 0.10) 45%, transparent 70%)', ...d(300) }}
        />
        <HeatFace id="hero-face" className="intro absolute inset-x-[10%] top-[4%] h-[96%] w-[80%]" style={d(250)} />
        {/* scan line, clipped to the circle */}
        <div aria-hidden className="absolute inset-[2%] overflow-hidden rounded-full">
          <div className="scanline h-full w-full">
            <div className="h-px w-full bg-accent/70" />
            <div className="h-10 w-full bg-gradient-to-b from-accent/15 to-transparent" />
          </div>
        </div>
        <div className="intro absolute top-[43%] left-1/2 -translate-x-1/2" style={d(900)}>
          <AccentTag blink>{tag}</AccentTag>
        </div>
      </div>
    </figure>
  );
}

export function Hero({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { hero } = content;
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden pt-[76px] sm:pt-[84px]">
      <ConstructionGrid enter="intro" rows={['calc(100% - 1px)']} />

      {/* LCP: the wordmark is plain text, animated with CSS only. */}
      <div className="relative px-2 pt-2 sm:px-4 lg:pt-4">
        <GiantWordmark enter="intro" delay={120} />
      </div>
      <span aria-hidden className="hline intro-grow-x" style={d(400)} />

      <div className="shell relative grid gap-y-8 pt-6 pb-10 lg:grid-cols-12 lg:gap-x-6 lg:pt-10 lg:pb-16">
        {/* Copy */}
        <div className="relative z-10 lg:col-span-4 lg:pt-4">
          <p className="intro mono-caps flex items-center gap-2 text-ink-muted" style={d(250)}>
            <span aria-hidden className="size-1.5 bg-accent" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="intro mt-4 text-[clamp(2.1rem,7.4vw,3.6rem)] text-ink" style={d(320)}>
            {hero.title}
          </h1>
          <p className="intro mono mt-5 max-w-[40ch] text-ink-muted" style={d(420)}>
            {hero.subtitle}
          </p>
          <div className="intro mt-7 hidden flex-col items-start gap-3 lg:flex" style={d(520)}>
            <HeroCta locale={locale} label={hero.cta} />
            <p className="mono text-[12px] text-ink-muted">{hero.ctaNote}</p>
          </div>
        </div>

        {/* Object with connector bars (full-bleed on small screens) */}
        <div className="relative lg:col-span-4 lg:col-start-5">
          <div className="relative mx-auto w-[min(66vw,400px)] lg:w-full">
            <AccentCircle
              enter="intro"
              delay={350}
              className="top-1/2 left-1/2 w-[150vw] max-w-none -translate-x-1/2 -translate-y-1/2 lg:w-[88vw] lg:max-w-[1300px]"
            />
            <HeroObject label={hero.illustrationLabel} tag={hero.analyzingTag} className="relative" />
          </div>
          <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 lg:hidden" style={{ left: 'calc(50% - 50vw)', width: 'calc(50vw - min(33vw, 200px) + 2px)' }}>
            <ConnectorBar from="left" delay={700} />
          </div>
          <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 lg:hidden" style={{ right: 'calc(50% - 50vw)', width: 'calc(50vw - min(33vw, 200px) + 2px)' }}>
            <ConnectorBar from="right" delay={760} />
          </div>
        </div>

        {/* Annotations (desktop) */}
        <div className="relative hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="intro relative mt-6 border border-accent bg-paper/70 p-5" style={d(900)}>
            <NumberTag n={1} />
            <p className="mono mt-8 max-w-[34ch] text-ink">{hero.notes[0]}</p>
          </div>
          <div className="relative mt-10 -mr-10 h-[22px]">
            <ConnectorBar from="right" delay={1000} className="absolute inset-y-0 right-0 left-[-72%]" />
          </div>
          <div className="intro mt-10 p-5" style={d(1100)}>
            <NumberTag n={2} />
            <p className="mono mt-8 max-w-[34ch] text-ink">{hero.notes[1]}</p>
          </div>
        </div>

        {/* CTA (mobile / tablet) */}
        <div className="intro flex flex-col items-center gap-3 text-center lg:hidden" style={d(600)}>
          <HeroCta locale={locale} label={hero.cta} className="w-full max-w-sm justify-between" />
          <p className="mono text-[12px] text-ink-muted">{hero.ctaNote}</p>
        </div>

        <ul className="intro mono flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-ink-muted lg:col-span-12" style={d(700)}>
          {hero.trustPoints.map((p, i) => (
            <li key={p} className="flex items-center gap-2">
              <span aria-hidden className="text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div id="hero-end" aria-hidden className="h-px" />
    </section>
  );
}

function HeroCta({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  return (
    <Link
      href={`/${locale}/analyze`}
      className={`press inline-flex h-14 items-center gap-4 rounded-pill bg-ink pr-2 pl-6 text-base font-medium text-ink-inverse hover:bg-ink-soft ${className ?? ''}`}
    >
      {label}
      <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-contrast">
        <ArrowRight aria-hidden className="size-4" />
      </span>
    </Link>
  );
}
