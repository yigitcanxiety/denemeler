import { isLocale, type Locale } from '@tonelle/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { legalLinks } from '@/components/site/SiteFooter';
import { LEGAL_LAST_UPDATED } from '@/config/company';
import { getContent, type LegalBlock, type LegalDocument as LegalDoc, type SiteContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

export type LegalDocKey = keyof SiteContent['legal'];

export function formatLegalDate(locale: Locale, iso: string = LEGAL_LAST_UPDATED): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

/** Invisible HTML comment flagging the text as a draft for counsel review. */
export function DraftComment({ text }: { text: string }) {
  return <span hidden dangerouslySetInnerHTML={{ __html: `<!-- DRAFT: ${text.replace(/--/g, '—')} -->` }} />;
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') return <p>{block}</p>;
  if ('list' in block) {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-blush-400">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-[0.95rem]">
        <tbody className="divide-y divide-border">
          {block.rows.map(([a, b]) => (
            <tr key={a} className="align-top">
              <th scope="row" className="w-2/5 bg-surface-sunken/60 p-3.5 font-medium text-ink sm:p-4">
                {a}
              </th>
              <td className="p-3.5 text-ink-muted sm:p-4">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalShell({
  locale,
  content,
  title,
  path,
  children,
  toc,
}: {
  locale: Locale;
  content: SiteContent;
  title: string;
  path: string;
  children: ReactNode;
  toc?: { id: string; heading: string }[];
}) {
  const others = legalLinks(locale).filter((l) => !l.href.endsWith(path));
  return (
    <main id="main" className="px-4 py-12 sm:px-6 sm:py-16">
      <DraftComment text={content.legalCommon.draftNotice} />
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <Link href={`/${locale}`} className="text-sm text-ink-muted hover:text-ink hover:underline">
            ← {content.legalCommon.backHome}
          </Link>
          <h1 className="mt-5 text-4xl text-ink sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-ink-muted">
            <time dateTime={LEGAL_LAST_UPDATED}>
              {content.legalCommon.lastUpdated.replace('{date}', formatLegalDate(locale))}
            </time>
          </p>
        </header>

        {toc && toc.length > 3 && (
          <nav aria-labelledby="toc-title" className="mt-8 rounded-card bg-surface-sunken/60 p-5 sm:p-6">
            <h2 id="toc-title" className="font-sans text-sm font-semibold tracking-wide text-ink uppercase">
              {content.legalCommon.tocTitle}
            </h2>
            <ol className="mt-3 grid gap-1.5 text-[0.95rem] sm:grid-cols-2">
              {toc.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ink-muted hover:text-accent hover:underline">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mt-10 space-y-5 text-[1.02rem] leading-relaxed text-ink-muted">{children}</div>

        <footer className="mt-14 border-t border-border pt-8">
          <h2 className="font-sans text-sm font-semibold tracking-wide text-ink uppercase">{content.legalCommon.otherDocs}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {others.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block rounded-pill border border-border bg-surface-raised px-3.5 py-1.5 text-sm text-ink hover:border-border-strong"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-ink-subtle">{content.legalCommon.draftNotice}</p>
        </footer>
      </article>
    </main>
  );
}

export function LegalDocumentView({ locale, doc, path }: { locale: Locale; doc: LegalDoc; path: string }) {
  const content = getContent(locale);
  return (
    <LegalShell locale={locale} content={content} title={doc.title} path={path} toc={doc.sections}>
      {doc.intro.map((p) => (
        <p key={p} className="text-lg text-ink">
          {p}
        </p>
      ))}
      {doc.sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24 space-y-4 pt-6">
          <h2 id={`${section.id}-h`} className="text-2xl text-ink">
            {section.heading}
          </h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
    </LegalShell>
  );
}

/** Shared implementation for the four legal document routes. */
export function legalRoute(key: LegalDocKey) {
  const path = `/${key}`;
  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const doc = getContent(locale).legal[key];
    return pageMetadata({ locale, path, title: doc.title, description: doc.metaDescription });
  }
  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    return <LegalDocumentView locale={locale} doc={getContent(locale).legal[key]} path={path} />;
  }
  return { generateMetadata, Page };
}

