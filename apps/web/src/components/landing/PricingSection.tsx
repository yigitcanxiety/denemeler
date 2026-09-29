import { t, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import type { SiteContent } from '@/content';
import { getPlanDisplays } from '@/lib/pricing-display';
import { Section } from './Section';

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
    <Section id="pricing" title={content.pricing.title} subtitle={content.pricing.subtitle}>
      <ul className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className={clsx(
              'relative flex flex-col rounded-card p-6 sm:p-7',
              plan.highlighted
                ? 'order-first bg-surface-raised shadow-lift ring-2 ring-accent md:order-none md:-my-3 md:py-9'
                : 'border border-border bg-surface-raised shadow-soft',
            )}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-6 rounded-pill bg-accent px-3 py-1 text-xs font-semibold text-accent-contrast shadow-soft">
                {plan.badge}
                {plan.savings ? ` · ${plan.savings}` : ''}
              </span>
            )}
            <h3 className="font-sans text-sm font-semibold tracking-wide text-ink-muted uppercase">{plan.name}</h3>
            <p className="mt-2 flex items-baseline gap-2 font-display text-4xl text-ink">
              {plan.introPrice ?? plan.price}
              {plan.introPrice && <s className="font-sans text-base text-ink-subtle">{plan.price}</s>}
            </p>
            <p className="mt-2 text-[0.95rem] font-medium text-ink">{plan.headline}</p>
            {plan.subline && <p className="mt-1 text-sm text-ink-muted">{plan.subline}</p>}
            {plan.highlighted && (
              <ul className="mt-5 space-y-2 text-sm text-ink">
                {features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto pt-6">
              <ButtonLink
                href={`/${locale}/analyze`}
                variant={plan.highlighted ? 'primary' : 'secondary'}
                fullWidth
              >
                {content.pricing.cta}
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-ink-subtle">
        {content.pricing.note}
      </p>
    </Section>
  );
}
