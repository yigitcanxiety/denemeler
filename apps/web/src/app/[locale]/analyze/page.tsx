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
      <main id="main" className="relative flex-1">
        <div aria-hidden className="pointer-events-none fixed inset-0 opacity-70">
          <div className="cgrid">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <AnalyzeFlow locale={locale} copy={content.analyze} stores={content.stores} />
      </main>
      <footer className="relative border-t border-line-strong px-4 py-6">
        <ul className="mono mx-auto flex max-w-5xl flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-ink-muted">
          {legalLinks(locale).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-ink hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
