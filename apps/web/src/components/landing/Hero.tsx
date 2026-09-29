import { SEASONS, localized, t, type Locale } from '@tonelle/shared';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { StoreBadges } from '@/components/site/StoreBadges';
import { ButtonLink } from '@/components/ui';
import type { SiteContent } from '@/content';
import { BeforeAfter } from './BeforeAfter';

export function Hero({ locale, content }: { locale: Locale; content: SiteContent }) {
  const season = SEASONS.soft_autumn;
  const { hero } = content;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#fae6e6,transparent)] opacity-80"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="tonelle-enter text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-pill border border-blush-200 bg-surface-raised/70 px-3.5 py-1.5 text-sm font-medium text-accent-hover">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-5 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl lg:text-[4.1rem]">
            {hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted lg:mx-0">{hero.subtitle}</p>

          <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            <ButtonLink
              href={`/${locale}/analyze`}
              size="lg"
              className="w-full max-w-sm sm:w-auto"
              icon={<ArrowRight aria-hidden className="order-last size-5" />}
            >
              {hero.cta}
            </ButtonLink>
            <p className="text-sm text-ink-muted">{hero.ctaNote}</p>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink lg:justify-start">
            {hero.trustPoints.map((point, i) => (
              <li key={point} className="inline-flex items-center gap-1.5">
                {i === 0 ? (
                  <ShieldCheck aria-hidden className="size-4 text-success" />
                ) : (
                  <Check aria-hidden className="size-4 text-accent" />
                )}
                {point}
              </li>
            ))}
          </ul>

          <StoreBadges labels={content.stores} className="mt-8 justify-center lg:justify-start" />
        </div>

        <div className="relative mx-auto w-full max-w-[26rem]">
          <BeforeAfter
            beforeLabel={t(locale, 'look.before')}
            afterLabel={t(locale, 'look.after')}
            aiLabel={t(locale, 'common.aiGenerated')}
            description={hero.illustrationLabel}
          />
          {/* Floating result card */}
          <div
            aria-hidden
            className="tonelle-float absolute -bottom-6 -left-3 w-52 rounded-2xl border border-border/70 bg-surface-raised/95 p-3.5 shadow-lift backdrop-blur sm:-left-10"
          >
            <p className="text-[0.7rem] font-medium tracking-wide text-ink-muted uppercase">
              {t(locale, 'results.yourSeason')}
            </p>
            <p className="font-display text-lg text-ink">{localized(season.name, locale)}</p>
            <div className="mt-2 flex gap-1">
              {season.palette.slice(0, 6).map((c) => (
                <span key={c} className="size-5 rounded-full ring-1 ring-black/5" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div
            aria-hidden
            className="absolute top-16 -right-2 rounded-2xl border border-border/70 bg-surface-raised/95 px-3.5 py-2.5 shadow-card sm:-right-8"
          >
            <p className="text-[0.7rem] text-ink-muted">{t(locale, 'results.undertoneTitle')}</p>
            <p className="text-sm font-semibold text-ink">
              {t(locale, 'results.undertone.warm')} · {t(locale, 'results.undertone.olive')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
