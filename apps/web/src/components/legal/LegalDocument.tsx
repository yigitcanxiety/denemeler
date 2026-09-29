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

/** "3. Heading" → ["03", "Heading"]; headings without a number keep an empty tag. */
export function splitHeading(heading: string): [string, string] {
  const m = /^(\d+)\.\s*(.*)$/.exec(heading);
  return m ? [m[1]!.padStart(2, '0'), m[2]!] : ['', heading];
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') return <p>{block}</p>;
  if ('list' in block) {
    return (
      <ul className="space-y-2.5">
        {block.list.map((item) => (
          <li key={item} className="relative pl-5">
            <span aria-hidden className="absolute top-[0.62em] left-0 size-1.5 bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto border-t border-line-strong">
      <table className="w-full text-left text-[0.95rem]">
        <tbody>
          {block.rows.map(([a, b]) => (
            <tr key={a} className="border-b border-line-strong align-top">
              <th scope="row" className="mono w-2/5 py-3.5 pr-4 font-medium text-ink">
                {a}
              </th>
              <td className="py-3.5 text-ink-muted">{b}</td>
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
    <main id="main" className="relative pt-[104px] pb-16 sm:pt-[128px] sm:pb-24">
      <DraftComment text={content.legalCommon.draftNotice} />
      <div className="shell">
        <article className="mx-auto max-w-[68ch] lg:max-w-none">
          <header className="border-b border-line-strong pb-8 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-9">
              <Link href={`/${locale}`} className="mono inline-flex min-h-11 items-center text-ink-muted hover:text-ink hover:underline">
                ← {content.legalCommon.backHome}
              </Link>
              <h1 className="mt-4 text-[clamp(2.3rem,8vw,5rem)] text-ink">{title}</h1>
            </div>
            <p className="mono mt-5 text-ink-muted lg:col-span-3 lg:mt-0 lg:self-end lg:text-right">
              <time dateTime={LEGAL_LAST_UPDATED}>
                {content.legalCommon.lastUpdated.replace('{date}', formatLegalDate(locale))}
              </time>
            </p>
          </header>

          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            {toc && toc.length > 3 && (
              <nav aria-labelledby="toc-title" className="mt-8 border-b border-line-strong pb-8 lg:col-span-3 lg:border-b-0">
                <div className="lg:sticky lg:top-28">
                  <h2 id="toc-title" className="mono-caps text-ink-muted">
                    {content.legalCommon.tocTitle}
                  </h2>
                  <ol className="mt-3 grid gap-0.5">
                    {toc.map((s) => {
                      const [num, text] = splitHeading(s.heading);
                      return (
                        <li key={s.id}>
                          <a href={`#${s.id}`} className="mono flex min-h-9 items-baseline gap-3 py-1 text-ink hover:text-accent">
                            <span className="w-5 shrink-0 text-ink-subtle">{num}</span>
                            <span className="hover:underline">{text}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </nav>
            )}

            <div className="mt-10 max-w-[68ch] space-y-5 text-[1.02rem] leading-relaxed text-ink-muted lg:col-span-8 lg:col-start-5">
              {children}
            </div>
          </div>

          <footer className="mt-16 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="border-t border-line-strong pt-8 lg:col-span-8 lg:col-start-5">
              <h2 className="mono-caps text-ink-muted">{content.legalCommon.otherDocs}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {others.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="press mono inline-flex h-11 items-center rounded-pill px-4 text-ink ring-1 ring-line-strong hover:bg-ink hover:text-ink-inverse">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mono mt-8 text-[12px] text-ink-muted">{content.legalCommon.draftNotice}</p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

export function LegalDocumentView({ locale, doc, path }: { locale: Locale; doc: LegalDoc; path: string }) {
  const content = getContent(locale);
  return (
    <LegalShell locale={locale} content={content} title={doc.title} path={path} toc={doc.sections}>
      {doc.intro.map((p) => (
        <p key={p} className="text-[1.15rem] leading-relaxed text-ink">
          {p}
        </p>
      ))}
      {doc.sections.map((section) => {
        const [num, text] = splitHeading(section.heading);
        return (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-28 space-y-4 border-t border-line pt-8 first-of-type:mt-10">
            <h2 id={`${section.id}-h`} className="flex items-baseline gap-3 text-[1.6rem] leading-tight tracking-[-0.035em] text-ink">
              {num && (
                <span className="mono shrink-0 translate-y-[-0.2em] bg-ink px-1.5 py-1 text-[12px] leading-none tracking-normal text-paper">
                  <span className="sr-only">{num}. </span>
                  <span aria-hidden>§{num}</span>
                </span>
              )}
              <span>{text}</span>
            </h2>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        );
      })}
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

