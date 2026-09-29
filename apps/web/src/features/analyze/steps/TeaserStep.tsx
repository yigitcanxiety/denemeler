'use client';

import { LOOKS, SEASONS, localized } from '@tonelle/shared';
import { ArrowRight, Lock } from 'lucide-react';
import { HeatFace } from '@/components/lab/HeatFace';
import { Chip, PaletteBar } from '@/components/lab/primitives';
import { Button } from '@/components/ui';
import { heatFrom } from '@/lib/heat';
import type { StepProps } from '../types';
import { Eyebrow, delay } from '../ui';

export function TeaserStep({ locale, state, dispatch, copy, tt }: StepProps) {
  const result = state.result;
  if (!result) return null;
  const { analysis, recommendedLookIds } = result;
  const season = SEASONS[analysis.season];
  const seasonName = localized(season.name, locale);
  const includes = [
    tt('teaser.includesSeason'),
    tt('teaser.includesPalette'),
    tt('teaser.includesShades'),
    tt('teaser.includesLooks'),
    tt('teaser.includesSteps'),
  ];

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Season name in giant grotesk */}
      <section className="enter ink-card neck-top relative overflow-hidden p-6 pb-7" style={delay(40)}>
        <Eyebrow n="05">{tt('teaser.title')}</Eyebrow>
        <p className="mono-caps mt-8 text-ink-inverse-muted">{tt('teaser.seasonLocked')}</p>
        <h1 className="mt-2 text-[clamp(3rem,15vw,5.2rem)] leading-[0.88] tracking-[-0.055em] text-ink-inverse [overflow-wrap:anywhere]">
          {seasonName}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip tone="soft">
            {tt('results.undertoneTitle')} · {tt(`results.undertone.${analysis.undertone}`)}
          </Chip>
        </div>
        <p className="mono mt-5 max-w-[36ch] text-ink-inverse-muted">{tt('teaser.subtitle', { count: recommendedLookIds.length })}</p>
      </section>

      {/* Palette + looks, blurred under a frosted card */}
      <section className="enter ink-card neck-top relative overflow-hidden p-6" style={delay(120)}>
        <p className="mono-caps text-ink-inverse-muted">{tt('teaser.paletteLocked')}</p>
        <div aria-hidden className="mt-4 blur-[7px] select-none">
          <PaletteBar colors={analysis.bestColors} height="h-14" />
        </div>
        <p className="mono-caps mt-7 text-ink-inverse-muted">{tt('teaser.looksLocked')}</p>
        <div className="relative mt-4">
        <ul className="grid grid-cols-3 gap-2">
          {recommendedLookIds.map((id, i) => (
            <li key={id} className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-night">
              <div aria-hidden className="absolute inset-0 scale-110 blur-[6px]">
                <HeatFace
                  id={`teaser-${i}`}
                  tone="night"
                  showBody={false}
                  animated={false}
                  palette={heatFrom([
                    analysis.lip[i % analysis.lip.length] ?? '#C8354A',
                    analysis.blush[i % analysis.blush.length] ?? '#E0775E',
                    analysis.eyeshadow[i % analysis.eyeshadow.length] ?? '#F3B27A',
                  ])}
                  className="size-full"
                />
              </div>
              <span className="sr-only">{localized(LOOKS[id].name, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-2">
          <div className="mx-auto flex max-w-[15rem] flex-col items-center gap-2 rounded-[18px] bg-white/10 px-5 py-4 text-center ring-1 ring-white/20 backdrop-blur-md">
            <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-[#231816]">
              <Lock aria-hidden className="size-4" />
            </span>
            <p className="mono text-ink-inverse">{copy.teaserHidden}</p>
          </div>
        </div>
        </div>
      </section>

      <section className="enter rounded-card bg-paper-raised p-6" style={delay(200)}>
        <h2 className="mono-caps text-ink-muted">{tt('teaser.includesTitle')}</h2>
        <ol className="mt-4 grid gap-2.5">
          {includes.map((item, i) => (
            <li key={item} className="flex gap-3 text-[0.98rem] text-ink">
              <span aria-hidden className="mono pt-[2px] text-[12px] text-ink-subtle">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </section>

      {analysis.qualityIssues.length > 0 && (
        <ul className="mono space-y-1.5 px-2 text-[12px] text-ink-muted">
          {analysis.qualityIssues.map((issue) => (
            <li key={issue}>— {tt(`camera.qualityIssues.${issue}`)}</li>
          ))}
        </ul>
      )}

      <div className="sticky bottom-3 z-10 mt-2">
        <Button size="lg" fullWidth className="justify-between shadow-lift" onClick={() => dispatch({ type: 'OPEN_PAYWALL' })}>
          {tt('teaser.unlock')}
          <ArrowRight aria-hidden className="size-5" />
        </Button>
      </div>
    </div>
  );
}
