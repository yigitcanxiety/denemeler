import { isLocale } from '@tonelle/shared';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PricingSection } from '@/components/landing/PricingSection';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

/** Standalone pricing page (payment providers review it; the landing page has the same section). */
export async function generateMetadata({ params }: PageProps<'/[locale]/pricing'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { pricing } = getContent(locale);
  return pageMetadata({ locale, path: '/pricing', title: pricing.title, description: pricing.subtitle });
}

export default async function PricingPage({ params }: PageProps<'/[locale]/pricing'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main id="main" className="pt-8">
      <PricingSection locale={locale} content={getContent(locale)} />
    </main>
  );
}
