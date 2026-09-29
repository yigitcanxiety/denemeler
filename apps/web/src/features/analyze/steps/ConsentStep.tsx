'use client';

import { Check, ShieldCheck } from 'lucide-react';
import { Button, Eyebrow } from '@/components/ui';
import type { StepProps } from '../types';
import { CheckRow, Note } from '../ui';

export function ConsentStep({ locale, state, dispatch, copy, tt }: StepProps) {
  const points = [
    tt('consent.pointProcessing'),
    tt('consent.pointNoStorage'),
    tt('consent.pointOnDevice'),
    tt('consent.pointNoScoring'),
  ];
  const [before, after] = copy.consentTermsCheckbox.split('{terms}');
  const legalLink = (path: string, label: string) => (
    <a
      href={`/${locale}/${path}`}
      target="_blank"
      rel="noopener"
      className="font-semibold text-violet underline decoration-violet/40 underline-offset-[3px] hover:decoration-violet"
    >
      {label}
    </a>
  );
  const ready = state.consent.explicit && state.consent.terms;
  const showHint = state.consentAttempted && !ready;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start gap-4">
        <Eyebrow>KVKK · GDPR</Eyebrow>
        <h1 className="text-[clamp(1.8rem,7.4vw,2.3rem)] text-ink">{tt('consent.title')}</h1>
        <p className="text-[15px] text-muted">{tt('consent.intro')}</p>
      </div>

      <ul className="flex flex-col gap-2.5 rounded-card bg-mist p-4">
        {points.map((text) => (
          <li key={text} className="flex gap-3 text-[14px] text-ink">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-violet-soft text-violet">
              <Check aria-hidden className="size-3" strokeWidth={3} />
            </span>
            {text}
          </li>
        ))}
      </ul>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">{tt('consent.title')}</legend>
        <CheckRow
          checked={state.consent.explicit}
          invalid={state.consentAttempted}
          onChange={(value) => dispatch({ type: 'SET_CONSENT', field: 'explicit', value })}
        >
          {tt('consent.explicitConsentCheckbox')}
        </CheckRow>
        <CheckRow
          checked={state.consent.terms}
          invalid={state.consentAttempted}
          onChange={(value) => dispatch({ type: 'SET_CONSENT', field: 'terms', value })}
        >
          {before}
          {legalLink('terms', copy.consentTermsLink)}
          {after}
        </CheckRow>
        <p className="flex flex-wrap gap-x-4 gap-y-1 px-1 pt-1 text-[13px]">
          {legalLink('consent', tt('consent.readConsent'))}
          {legalLink('kvkk', tt('consent.readKvkk'))}
          {legalLink('privacy', tt('consent.readPrivacy'))}
        </p>
      </fieldset>

      <div aria-live="polite">
        {showHint && (
          <Note tone="danger">
            {tt('consent.requiredHint')}
          </Note>
        )}
      </div>

      {state.consentDeclined && (
        <div role="status" className="rounded-card bg-mist p-5">
          <p className="font-semibold text-ink">{tt('consent.declinedTitle')}</p>
          <p className="mt-1 text-[14px] text-muted">{tt('consent.declinedBody')}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Button
          size="lg"
          fullWidth
          onClick={() => dispatch({ type: 'ACCEPT_CONSENT' })}
          aria-disabled={!ready}
          className={ready ? undefined : 'opacity-55 shadow-none'}
        >
          {tt('consent.accept')}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => dispatch({ type: 'DECLINE_CONSENT' })}>
          {tt('consent.decline')}
        </Button>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted">
        <ShieldCheck aria-hidden className="size-4 shrink-0 text-mint-ink" strokeWidth={1.75} />
        {tt('common.privacyBadge')}
      </p>
    </div>
  );
}
