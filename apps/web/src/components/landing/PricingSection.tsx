import { t, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading, delay } from '@/components/ui';
import type { SiteContent } from '@/content';
import { getPlanDisplays } from '@/lib/pricing-display';

/** Pricing as the app's plan cards: yearly highlighted with a badge and a big serif price. */
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
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 py-16 sm:py-24">
      <div className="shell">
        <SectionHeading id="pricing-title" eyebrow={content.pricing.eyebrow} title={content.pricing.title} lead={content.pricing.subtitle} />
        <ul className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3 lg:items-start">
          {plans.map((plan, i) => (
            <li
              key={plan.id}
              className={clsx(
                'relative flex flex-col rounded-panel p-6',
                plan.highlighted ? 'bg-violet-soft ring-[1.5px] ring-violet ring-inset' : 'bg-paper ring-[1.5px] ring-line ring-inset',
              )}
              data-reveal
              style={delay(i * 90)}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-5 rounded-pill bg-violet px-3 py-1 text-[11.5px] font-bold text-white shadow-violet">
                  {plan.badge}
                  {plan.savings ? ` · ${plan.savings}` : ''}
                </span>
              )}
              <h3 className="text-[1.35rem] text-ink">{plan.name}</h3>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="serif text-[2.6rem] leading-none text-ink">{plan.price}</span>
              </p>
              <p className="mt-3 text-[14.5px] font-semibold text-ink">{plan.headline}</p>
              {plan.subline && <p className="mt-1 text-[13.5px] text-muted">{plan.subline}</p>}
              {plan.highlighted && (
                <ul className="mt-5 flex flex-col gap-2 border-t border-violet/15 pt-5">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[14px] text-ink">
                      <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-paper text-violet">
                        <Check aria-hidden className="size-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/${locale}/analyze`}
                className={clsx(
                  'press mt-6 flex h-12 items-center justify-center rounded-pill px-5 text-[14.5px] font-semibold',
                  plan.highlighted ? 'bg-violet text-white shadow-violet hover:bg-[#6446ec]' : 'bg-paper text-violet ring-[1.5px] ring-violet-soft ring-inset hover:bg-mist',
                )}
              >
                {content.pricing.cta}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-3xl text-center text-[12.5px] text-muted">{content.pricing.note}</p>
      </div>
    </section>
  );
}
