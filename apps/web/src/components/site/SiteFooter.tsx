import { t, type Locale } from '@tonelle/shared';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AccentCircle, ConstructionGrid } from '@/components/lab/primitives';
import { GiantWordmark } from '@/components/lab/GiantWordmark';
import { COMPANY } from '@/config/company';
import type { SiteContent } from '@/content';
import { LanguageSwitcher } from './LanguageSwitcher';
import { StoreBadges } from './StoreBadges';

export function legalLinks(locale: Locale) {
  return [
    { href: `/${locale}/privacy`, label: t(locale, 'legal.privacy') },
    { href: `/${locale}/kvkk`, label: t(locale, 'legal.kvkk') },
    { href: `/${locale}/consent`, label: t(locale, 'legal.consent') },
    { href: `/${locale}/terms`, label: t(locale, 'legal.terms') },
    { href: `/${locale}/contact`, label: t(locale, 'legal.contact') },
  ];
}

export function SiteFooter({ locale, content }: { locale: Locale; content: SiteContent }) {
  const home = `/${locale}`;
  const product = [
    { href: `/${locale}/analyze`, label: t(locale, 'common.startAnalysis') },
    { href: `${home}#how`, label: content.nav.howItWorks },
    { href: `${home}#looks`, label: content.nav.looks },
    { href: `${home}#pricing`, label: content.nav.pricing },
    { href: `${home}#faq`, label: content.nav.faq },
  ];
  const year = new Date().getFullYear();
  const colTitle = 'mono-caps text-ink-muted';
  const linkClass = 'mono inline-flex min-h-8 items-center text-ink hover:text-accent hover:underline';

  return (
    <footer id="site-footer" className="relative mt-auto overflow-hidden border-t border-line-strong">
      <ConstructionGrid enter="none" />
      <AccentCircle className="top-[18%] left-1/2 w-[140vw] -translate-x-1/2 md:w-[90vw]" enter="scroll" />

      <div className="shell relative pt-16 pb-6 sm:pt-24">
        <section aria-labelledby="final-cta-title" className="max-w-3xl" data-reveal>
          <h2 id="final-cta-title" className="text-[clamp(2.4rem,8vw,5.5rem)] text-ink">
            {content.finalCta.title}
          </h2>
          <p className="mono mt-5 max-w-md text-ink-muted">{content.finalCta.body}</p>
          <Link
            href={`/${locale}/analyze`}
            className="press mt-8 inline-flex h-14 items-center gap-3 rounded-pill bg-ink pr-3 pl-6 text-base font-medium text-ink-inverse hover:bg-ink-soft"
          >
            {content.finalCta.button}
            <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-contrast">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </Link>
        </section>

        <div className="mt-16 grid gap-10 border-t border-line-strong pt-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div className="space-y-4">
            <p className="mono max-w-xs text-ink-muted">{content.footer.tagline}</p>
            <StoreBadges labels={content.stores} />
            <LanguageSwitcher locale={locale} compact />
          </div>
          <nav aria-labelledby="footer-product">
            <h2 id="footer-product" className={colTitle}>
              {content.footer.productTitle}
            </h2>
            <ul className="mt-3">
              {product.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className={colTitle}>
              {content.footer.legalTitle}
            </h2>
            <ul className="mt-3">
              {legalLinks(locale).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={colTitle}>{content.footer.companyTitle}</h2>
            <address className="mono mt-3 space-y-1.5 text-ink-muted not-italic">
              <p className="text-ink">{COMPANY.legalName}</p>
              <p>{COMPANY.address}</p>
              <p>
                {content.footer.registration} {COMPANY.registrationNumber}
              </p>
              <p>
                <a href={`mailto:${COMPANY.supportEmail}`} className="text-ink hover:text-accent hover:underline">
                  {COMPANY.supportEmail}
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className="relative px-2 sm:px-4">
        <GiantWordmark enter="scroll" />
      </div>
      <div className="shell relative flex flex-col gap-1 border-t border-line-strong py-5 pb-8 sm:flex-row sm:justify-between">
        <p className="mono text-[12px] text-ink-muted">{t(locale, 'legal.copyright', { year })}</p>
        <p className="mono text-[12px] text-ink-muted">{t(locale, 'legal.aiDisclosure')}</p>
      </div>
    </footer>
  );
}
