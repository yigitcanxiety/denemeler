import { t, type Locale } from '@tonelle/shared';
import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui';
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
    { href: `${home}#try-on`, label: content.nav.looks },
    { href: `${home}#pricing`, label: content.nav.pricing },
    { href: `${home}#faq`, label: content.nav.faq },
  ];
  const year = new Date().getFullYear();
  const colTitle = 'caps text-muted';
  const linkClass = 'inline-flex min-h-9 items-center text-[14px] text-ink hover:text-violet hover:underline';

  return (
    <footer id="site-footer" className="mt-auto">
      <div className="shell">
        <section
          aria-labelledby="final-cta-title"
          className="relative grid overflow-hidden rounded-xl bg-board sm:grid-cols-[1.2fr_1fr]"
          data-reveal
        >
          <div className="relative z-10 flex flex-col items-start gap-5 p-7 sm:p-12">
            <Eyebrow tone="paper">Tonelle</Eyebrow>
            <h2 id="final-cta-title" className="max-w-[16ch] text-[clamp(2rem,6vw,3.2rem)] text-ink">
              {content.finalCta.title}
            </h2>
            <p className="max-w-md text-muted">{content.finalCta.body}</p>
            <Link
              href={`/${locale}/analyze`}
              className="press inline-flex h-[52px] items-center gap-2 rounded-pill bg-violet px-6 text-[15px] font-semibold text-white shadow-violet hover:bg-[#6446ec]"
            >
              <span aria-hidden>✦</span>
              {content.finalCta.button}
            </Link>
          </div>
          <div className="relative hidden min-h-[320px] sm:block">
            <Image src="/images/portrait-2.jpg" alt="" fill sizes="(min-width: 640px) 40vw, 1px" className="object-cover object-top" />
            <div aria-hidden className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-board to-transparent" />
          </div>
        </section>
      </div>

      <div className="shell mt-16 grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo className="text-[2rem]" />
          <p className="max-w-xs text-[14px] text-muted">{content.footer.tagline}</p>
          <StoreBadges labels={content.stores} />
          <LanguageSwitcher locale={locale} compact />
        </div>
        <nav aria-labelledby="footer-product">
          <h2 id="footer-product" className={colTitle} style={{ fontFamily: 'var(--font-sans)' }}>
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
          <h2 id="footer-legal" className={colTitle} style={{ fontFamily: 'var(--font-sans)' }}>
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
          <h2 className={colTitle} style={{ fontFamily: 'var(--font-sans)' }}>
            {content.footer.companyTitle}
          </h2>
          <address className="mt-3 space-y-1.5 text-[14px] text-muted not-italic">
            <p className="font-semibold text-ink">{COMPANY.legalName}</p>
            <p>{COMPANY.address}</p>
            <p>
              {content.footer.registration} {COMPANY.registrationNumber}
            </p>
            <p>
              <a href={`mailto:${COMPANY.supportEmail}`} className="text-ink hover:text-violet hover:underline">
                {COMPANY.supportEmail}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="shell mt-10 flex flex-col gap-1 border-t border-line py-6 pb-24 sm:flex-row sm:justify-between lg:pb-8">
        <p className="text-[12.5px] text-muted">{t(locale, 'legal.copyright', { year })}</p>
        <p className="text-[12.5px] text-muted">{t(locale, 'legal.aiDisclosure')}</p>
      </div>
    </footer>
  );
}
