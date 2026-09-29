import type { Locale } from '@tonelle/shared';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui';
import type { SiteContent } from '@/content';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

export function SiteHeader({ locale, content }: { locale: Locale; content: SiteContent }) {
  const home = `/${locale}`;
  const links = [
    { href: `${home}#how`, label: content.nav.howItWorks },
    { href: `${home}#looks`, label: content.nav.looks },
    { href: `${home}#pricing`, label: content.nav.pricing },
    { href: `${home}#faq`, label: content.nav.faq },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/85 backdrop-blur-md supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={home} aria-label={content.nav.home} className="shrink-0 rounded-md">
          <Logo className="text-[1.45rem] sm:text-[1.6rem]" />
        </Link>
        <nav aria-label={content.nav.primaryNavLabel} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-pill px-3.5 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} compact className="hidden min-[380px]:flex lg:hidden" />
          <LanguageSwitcher locale={locale} className="hidden lg:flex" />
          <ButtonLink href={`/${locale}/analyze`} size="sm">
            {content.nav.startCta}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
