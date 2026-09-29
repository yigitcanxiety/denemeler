'use client';

import clsx from 'clsx';
import { Check, EyeOff, Lock, Smartphone, Sparkles } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { Button, Card } from '@/components/ui';
import type { StepProps } from '../types';

function Checkbox({
  checked,
  onChange,
  children,
  invalid,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
  invalid: boolean;
}) {
  const id = useId();
  return (
    <div
      className={clsx(
        'flex gap-3 rounded-2xl border p-4 transition-colors',
        checked ? 'border-accent bg-accent-soft/50' : invalid ? 'border-danger/60 bg-surface-raised' : 'border-border bg-surface-raised',
      )}
    >
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={invalid && !checked ? true : undefined}
          className="peer size-6 cursor-pointer appearance-none rounded-md border-2 border-border-strong bg-surface-raised transition-colors checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        />
        <Check aria-hidden className="pointer-events-none absolute size-4 text-white opacity-0 peer-checked:opacity-100" />
      </span>
      <label htmlFor={id} className="cursor-pointer text-[0.95rem] leading-snug text-ink">
        {children}
      </label>
    </div>
  );
}

export function ConsentStep({ locale, state, dispatch, copy, tt }: StepProps) {
  const points = [
    { icon: Sparkles, text: tt('consent.pointProcessing') },
    { icon: EyeOff, text: tt('consent.pointNoStorage') },
    { icon: Smartphone, text: tt('consent.pointOnDevice') },
    { icon: Lock, text: tt('consent.pointNoScoring') },
  ];
  const [before, after] = copy.consentTermsCheckbox.split('{terms}');
  const legalLink = (path: string, label: string) => (
    <a
      href={`/${locale}/${path}`}
      target="_blank"
      rel="noopener"
      className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
    >
      {label}
    </a>
  );
  const showHint = state.consentAttempted && !(state.consent.explicit && state.consent.terms);

  return (
    <div className="tonelle-enter">
      <h1 className="text-3xl text-ink sm:text-4xl">{tt('consent.title')}</h1>
      <p className="mt-3 text-ink-muted">{tt('consent.intro')}</p>

      <ul className="mt-6 space-y-3">
        {points.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon aria-hidden className="size-4" />
            </span>
            <span className="pt-1">{text}</span>
          </li>
        ))}
      </ul>

      <fieldset className="mt-8 space-y-3">
        <legend className="sr-only">{tt('consent.title')}</legend>
        <Checkbox
          checked={state.consent.explicit}
          invalid={state.consentAttempted}
          onChange={(value) => dispatch({ type: 'SET_CONSENT', field: 'explicit', value })}
        >
          {tt('consent.explicitConsentCheckbox')}
        </Checkbox>
        <Checkbox
          checked={state.consent.terms}
          invalid={state.consentAttempted}
          onChange={(value) => dispatch({ type: 'SET_CONSENT', field: 'terms', value })}
        >
          {before}
          {legalLink('terms', copy.consentTermsLink)}
          {after}
        </Checkbox>
      </fieldset>

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {legalLink('consent', tt('consent.readConsent'))}
        {legalLink('kvkk', tt('consent.readKvkk'))}
        {legalLink('privacy', tt('consent.readPrivacy'))}
      </p>

      <div aria-live="polite" className="min-h-6">
        {showHint && <p className="mt-4 text-sm font-medium text-danger">{tt('consent.requiredHint')}</p>}
      </div>

      {state.consentDeclined && (
        <Card tone="sunken" padding="sm" className="mt-4" role="status">
          <p className="font-semibold text-ink">{tt('consent.declinedTitle')}</p>
          <p className="mt-1 text-sm text-ink-muted">{tt('consent.declinedBody')}</p>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-2">
        <Button
          size="lg"
          fullWidth
          onClick={() => dispatch({ type: 'ACCEPT_CONSENT' })}
          aria-disabled={!(state.consent.explicit && state.consent.terms)}
          className={clsx(!(state.consent.explicit && state.consent.terms) && 'opacity-60')}
        >
          {tt('consent.accept')}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => dispatch({ type: 'DECLINE_CONSENT' })}>
          {tt('consent.decline')}
        </Button>
      </div>
    </div>
  );
}
