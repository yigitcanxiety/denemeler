'use client';

import { PRODUCT_IDS, type PlanId } from '@tonelle/shared';
import clsx from 'clsx';
import { ArrowRight, BellRing, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StoreBadge } from '@/components/site/StoreBadges';
import { Chip } from '@/components/lab/primitives';
import { Button, Modal, buttonClasses } from '@/components/ui';
import { COMPANY } from '@/config/company';
import { paymentProvider, type PaymentProvider, type StoreLink } from '@/lib/payments';
import { getExitOfferDisplay, getPlanDisplays } from '@/lib/pricing-display';
import { getAppUserId } from '@/lib/storage';
import type { StepProps, StoreCopy } from '../types';
import { Eyebrow, delay } from '../ui';

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
    <div className="flex flex-col gap-[10px]">
      <section className="enter ink-card neck-top relative p-6" style={delay(40)}>
        <button
          type="button"
          onClick={() => dispatch({ type: 'DISMISS_PAYWALL' })}
          aria-label={copy.paywallClose}
          className="press absolute top-3 right-3 grid size-11 place-items-center rounded-full text-ink-inverse-muted ring-1 ring-white/15 ring-inset hover:bg-white/10 hover:text-ink-inverse"
        >
          <X aria-hidden className="size-5" />
        </button>
        <Eyebrow n="06">Premium</Eyebrow>
        <h1 className="mt-5 pr-8 text-[clamp(1.9rem,8.4vw,2.5rem)] text-ink-inverse">{tt('paywall.title')}</h1>
        <p className="mono mt-3 text-ink-inverse-muted">{tt('paywall.subtitle')}</p>
        <ul className="mt-6 grid gap-2 border-t border-white/10 pt-5">
          {features.map((f) => (
            <li key={f} className="mono flex gap-2.5 text-ink-inverse">
              <span aria-hidden className="mt-[5px] size-1.5 shrink-0 bg-accent-soft" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      <div role="radiogroup" aria-label={copy.paywallPlansLabel} className="flex flex-col gap-[10px]">
        {plans.map((p, i) => {
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
                'press enter ink-card neck-top w-full p-5 text-left transition-shadow',
                active ? 'shadow-[inset_0_0_0_2px_var(--color-accent-soft)]' : 'hover:bg-ink-soft',
              )}
              style={delay(100 + i * 60)}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={clsx(
                      'grid size-6 shrink-0 place-items-center rounded-full',
                      active ? 'bg-accent-soft text-[#231816]' : 'ring-1 ring-white/30 ring-inset',
                    )}
                  >
                    {active && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="mono-caps text-ink-inverse">{p.name}</span>
                </span>
                {p.badge && (
                  <Chip tone="soft">
                    {p.badge}
                    {p.savings ? ` · ${p.savings}` : ''}
                  </Chip>
                )}
              </span>
              <span className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="numeral text-[clamp(2.8rem,13vw,3.6rem)] text-ink-inverse">{p.introPrice ?? p.price}</span>
                {p.introPrice && <s className="mono text-ink-inverse-muted">{p.price}</s>}
              </span>
              <span className="mt-3 block text-[0.98rem] leading-snug font-medium text-ink-inverse">{p.headline}</span>
              {p.subline && <span className="mono mt-1 block text-ink-inverse-muted">{p.subline}</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        <Button size="lg" fullWidth className="justify-between" loading={pending} onClick={() => void buy(selected)}>
          {plan.cta}
          {!pending && <ArrowRight aria-hidden className="size-5" />}
        </Button>
        {plan.plan.autoRenews && <p className="mono mt-3 text-center text-[12px] text-ink-muted">{tt('paywall.cancelAnytime')}</p>}
        <p className="mono mt-1 text-center text-[12px] text-ink-muted">{tt('paywall.webNotice')}</p>
      </div>

      {demoAllowed && (
        <div className="mt-2 rounded-card border border-dashed border-ink/30 p-4 text-center">
          <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'UNLOCK' })}>
            {copy.demoUnlock}
          </Button>
          <p className="mono mt-2 text-[11px] text-ink-muted">{copy.demoNote}</p>
        </div>
      )}

      <p className="mono mt-3 text-[11px] leading-relaxed text-ink-muted">{plan.legal}</p>
      <p className="mono flex flex-wrap gap-x-4 text-[11px] text-ink-muted">
        <a href={`/${locale}/terms`} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
          {tt('legal.terms')}
        </a>
        <a href={`/${locale}/privacy`} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
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
        tone="ink"
      >
        <div>
          <p className="numeral text-[6.5rem] text-accent-soft">{locale === 'tr' ? `%${exitOffer.percent}` : `${exitOffer.percent}%`}</p>
          <p className="mono mt-4 text-ink-inverse-muted">{exitOffer.body}</p>
          <Button variant="soft" size="lg" fullWidth className="mt-6" loading={pending} onClick={() => void buy('yearly', true)}>
            {exitOffer.cta}
          </Button>
          <Button variant="ghost" fullWidth className="mt-1 text-ink-inverse-muted hover:bg-white/10 hover:text-ink-inverse" onClick={() => dispatch({ type: 'CLOSE_EXIT_OFFER' })}>
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
        <p className="mono text-ink-muted">{copy.chooseStoreBody}</p>
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
        <p className="mono text-ink-muted">{copy.comingSoonBody}</p>
        <a href={notifyHref} className={clsx(buttonClasses({ size: 'lg', fullWidth: true }), 'mt-6')}>
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
