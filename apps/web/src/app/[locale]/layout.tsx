import type { Metadata, Viewport } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LOCALES, isLocale } from '@tonelle/shared';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { SITE_URL } from '@/config/company';
import { getContent } from '@/content';
import { OG_LOCALE, languageAlternates } from '@/lib/seo';
import '../globals.css';

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter-tight',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
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
  themeColor: '#e6ded7',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint:
 * - marks JS as available (scroll reveals only hide content when JS runs, and a 4 s
 *   failsafe shows everything if the observer never starts);
 * - decides whether the landing preloader plays: once per session, never for reduced
 *   motion, bots or headless browsers (so crawlers and LCP are never delayed).
 *   `?preloader=1` forces it (QA). A 6 s failsafe always releases the page.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__tIO)d.classList.add('no-io')},4000);try{var q=/[?&]preloader=1/.test(location.search);var m=matchMedia('(prefers-reduced-motion: reduce)').matches;var b=/bot|crawl|spider|slurp|lighthouse|headless|prerender|preview/i.test(navigator.userAgent);var h=/^\\/(tr|en)\\/?$/.test(location.pathname);if(q||(h&&!m&&!b&&!sessionStorage.getItem('tonelle.preloaded'))){d.setAttribute('data-preload','');setTimeout(function(){d.removeAttribute('data-preload')},6000)}}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <html lang={locale} className={`${interTight.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-[80] rounded-pill bg-ink px-4 py-2 text-ink-inverse focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {content.nav.skipToContent}
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
