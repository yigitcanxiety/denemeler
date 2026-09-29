'use client';

import { PRODUCT_IDS, type PlanId } from '@tonelle/shared';
import clsx from 'clsx';
import { BellRing, Check, Gift, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StoreBadge } from '@/components/site/StoreBadges';
import { Button, Modal } from '@/components/ui';
import { COMPANY } from '@/config/company';
import { paymentProvider, type PaymentProvider, type StoreLink } from '@/lib/payments';
import { getExitOfferDisplay, getPlanDisplays } from '@/lib/pricing-display';
import { getAppUserId } from '@/lib/storage';
import type { StepProps, StoreCopy } from '../types';

type Sheet = { kind: 'none' } | { kind: 'stores'; links: StoreLink[] } | { kind: 'soon' } | { kind: 'failed' };

export function PaywallStep({
  locale,
  state,
  dispatch,
  copy,
  tt,
  stores,
  demoAllowed,
  provider = paymentProvider,
}: StepProps & { stores: StoreCopy; demoAllowed: boolean; provider?: PaymentProvider }) {
  const plans = useMemo(() => getPlanDisplays(locale), [locale]);
  const exitOffer = useMemo(() => getExitOfferDisplay(locale), [locale]);
  const [selected, setSelected] = useState<PlanId>('yearly');
  const [pending, setPending] = useState(false);
  const [sheet, setSheet] = useState<Sheet>({ kind: 'none' });
  const plan = plans.find((p) => p.id === selected) ?? plans[0]!;

  const features = [
    tt('paywall.featureSeason'),
    tt('paywall.featurePalette'),
    tt('paywall.featureShades'),
    tt('paywall.featureLooks'),
    tt('paywall.featureGuides'),
  ];

  const buy = async (planId: PlanId, exit = false) => {
    setPending(true);
    try {
      const outcome = await provider.purchase({ plan: planId, exitOffer: exit, appUserId: getAppUserId() });
      switch (outcome.status) {
        case 'purchased':
          dispatch({ type: 'UNLOCK' });
          break;
        case 'redirect':
          if (outcome.links.length === 1 && outcome.links[0]) window.location.assign(outcome.links[0].url);
          else setSheet({ kind: 'stores', links: outcome.links });
          break;
        case 'unavailable':
          setSheet({ kind: 'soon' });
          break;
        case 'failed':
          setSheet({ kind: 'failed' });
          break;
        case 'cancelled':
          break;
      }
    } finally {
      setPending(false);
    }
  };

  const notifyHref = `mailto:${COMPANY.supportEmail}?subject=${encodeURIComponent(copy.notifySubject)}`;

  return (
    <div className="tonelle-enter relative">
      <button
        type="button"
        onClick={() => dispatch({ type: 'DISMISS_PAYWALL' })}
        aria-label={copy.paywallClose}
        className="absolute -top-2 right-0 grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
      >
        <X aria-hidden className="size-5" />
      </button>

      <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Sparkles aria-hidden className="size-6" />
      </span>
      <h1 className="mt-4 pr-10 text-3xl text-ink sm:text-4xl">{tt('paywall.title')}</h1>
      <p className="mt-2 text-ink-muted">{tt('paywall.subtitle')}</p>

      <ul className="mt-5 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5 text-[0.95rem] text-ink">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-white">
              <Check aria-hidden className="size-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div role="radiogroup" aria-label={copy.paywallPlansLabel} className="mt-7 space-y-3">
        {plans.map((p) => {
          const active = p.id === selected;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              data-product-id={PRODUCT_IDS[p.id]}
              onClick={() => setSelected(p.id)}
              className={clsx(
                'relative flex w-full items-center gap-4 rounded-2xl border-2 bg-surface-raised p-4 text-left transition-all',
                active ? 'border-accent shadow-card' : 'border-border hover:border-border-strong',
              )}
            >
              {p.badge && (
                <span className="absolute -top-2.5 right-4 rounded-pill bg-accent px-2.5 py-0.5 text-[0.7rem] font-semibold text-accent-contrast">
                  {p.badge}
                  {p.savings ? ` · ${p.savings}` : ''}
                </span>
              )}
              <span
                aria-hidden
                className={clsx(
                  'grid size-6 shrink-0 place-items-center rounded-full border-2',
                  active ? 'border-accent bg-accent text-white' : 'border-border-strong',
                )}
              >
                {active && <Check className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{p.name}</span>
                <span className="block text-sm text-ink-muted">{p.headline}</span>
              </span>
              <span className="text-right">
                <span className="block font-semibold text-ink">{p.introPrice ?? p.price}</span>
                {p.subline && p.id === 'yearly' && <span className="block text-xs text-ink-muted">{p.subline}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <Button size="lg" fullWidth className="mt-6" loading={pending} onClick={() => void buy(selected)}>
        {plan.cta}
      </Button>
      {plan.plan.autoRenews && <p className="mt-2 text-center text-sm text-ink-muted">{tt('paywall.cancelAnytime')}</p>}
      <p className="mt-3 text-center text-sm text-ink-muted">{tt('paywall.webNotice')}</p>

      {demoAllowed && (
        <div className="mt-5 rounded-2xl border border-dashed border-warning/60 p-3 text-center">
          <Button variant="soft" size="sm" onClick={() => dispatch({ type: 'UNLOCK' })}>
            {copy.demoUnlock}
          </Button>
          <p className="mt-1.5 text-xs text-ink-subtle">{copy.demoNote}</p>
        </div>
      )}

      <p className="mt-6 text-[0.7rem] leading-relaxed text-ink-subtle">{plan.legal}</p>
      <p className="mt-2 flex flex-wrap gap-x-3 text-[0.7rem] text-ink-subtle">
        <a href={`/${locale}/terms`} target="_blank" rel="noopener" className="underline">
          {tt('legal.terms')}
        </a>
        <a href={`/${locale}/privacy`} target="_blank" rel="noopener" className="underline">
          {tt('legal.privacy')}
        </a>
      </p>

      {/* Exit offer (shown once, when the user first tries to leave) */}
      <Modal
        open={state.exitOfferOpen}
        onClose={() => dispatch({ type: 'CLOSE_EXIT_OFFER' })}
        title={exitOffer.title}
        closeLabel={copy.paywallClose}
        size="sm"
      >
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
            <Gift aria-hidden className="size-7" />
          </span>
          <p className="mt-4 font-display text-5xl text-accent">{locale === 'tr' ? `%${exitOffer.percent}` : `${exitOffer.percent}%`}</p>
          <p className="mt-3 text-ink-muted">{exitOffer.body}</p>
          <Button size="lg" fullWidth className="mt-6" loading={pending} onClick={() => void buy('yearly', true)}>
            {exitOffer.cta}
          </Button>
          <Button variant="ghost" fullWidth className="mt-1" onClick={() => dispatch({ type: 'CLOSE_EXIT_OFFER' })}>
            {exitOffer.dismiss}
          </Button>
        </div>
      </Modal>

      <Modal
        open={sheet.kind === 'stores'}
        onClose={() => setSheet({ kind: 'none' })}
        title={copy.chooseStoreTitle}
        closeLabel={copy.paywallClose}
        size="sm"
      >
        <p className="text-ink-muted">{copy.chooseStoreBody}</p>
        <div className="mt-5 flex flex-col items-stretch gap-3">
          {sheet.kind === 'stores' &&
            sheet.links.map((link) => (
              <StoreBadge key={link.store} store={link.store} url={link.url} labels={stores} className="justify-center" />
            ))}
        </div>
      </Modal>

      <Modal
        open={sheet.kind === 'soon'}
        onClose={() => setSheet({ kind: 'none' })}
        title={copy.comingSoonTitle}
        closeLabel={copy.paywallClose}
        size="sm"
      >
        <p className="text-ink-muted">{copy.comingSoonBody}</p>
        <a
          href={notifyHref}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-accent font-semibold text-accent-contrast shadow-soft hover:bg-accent-hover"
        >
          <BellRing aria-hidden className="size-5" />
          {copy.notifyCta}
        </a>
      </Modal>

      <Modal
        open={sheet.kind === 'failed'}
        onClose={() => setSheet({ kind: 'none' })}
        title={tt('paywall.purchaseFailed')}
        closeLabel={copy.paywallClose}
        size="sm"
      >
        <Button fullWidth onClick={() => setSheet({ kind: 'none' })}>
          {tt('common.close')}
        </Button>
      </Modal>
    </div>
  );
}
