'use client';

import { PRODUCT_IDS, type PlanId } from '@tonelle/shared';
import clsx from 'clsx';
import { BellRing, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { StoreBadge } from '@/components/site/StoreBadges';
import { Button, Modal, buttonClasses } from '@/components/ui';
import { COMPANY } from '@/config/company';
import { apiClient } from '@/lib/api-client';
import { paymentProvider, type PaymentProvider, type StoreLink } from '@/lib/payments';
import { getExitOfferDisplay, getPlanDisplays } from '@/lib/pricing-display';
import { getAppUserId } from '@/lib/storage';
import type { StepProps, StoreCopy } from '../types';
import { delay } from '../ui';

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
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const redeem = async () => {
    if (!code.trim()) return;
    setRedeeming(true);
    const res = await apiClient.redeem(code);
    setRedeeming(false);
    if (res.ok) dispatch({ type: 'UNLOCK' });
    else setCodeError(true);
  };
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: 'DISMISS_PAYWALL' })}
          aria-label={copy.paywallClose}
          className="press -ml-1 grid size-11 place-items-center rounded-full bg-mist text-muted hover:bg-violet-soft hover:text-ink"
        >
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
        <span className="caps rounded-pill bg-violet-soft px-3 py-1.5 text-[#5a3fe0]">Premium</span>
      </div>

      <div>
        <h1 className="text-[clamp(1.75rem,7.2vw,2.2rem)] text-ink">{tt('paywall.title')}</h1>
        <p className="mt-2 text-[14.5px] text-muted">{tt('paywall.subtitle')}</p>
        <ul className="mt-5 flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[14px] text-ink">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet-soft text-violet">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div role="radiogroup" aria-label={copy.paywallPlansLabel} className="mt-2 flex flex-col gap-3">
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
                'press enter relative flex w-full items-center gap-3 rounded-card px-4 py-4 text-left ring-[1.5px] ring-inset',
                active ? 'bg-violet-soft ring-violet' : 'bg-paper ring-line hover:ring-violet/40',
              )}
              style={delay(60 + i * 50)}
            >
              {p.badge && (
                <span className="absolute -top-2.5 right-4 rounded-pill bg-violet px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {p.badge}
                  {p.savings ? ` · ${p.savings}` : ''}
                </span>
              )}
              <span
                aria-hidden
                className={clsx('size-5 shrink-0 rounded-full', active ? 'border-[6px] border-violet bg-paper' : 'border-[1.5px] border-[#CFC8E6]')}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink">{p.name}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{p.headline}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="serif block text-[1.5rem] leading-none text-ink">{p.introPrice ?? p.price}</span>
                {p.introPrice && <s className="mt-1 block text-[11.5px] text-muted">{p.price}</s>}
                {!p.introPrice && p.subline && p.id === 'yearly' && <span className="mt-1 block text-[11px] text-muted">{p.subline}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-3 z-10 mt-1 rounded-panel bg-paper/90 pt-2 backdrop-blur">
        <Button size="lg" fullWidth loading={pending} onClick={() => void buy(selected)}>
          {plan.cta}
        </Button>
        {plan.plan.autoRenews && <p className="mt-2 text-center text-[12px] text-muted">{tt('paywall.cancelAnytime')}</p>}
      </div>
      <p className="-mt-2 text-center text-[12px] text-muted">{tt('paywall.webNotice')}</p>

      <form
        className="rounded-card border border-line p-4"
        onSubmit={(e) => {
          e.preventDefault();
          void redeem();
        }}
      >
        <label htmlFor="invite-code" className="text-[13.5px] font-semibold text-ink">
          {copy.inviteLabel}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="invite-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCodeError(false);
            }}
            autoComplete="off"
            autoCapitalize="characters"
            aria-invalid={codeError}
            aria-describedby={codeError ? 'invite-error' : undefined}
            className="h-11 min-w-0 flex-1 rounded-pill border border-line bg-paper px-4 text-[15px] text-ink uppercase outline-none focus:border-violet"
          />
          <Button type="submit" variant="secondary" loading={redeeming}>
            {copy.inviteCta}
          </Button>
        </div>
        {codeError && (
          <p id="invite-error" role="alert" className="mt-2 text-[12.5px] text-rose-700">
            {copy.inviteError}
          </p>
        )}
      </form>

      {demoAllowed && (
        <div className="rounded-card border border-dashed border-violet/40 p-4 text-center">
          <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'UNLOCK' })}>
            {copy.demoUnlock}
          </Button>
          <p className="mt-2 text-[11.5px] text-muted">{copy.demoNote}</p>
        </div>
      )}

      <p className="text-[11.5px] leading-relaxed text-muted">{plan.legal}</p>
      <p className="flex flex-wrap gap-x-4 text-[12px] text-muted">
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
        tone="lavender"
      >
        <div>
          <p className="serif text-[5.5rem] leading-none text-violet">{locale === 'tr' ? `%${exitOffer.percent}` : `${exitOffer.percent}%`}</p>
          <p className="mt-4 text-[14.5px] text-ink">{exitOffer.body}</p>
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
        <p className="text-[14.5px] text-muted">{copy.chooseStoreBody}</p>
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
        <p className="text-[14.5px] text-muted">{copy.comingSoonBody}</p>
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
