import { t, type CoreLocale } from '@tonelle/shared';
import Link from 'next/link';
import { COMPANY } from '@/config/company';
import type { SiteContent } from '@/content';

/** Every legal page, used by the legal documents' "other documents" lists. */
export function legalLinks(locale: CoreLocale) {
  return [
    { href: `/${locale}/privacy`, label: t(locale, 'legal.privacy') },
    { href: `/${locale}/kvkk`, label: t(locale, 'legal.kvkk') },
    { href: `/${locale}/consent`, label: t(locale, 'legal.consent') },
    { href: `/${locale}/terms`, label: t(locale, 'legal.terms') },
    { href: `/${locale}/terms#refunds`, label: t(locale, 'legal.refunds') },
    { href: `/${locale}/contact`, label: t(locale, 'legal.contact') },
  ];
}

/** Minimal footer: copyright, the AI disclosure and the legal links (KVKK is Turkish law, so TR only). */
export function SiteFooter({ locale, content }: { locale: CoreLocale; content: SiteContent }) {
  const links = [
    { href: `/${locale}/privacy`, label: t(locale, 'legal.privacy') },
    { href: `/${locale}/terms`, label: t(locale, 'legal.terms') },
    ...(locale === 'tr' ? [{ href: `/${locale}/kvkk`, label: t(locale, 'legal.kvkk') }] : []),
    { href: `/${locale}/contact`, label: t(locale, 'legal.contact') },
  ];
  return (
    <footer id="site-footer" className="mt-auto border-t border-line">
      <div className="shell flex flex-col gap-4 py-8">
        <nav aria-label={content.footer.legalTitle}>
          <ul className="flex flex-wrap gap-x-5">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-[14px] font-medium text-ink hover:text-violet hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
          <p className="text-[12.5px] text-muted">© {new Date().getFullYear()} Tonelle · {COMPANY.legalName}</p>
          <p className="text-[12.5px] text-muted sm:text-right">{t(locale, 'legal.aiDisclosure')}</p>
        </div>
      </div>
    </footer>
  );
}
