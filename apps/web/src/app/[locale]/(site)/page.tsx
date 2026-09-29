import { PRICING, isLocale, regionForLocale, t } from '@tonelle/shared';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LooksGallery } from '@/components/landing/LooksGallery';
import { PricingSection } from '@/components/landing/PricingSection';
import { PrivacyPromise } from '@/components/landing/PrivacyPromise';
import { SkinTones } from '@/components/landing/SkinTones';
import { COMPANY, SITE_URL, STORE_URLS } from '@/config/company';
import { getContent } from '@/content';
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
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
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const region = PRICING[regionForLocale(locale)];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Tonelle',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'iOS, Android, Web',
      inLanguage: locale,
      url: absoluteUrl(`/${locale}`),
      description: content.meta.homeDescription,
      publisher: { '@type': 'Organization', name: COMPANY.legalName, url: SITE_URL, email: COMPANY.supportEmail },
      offers: [
        { '@type': 'Offer', name: content.meta.analyzeTitle, price: 0, priceCurrency: region.yearly.currency },
        { '@type': 'Offer', name: t(locale, 'paywall.weeklyName'), price: region.weekly.amount, priceCurrency: region.weekly.currency },
        { '@type': 'Offer', name: t(locale, 'paywall.yearlyName'), price: region.yearly.amount, priceCurrency: region.yearly.currency },
      ],
      ...(STORE_URLS.appStore || STORE_URLS.playStore
        ? { sameAs: [STORE_URLS.appStore, STORE_URLS.playStore].filter(Boolean) }
        : {}),
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
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <Hero locale={locale} content={content} />
      <HowItWorks content={content} />
      <LooksGallery locale={locale} content={content} />
      <SkinTones locale={locale} content={content} />
      <PrivacyPromise locale={locale} content={content} />
      <PricingSection locale={locale} content={content} />
      <Faq content={content} />
      <FinalCta locale={locale} content={content} />
    </main>
  );
}
