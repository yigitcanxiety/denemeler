import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LOCALES, isLocale } from '@tonelle/shared';
import { SITE_URL } from '@/config/company';
import { getContent } from '@/content';
import { OG_LOCALE, languageAlternates } from '@/lib/seo';
import '../globals.css';

const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' });

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
  themeColor: '#fdf9f6',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col bg-surface text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded-pill bg-surface-inverse px-4 py-2 text-ink-inverse focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {content.nav.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
