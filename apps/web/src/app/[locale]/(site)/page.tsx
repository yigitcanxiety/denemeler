import { PRICING, isCoreLocale, regionForLocale } from '@tonelle/shared';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { Hero } from '@/components/landing/Hero';
import { HowSteps } from '@/components/landing/HowSteps';
import { LooksSection } from '@/components/landing/LooksSection';
import { InAppNotice } from '@/components/site/InAppNotice';
import { COMPANY, SITE_URL } from '@/config/company';
import { getContent } from '@/content';
import { APP_STORE_LIVE, APP_STORE_URL } from '@/lib/app-store';
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreLocale(locale)) return {};
  const content = getContent(locale);
  return pageMetadata({
    locale,
    title: content.meta.homeTitle,
    description: content.meta.homeDescription,
    absoluteTitle: true,
    keywords: content.meta.keywords,
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isCoreLocale(locale)) notFound();
  const content = getContent(locale);
  const region = PRICING[regionForLocale(locale)];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Tonelle',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'iOS',
      inLanguage: locale,
      url: absoluteUrl(`/${locale}`),
      description: content.meta.homeDescription,
      publisher: { '@type': 'Organization', name: COMPANY.legalName, url: SITE_URL, email: COMPANY.supportEmail },
      offers: { '@type': 'Offer', name: content.meta.analyzeTitle, price: 0, priceCurrency: region.yearly.currency },
      ...(APP_STORE_LIVE ? { downloadUrl: APP_STORE_URL } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  return (
    <>
      {APP_STORE_LIVE && <InAppNotice text={content.inAppNotice.text} closeLabel={content.inAppNotice.close} />}
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
        <Hero locale={locale} content={content} />
        <LooksSection locale={locale} content={content} />
        <HowSteps content={content} />
        <Faq content={content} />
        <FinalCta content={content} />
      </main>
    </>
  );
}
