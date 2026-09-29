import { DEFAULT_LOCALE, LOCALES, type Locale } from '@tonelle/shared';
import type { Metadata } from 'next';
import { SITE_URL } from '@/config/company';

export const OG_LOCALE: Record<Locale, string> = { tr: 'tr_TR', en: 'en_GB' };

/** `/tr/privacy`-style path for a locale; `path` is '' or starts with '/'. */
export function localePath(locale: Locale, path = ''): string {
  return `/${locale}${path}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** hreflang map for a page, including x-default (Turkish, the default market). */
export function languageAlternates(path = ''): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
    'x-default': localePath(DEFAULT_LOCALE, path),
  };
}

/** Per-page metadata with canonical, hreflang alternates and OpenGraph/Twitter tags. */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  absoluteTitle = false,
  keywords,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  keywords?: string[];
}): Metadata {
  const url = localePath(locale, path);
  // Page-level openGraph replaces the layout's, so the generated OG image is re-attached here.
  const image = { url: localePath(locale, '/opengraph-image'), width: 1200, height: 630, alt: title };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: 'website',
      siteName: 'Tonelle',
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
