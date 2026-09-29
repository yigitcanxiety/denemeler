'use client';

import { ArrowRight } from 'lucide-react';
import { NumberTag } from '@/components/lab/primitives';
import { Button } from '@/components/ui';
import type { StepProps } from '../types';
import { DarkCheckbox, Eyebrow, Note, delay } from '../ui';

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
      className="text-accent-soft underline decoration-accent-soft/50 underline-offset-[3px] hover:decoration-accent-soft"
    >
      {label}
    </a>
  );
  const ready = state.consent.explicit && state.consent.terms;
  const showHint = state.consentAttempted && !ready;

  return (
    <div className="flex flex-col gap-[10px]">
      <section className="enter ink-card neck-top p-6" style={delay(40)}>
        <Eyebrow n="01">KVKK · GDPR</Eyebrow>
        <h1 className="mt-5 text-[clamp(2rem,9vw,2.6rem)] text-ink-inverse">{tt('consent.title')}</h1>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-inverse-muted">{tt('consent.intro')}</p>
        <ol className="mt-6 grid gap-3 border-t border-white/10 pt-5">
          {points.map((text, i) => (
            <li key={text} className="flex gap-3">
              <NumberTag n={i + 1} tone="light" className="size-6 text-[11px]" />
              <span className="mono pt-[3px] text-ink-inverse">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <fieldset className="enter ink-card neck-top space-y-2.5 p-4 sm:p-5" style={delay(120)}>
        <legend className="sr-only">{tt('consent.title')}</legend>
        <DarkCheckbox
          checked={state.consent.explicit}
          invalid={state.consentAttempted}
          onChange={(value) => dispatch({ type: 'SET_CONSENT', field: 'explicit', value })}
        >
          {tt('consent.explicitConsentCheckbox')}
        </DarkCheckbox>
        <DarkCheckbox
          checked={state.consent.terms}
          invalid={state.consentAttempted}
          onChange={(value) => dispatch({ type: 'SET_CONSENT', field: 'terms', value })}
        >
          {before}
          {legalLink('terms', copy.consentTermsLink)}
          {after}
        </DarkCheckbox>
        <p className="mono flex flex-wrap gap-x-4 gap-y-2 px-1 pt-2 text-[12px]">
          {legalLink('consent', tt('consent.readConsent'))}
          {legalLink('kvkk', tt('consent.readKvkk'))}
          {legalLink('privacy', tt('consent.readPrivacy'))}
        </p>
      </fieldset>

      <div aria-live="polite">
        {showHint && (
          <Note tone="danger" className="mt-1">
            {tt('consent.requiredHint')}
          </Note>
        )}
      </div>

      {state.consentDeclined && (
        <div role="status" className="rounded-card bg-paper-raised p-5">
          <p className="font-semibold text-ink">{tt('consent.declinedTitle')}</p>
          <p className="mt-1 text-sm text-ink-muted">{tt('consent.declinedBody')}</p>
        </div>
      )}

      <div className="enter mt-2 flex flex-col gap-1.5" style={delay(200)}>
        <Button
          size="lg"
          fullWidth
          onClick={() => dispatch({ type: 'ACCEPT_CONSENT' })}
          aria-disabled={!ready}
          className={ready ? 'justify-between' : 'justify-between opacity-55'}
        >
          {tt('consent.accept')}
          <ArrowRight aria-hidden className="size-5" />
        </Button>
        <Button variant="ghost" fullWidth onClick={() => dispatch({ type: 'DECLINE_CONSENT' })}>
          {tt('consent.decline')}
        </Button>
      </div>
    </div>
  );
}
