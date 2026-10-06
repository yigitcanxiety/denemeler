import { isLocale } from '@tonelle/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { legalLinks } from '@/components/site/SiteFooter';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';
import { AnalyzeFlow } from './AnalyzeFlow';
import type { AnalyzeMode } from './machine';

const PATHS: Record<AnalyzeMode, string> = { full: '/analyze', color: '/analyze/color', skin: '/analyze/skin' };

/** Shared metadata for the three analyze pages. */
export async function analyzeMetadata(params: Promise<{ locale: string }>, mode: AnalyzeMode): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getContent(locale);
  const [title, description] =
    mode === 'color'
      ? [meta.colorTitle, meta.colorDescription]
      : mode === 'skin'
        ? [meta.skinTitle, meta.skinDescription]
        : [meta.analyzeTitle, meta.analyzeDescription];
  return pageMetadata({ locale, path: PATHS[mode], title, description });
}

/** Page body shared by the full, colour-only and skin-only analyses. */
export async function AnalyzePage({ params, mode }: { params: Promise<{ locale: string }>; mode: AnalyzeMode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <>
      <main id="main" className="relative flex-1 bg-paper">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_70%_at_50%_0%,#F1EDFD_0%,rgba(255,255,255,0)_100%)]" />
        <div className="relative">
          <AnalyzeFlow locale={locale} copy={content.analyze} stores={content.stores} mode={mode} />
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
