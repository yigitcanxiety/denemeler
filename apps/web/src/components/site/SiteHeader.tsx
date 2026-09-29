import { t, type Locale } from '@tonelle/shared';
import type { SiteContent } from '@/content';
import { HeaderBar } from './HeaderBar';
import { legalLinks } from './SiteFooter';

export function SiteHeader({ locale, content }: { locale: Locale; content: SiteContent }) {
  const home = `/${locale}`;
  const links = [
    { href: `${home}#how`, label: content.nav.howItWorks },
    { href: `${home}#looks`, label: content.nav.looks },
    { href: `${home}#pricing`, label: content.nav.pricing },
    { href: `${home}#faq`, label: content.nav.faq },
    { href: `/${locale}/analyze`, label: t(locale, 'common.startAnalysis') },
  ];
  return (
    <HeaderBar
      locale={locale}
      ctaHref={`/${locale}/analyze`}
      links={links}
      legal={legalLinks(locale)}
      labels={{
        home: content.nav.home,
        menu: content.nav.menu,
        closeMenu: content.nav.closeMenu,
        menuTitle: content.nav.menuTitle,
        startCta: content.nav.startCta,
        primaryNavLabel: content.nav.primaryNavLabel,
        legalTitle: content.footer.legalTitle,
      }}
    />
  );
}
