import type { Metadata, Viewport } from 'next';
import { Gloock, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LOCALES, isLocale } from '@tonelle/shared';
import { RevealObserver } from '@/components/site/RevealObserver';
import { SITE_URL } from '@/config/company';
import { getContent } from '@/content';
import { OG_LOCALE, languageAlternates } from '@/lib/seo';
import '../globals.css';

const gloock = Gloock({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-gloock',
  display: 'swap',
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: 'Tonelle',
    title: { default: content.meta.homeTitle, template: '%s · Tonelle' },
    description: content.meta.homeDescription,
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
    openGraph: {
      type: 'website',
      siteName: 'Tonelle',
      locale: OG_LOCALE[locale],
      title: content.meta.homeTitle,
      description: content.meta.homeDescription,
    },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint: marks JS as available, so scroll reveals only hide content when
 * JS runs; a 4 s failsafe shows everything if the observer never starts.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__tIO)d.classList.add('no-io')},4000)})();`;

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <html lang={locale} className={`${gloock.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-[80] rounded-pill bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {content.nav.skipToContent}
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
