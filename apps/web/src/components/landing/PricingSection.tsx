import { t, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PriceNumeral } from '@/components/lab/PriceNumeral';
import { Chip, ConstructionGrid } from '@/components/lab/primitives';
import type { SiteContent } from '@/content';
import { getPlanDisplays } from '@/lib/pricing-display';

/** Pricing as BRIK stacked dark cards (joined by necks) with big light numerals. */
export function PricingSection({ locale, content }: { locale: Locale; content: SiteContent }) {
  const plans = getPlanDisplays(locale);
  const features = [
    t(locale, 'paywall.featureSeason'),
    t(locale, 'paywall.featurePalette'),
    t(locale, 'paywall.featureShades'),
    t(locale, 'paywall.featureLooks'),
    t(locale, 'paywall.featureGuides'),
  ];

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative overflow-hidden border-t border-line-strong py-20 sm:py-28">
      <ConstructionGrid />
      <div className="shell relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="pricing-title" className="text-[clamp(2.4rem,8vw,5.2rem)] text-ink lg:col-span-7" data-reveal>
            {content.pricing.title}
          </h2>
          <p className="mono max-w-[44ch] text-ink-muted lg:col-span-4 lg:col-start-9" data-reveal style={{ '--d': '100ms' } as CSSProperties}>
            {content.pricing.subtitle}
          </p>
        </div>

        <ul className="mt-12 flex flex-col gap-[10px] lg:grid lg:grid-cols-3">
          {plans.map((plan, i) => (
            <li
              key={plan.id}
              className={clsx(
                'ink-card flex flex-col p-6 sm:p-7',
                i > 0 && 'neck-top lg:neck-left',
                plan.highlighted && 'shadow-[inset_0_0_0_2px_var(--color-accent-soft)]',
              )}
              data-reveal
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="mono-caps text-ink-inverse-muted">{plan.name}</h3>
                {plan.badge && (
                  <Chip tone="soft">
                    {plan.badge}
                    {plan.savings ? ` · ${plan.savings}` : ''}
                  </Chip>
                )}
              </div>
              <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <PriceNumeral
                  amount={plan.plan.introAmount ?? plan.plan.amount}
                  currency={plan.plan.currency}
                  locale={locale}
                  className="text-[clamp(3.2rem,13vw,5.4rem)] text-ink-inverse lg:text-[clamp(3rem,4.6vw,5rem)]"
                />
                {plan.introPrice && <s className="mono text-ink-inverse-muted">{plan.price}</s>}
              </p>
              <p className="mt-4 text-[1.05rem] leading-snug font-medium">{plan.headline}</p>
              {plan.subline && <p className="mono mt-1 text-ink-inverse-muted">{plan.subline}</p>}
              {plan.highlighted && (
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
                  {features.map((f) => (
                    <li key={f} className="mono flex gap-2.5 text-ink-inverse">
                      <span aria-hidden className="mt-[5px] size-1.5 shrink-0 bg-accent-soft" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-7">
                <Link
                  href={`/${locale}/analyze`}
                  className={clsx(
                    'press flex h-12 w-full items-center justify-between rounded-pill px-5 font-medium',
                    plan.highlighted ? 'bg-accent-soft text-[#231816] hover:bg-white' : 'text-ink-inverse ring-1 ring-white/25 hover:bg-white/10',
                  )}
                >
                  {content.pricing.cta}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className="mono mt-8 max-w-3xl text-[12px] text-ink-muted">{content.pricing.note}</p>
      </div>
    </section>
  );
}
