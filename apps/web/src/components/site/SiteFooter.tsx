import { t, type Locale } from '@tonelle/shared';
import Link from 'next/link';
import { COMPANY } from '@/config/company';
import type { SiteContent } from '@/content';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
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

  return (
    <footer className="mt-auto border-t border-border bg-surface-sunken/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">{content.footer.tagline}</p>
          <StoreBadges labels={content.stores} />
        </div>
        <nav aria-labelledby="footer-product">
          <h2 id="footer-product" className="font-sans text-xs font-semibold tracking-widest text-ink-subtle uppercase">
            {content.footer.productTitle}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {product.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-ink hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-legal">
          <h2 id="footer-legal" className="font-sans text-xs font-semibold tracking-widest text-ink-subtle uppercase">
            {content.footer.legalTitle}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {legalLinks(locale).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-ink hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-sans text-xs font-semibold tracking-widest text-ink-subtle uppercase">
            {content.footer.companyTitle}
          </h2>
          <address className="mt-4 space-y-1.5 text-sm text-ink-muted not-italic">
            <p className="font-semibold text-ink">{COMPANY.legalName}</p>
            <p>{COMPANY.address}</p>
            <p>
              {content.footer.registration} {COMPANY.registrationNumber}
            </p>
            <p>
              <a href={`mailto:${COMPANY.supportEmail}`} className="hover:text-ink hover:underline">
                {COMPANY.supportEmail}
              </a>
            </p>
          </address>
          <LanguageSwitcher locale={locale} className="mt-5 -ml-1" />
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t(locale, 'legal.copyright', { year })}</p>
          <p>{t(locale, 'legal.aiDisclosure')}</p>
        </div>
      </div>
    </footer>
  );
}
