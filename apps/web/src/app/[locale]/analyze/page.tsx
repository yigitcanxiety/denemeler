import { isLocale } from '@tonelle/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { legalLinks } from '@/components/site/SiteFooter';
import { getContent } from '@/content';
import { AnalyzeFlow } from '@/features/analyze/AnalyzeFlow';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/analyze'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getContent(locale);
  return pageMetadata({ locale, path: '/analyze', title: meta.analyzeTitle, description: meta.analyzeDescription });
}

export default async function AnalyzePage({ params }: PageProps<'/[locale]/analyze'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <>
      <main id="main" className="relative flex-1 bg-paper">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_70%_at_50%_0%,#F1EDFD_0%,rgba(255,255,255,0)_100%)]" />
        <div className="relative">
          <AnalyzeFlow locale={locale} copy={content.analyze} stores={content.stores} />
        </div>
      </main>
      <footer className="border-t border-line px-4 py-6">
        <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-5 gap-y-1 text-[12.5px] text-muted">
          {legalLinks(locale).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex min-h-9 items-center hover:text-ink hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
