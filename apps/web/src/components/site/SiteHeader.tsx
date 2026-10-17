import type { CoreLocale } from '@tonelle/shared';
import Link from 'next/link';
import type { SiteContent } from '@/content';
import { AppStoreCta } from './AppStoreCta';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

/** Slim sticky header: wordmark, TR/EN switch and a compact App Store CTA. */
export function SiteHeader({ locale, content }: { locale: CoreLocale; content: SiteContent }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-paper/75 backdrop-blur-xl">
      <div className="shell flex h-14 items-center justify-between gap-2 sm:h-16">
        <Link href={`/${locale}`} aria-label={content.nav.home} className="press inline-flex min-h-11 items-center rounded-md">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} compact />
          <AppStoreCta labels={{ download: content.nav.ctaDownload, soon: content.nav.ctaSoon }} size="sm" />
        </div>
      </div>
    </header>
  );
}
