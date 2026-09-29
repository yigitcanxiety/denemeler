import { isLocale } from '@tonelle/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/site/LanguageSwitcher';
import { Logo } from '@/components/site/Logo';
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
      <header className="border-b border-border/60 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href={`/${locale}`} aria-label={content.analyze.homeLink} className="rounded-md">
            <Logo className="text-[1.35rem]" />
          </Link>
          <LanguageSwitcher locale={locale} compact />
        </div>
      </header>
      <main id="main" className="flex-1 bg-[radial-gradient(80%_40%_at_50%_0%,#fdf5f5,transparent)]">
        <AnalyzeFlow locale={locale} copy={content.analyze} stores={content.stores} />
      </main>
      <footer className="border-t border-border/60 px-4 py-5 text-xs text-ink-muted">
        <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-4 gap-y-1">
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
