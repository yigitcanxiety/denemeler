import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LOCALES, isLocale, t } from '@tonelle/shared';
import type { ReactNode } from 'react';
import '../globals.css';

const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tonelle.app'),
    title: { default: `Tonelle · ${t(locale, 'common.tagline')}`, template: '%s · Tonelle' },
    description: t(locale, 'onboarding.welcomeSubtitle'),
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])) },
  };
}

export const viewport: Viewport = {
  themeColor: '#fdf9f6',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-surface text-ink antialiased">{children}</body>
    </html>
  );
}
