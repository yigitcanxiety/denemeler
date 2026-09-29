'use client';

import { SEASONS, localized } from '@tonelle/shared';
import { Contrast, Droplet, LockKeyhole, RefreshCw, ScanFace, Sun, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui';
import { getPlanDisplays } from '@/lib/pricing-display';
import type { StepProps } from '../types';
import { Note, RingPhoto, StepBar } from '../ui';

/** Number of result cards revealed after unlocking (season, undertone, contrast, face shape, skin colour, palette). */
const RESULT_COUNT = 6;

/** Locked result (DESIGN §3.5): the result exists but stays blurred until the paywall. */
export function TeaserStep({ locale, state, dispatch, copy, tt }: StepProps) {
  const yearly = useMemo(() => getPlanDisplays(locale).find((p) => p.id === 'yearly'), [locale]);
  const result = state.result;
  if (!result) return null;
  const { analysis } = result;
  const seasonName = localized(SEASONS[analysis.season].name, locale);
  const trialDays = yearly?.plan.trialDays;

  const locked = [
    { icon: Sun, label: tt('results.undertoneTitle') },
    { icon: Contrast, label: tt('results.contrastTitle') },
    { icon: ScanFace, label: tt('results.faceShapeTitle') },
    { icon: Droplet, label: copy.lockedSkinColor },
  ];

  const legal = (path: string, label: string) => (
    <a href={`/${locale}/${path}`} target="_blank" rel="noopener" className="underline-offset-2 hover:text-ink hover:underline">
      {label}
    </a>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <StepBar current={1} total={RESULT_COUNT} label={copy.lockedProgress.replace('{current}', '1').replace('{total}', String(RESULT_COUNT))} className="flex-1" />
        <Link
          href={`/${locale}`}
          aria-label={copy.lockedClose}
          className="press grid size-11 shrink-0 place-items-center rounded-full bg-mist text-muted hover:bg-violet-soft hover:text-ink"
        >
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <RingPhoto src={state.photo} alt={copy.photoFrameLabel} size={112} className="mt-2" />
        <p className="mt-3 text-[14px] text-muted">{copy.lockedSeasonLabel}</p>
        <h1 className="relative">
          <span aria-hidden className="block text-[clamp(1.9rem,8vw,2.4rem)] text-ink blur-[9px] select-none">
            {seasonName}
          </span>
          <span className="sr-only">
            {copy.lockedSeasonLabel}: {copy.teaserHidden}
          </span>
        </h1>
        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN_PAYWALL' })}
          className="press violet-gradient mt-1 inline-flex h-12 items-center gap-2 rounded-[16px] px-6 text-[15px] font-semibold text-white shadow-violet"
        >
          <LockKeyhole aria-hidden className="size-4" strokeWidth={2} />
          {copy.lockedUnlock}
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {locked.map(({ icon: Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-2.5 rounded-card bg-paper px-3 py-5 text-center ring-1 ring-line ring-inset">
            <span className="grid size-9 place-items-center rounded-full bg-mist text-violet">
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
            </span>
            <span className="text-[13.5px] font-semibold text-ink">{label}</span>
            <span aria-hidden className="block h-2 w-4/5 rounded-full bg-violet-soft" />
            <span className="sr-only">{copy.teaserHidden}</span>
          </li>
        ))}
      </ul>

      {analysis.qualityIssues.length > 0 && (
        <div className="flex flex-col gap-2">
          {analysis.qualityIssues.map((issue) => (
            <Note key={issue} tone="warning">
              {tt(`camera.qualityIssues.${issue}`)}
            </Note>
          ))}
          <Button variant="secondary" fullWidth onClick={() => dispatch({ type: 'NEW_SELFIE' })} icon={<RefreshCw aria-hidden className="size-4" />}>
            {tt('camera.retake')}
          </Button>
        </div>
      )}

      <div className="sticky bottom-3 z-10 flex flex-col gap-2 rounded-panel bg-paper/90 pt-2 backdrop-blur">
        <Button size="lg" fullWidth onClick={() => dispatch({ type: 'OPEN_PAYWALL' })}>
          {trialDays ? copy.lockedTrialCta.replace('{days}', String(trialDays)) : copy.lockedCta}
          <span aria-hidden>✦</span>
        </Button>
        {yearly && trialDays ? <p className="text-center text-[12px] text-muted">{copy.lockedFine.replace('{price}', yearly.price)}</p> : null}
        <p className="flex justify-center gap-2 text-center text-[12px] text-muted">
          {legal('privacy', tt('legal.privacy'))}
          <span aria-hidden>·</span>
          {legal('terms', tt('legal.terms'))}
        </p>
      </div>
    </div>
  );
}
