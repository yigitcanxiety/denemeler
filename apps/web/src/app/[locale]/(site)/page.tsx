import { PRICING, isLocale, regionForLocale, t } from '@tonelle/shared';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Faq } from '@/components/landing/Faq';
import { Hero } from '@/components/landing/Hero';
import { LooksGallery } from '@/components/landing/LooksGallery';
import { People } from '@/components/landing/People';
import { phoneScreens } from '@/components/landing/PhoneScreens';
import { Preloader } from '@/components/landing/Preloader';
import { PricingSection } from '@/components/landing/PricingSection';
import { PrivacyPromise } from '@/components/landing/PrivacyPromise';
import { SeasonSphere } from '@/components/landing/SeasonSphere';
import { SkinTones } from '@/components/landing/SkinTones';
import { Story } from '@/components/landing/Story';
import { StickyDock } from '@/components/site/StickyDock';
import { StoreBadges } from '@/components/site/StoreBadges';
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

  const hasStores = Boolean(STORE_URLS.appStore || STORE_URLS.playStore);

  return (
    <>
      <Preloader seasons={content.preloader.seasons} label={content.preloader.label} skip={content.preloader.skip} />
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
        <Hero locale={locale} content={content} />
        <Story
          title={content.story.title}
          subtitle={content.story.subtitle}
          steps={content.story.steps}
          screens={phoneScreens(locale, content.story.steps.map((s) => s.screen))}
          progressLabel={content.story.title}
        />
        <SkinTones locale={locale} content={content} />
        <SeasonSphere
          eyebrow={content.sphere.eyebrow}
          title={content.sphere.title}
          steps={content.sphere.steps}
          progressLabel={content.sphere.title}
        />
        <LooksGallery locale={locale} content={content} />
        <People locale={locale} content={content} />
        <PricingSection locale={locale} content={content} />
        <PrivacyPromise locale={locale} content={content} />
        <Faq content={content} />
      </main>
      <StickyDock showAfterId="hero-end" hideNearId="site-footer" label={content.hero.storesLabel}>
        {hasStores ? (
          <StoreBadges labels={content.stores} className="justify-center" />
        ) : (
          <Link
            href={`/${locale}/analyze`}
            className="press flex h-14 items-center justify-between gap-3 rounded-[14px] bg-paper-raised pr-2 pl-5 text-ink hover:bg-white"
          >
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-[-0.02em]">{content.hero.cta}</span>
              <span className="font-mono text-[11px] text-ink-muted">{content.dock.note}</span>
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-ink text-ink-inverse">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </Link>
        )}
      </StickyDock>
    </>
  );
}
