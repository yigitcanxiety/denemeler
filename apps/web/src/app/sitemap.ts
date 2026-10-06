import type { MetadataRoute } from 'next';
import { LOCALES } from '@tonelle/shared';
import { LEGAL_LAST_UPDATED } from '@/config/company';
import { absoluteUrl, localePath } from '@/lib/seo';

const PAGES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly'; legal?: boolean }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/analyze', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/analyze/color', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/analyze/skin', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', legal: true },
  { path: '/kvkk', priority: 0.3, changeFrequency: 'yearly', legal: true },
  { path: '/consent', priority: 0.2, changeFrequency: 'yearly', legal: true },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly', legal: true },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, page.path)),
      lastModified: page.legal ? new Date(`${LEGAL_LAST_UPDATED}T00:00:00Z`) : new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(localePath(l, page.path))])),
      },
    })),
  );
}
