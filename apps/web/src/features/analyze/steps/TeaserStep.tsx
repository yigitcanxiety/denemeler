'use client';

import { LOOKS, SEASONS, localized } from '@tonelle/shared';
import { Check, Lock, Sparkles } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import type { StepProps } from '../types';

export function TeaserStep({ locale, state, dispatch, copy, tt }: StepProps) {
  const result = state.result;
  if (!result) return null;
  const { analysis, recommendedLookIds } = result;
  const season = SEASONS[analysis.season];
  const includes = [
    tt('teaser.includesSeason'),
    tt('teaser.includesPalette'),
    tt('teaser.includesShades'),
    tt('teaser.includesLooks'),
    tt('teaser.includesSteps'),
  ];

  return (
    <div className="tonelle-enter">
      <p className="text-sm font-semibold text-accent">{tt('teaser.title')}</p>
      <h1 className="mt-1 text-3xl text-ink sm:text-4xl">{tt('teaser.subtitle', { count: recommendedLookIds.length })}</h1>

      <Card className="mt-6 overflow-hidden" padding="none">
        <div
          className="p-6"
          style={{
            background: `linear-gradient(135deg, ${season.palette[0]}33, ${season.palette[3]}44 60%, ${season.palette[6]}33)`,
          }}
        >
          <p className="text-xs font-semibold tracking-widest text-ink-muted uppercase">{tt('teaser.seasonLocked')}</p>
          <p className="mt-1 font-display text-4xl text-ink">{localized(season.name, locale)}</p>
          <p className="mt-1 text-sm text-ink-muted">
            {tt('results.undertoneTitle')}: {tt(`results.undertone.${analysis.undertone}`)}
          </p>
        </div>
        <div className="border-t border-border/70 p-6">
          <p className="text-sm font-semibold text-ink">{tt('teaser.paletteLocked')}</p>
          <div className="relative mt-3">
            <div aria-hidden className="flex flex-wrap gap-2.5 blur-[6px] select-none">
              {analysis.bestColors.map((c) => (
                <span key={c} className="size-11 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="absolute inset-0 grid place-items-center">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-raised/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft">
                <Lock aria-hidden className="size-3.5" />
                {copy.teaserHidden}
              </span>
            </span>
          </div>
        </div>
      </Card>

      <h2 className="mt-8 font-sans text-sm font-semibold text-ink">{tt('teaser.looksLocked')}</h2>
      <ul className="mt-3 grid grid-cols-3 gap-2.5">
        {recommendedLookIds.map((id, i) => (
          <li key={id} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-sunken">
            <div
              aria-hidden
              className="absolute inset-0 scale-110 blur-md"
              style={{
                background: `radial-gradient(circle at 50% 35%, ${analysis.lip[i % analysis.lip.length]}, ${analysis.blush[0]} 45%, ${analysis.eyeshadow[i % analysis.eyeshadow.length]} 100%)`,
              }}
            />
            <span className="absolute inset-0 grid place-items-center">
              <Lock aria-hidden className="size-5 text-white drop-shadow" />
            </span>
            <span className="sr-only">{localized(LOOKS[id].name, locale)}</span>
          </li>
        ))}
      </ul>

      <Card tone="sunken" padding="md" className="mt-8">
        <h2 className="font-sans text-base font-semibold text-ink">{tt('teaser.includesTitle')}</h2>
        <ul className="mt-3 space-y-2">
          {includes.map((item) => (
            <li key={item} className="flex gap-2 text-[0.95rem] text-ink">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {analysis.qualityIssues.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
          {analysis.qualityIssues.map((issue) => (
            <li key={issue}>• {tt(`camera.qualityIssues.${issue}`)}</li>
          ))}
        </ul>
      )}

      <div className="sticky bottom-4 mt-8">
        <Button
          size="lg"
          fullWidth
          className="shadow-lift"
          onClick={() => dispatch({ type: 'OPEN_PAYWALL' })}
          icon={<Sparkles aria-hidden className="size-5" />}
        >
          {tt('teaser.unlock')}
        </Button>
      </div>
    </div>
  );
}
