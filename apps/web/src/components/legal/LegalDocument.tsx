import { isLocale, type Locale } from '@tonelle/shared';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
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
            <span aria-hidden className="absolute top-[0.6em] left-0 size-1.5 rounded-full bg-violet" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto rounded-card ring-1 ring-line ring-inset">
      <table className="w-full text-left text-[14.5px]">
        <tbody>
          {block.rows.map(([a, b]) => (
            <tr key={a} className="border-b border-line align-top last:border-b-0">
              <th scope="row" className="w-2/5 bg-mist px-4 py-3 font-semibold text-ink">
                {a}
              </th>
              <td className="px-4 py-3 text-muted">{b}</td>
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
    <main id="main" className="relative pb-20">
      <DraftComment text={content.legalCommon.draftNotice} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_80%_at_50%_0%,#EFEBFD_0%,rgba(255,255,255,0)_100%)]" />
      <div className="shell relative">
        <article className="mx-auto max-w-5xl">
          <header className="flex flex-col items-start gap-4 pt-8 pb-10 sm:pt-12">
            <Link href={`/${locale}`} className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-muted hover:text-ink">
              <ChevronLeft aria-hidden className="size-4" strokeWidth={2} />
              {content.legalCommon.backHome}
            </Link>
            <h1 className="max-w-[20ch] text-[clamp(2.1rem,7.4vw,3.6rem)] text-ink">{title}</h1>
            <p className="rounded-pill bg-mist px-3 py-1.5 text-[12.5px] font-medium text-muted ring-1 ring-line ring-inset">
              <time dateTime={LEGAL_LAST_UPDATED}>{content.legalCommon.lastUpdated.replace('{date}', formatLegalDate(locale))}</time>
            </p>
          </header>

          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
            {toc && toc.length > 3 ? (
              <nav aria-labelledby="toc-title" className="mb-10 lg:mb-0">
                <div className="rounded-panel bg-mist p-5 lg:sticky lg:top-24">
                  <h2 id="toc-title" className="caps text-muted" style={{ fontFamily: 'var(--font-sans)' }}>
                    {content.legalCommon.tocTitle}
                  </h2>
                  <ol className="mt-3 grid gap-0.5">
                    {toc.map((s) => {
                      const [num, text] = splitHeading(s.heading);
                      return (
                        <li key={s.id}>
                          <a href={`#${s.id}`} className="flex min-h-9 items-baseline gap-2.5 py-1 text-[13.5px] text-ink hover:text-violet">
                            <span className="w-5 shrink-0 text-[12px] font-semibold text-violet">{num}</span>
                            <span className="hover:underline">{text}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </nav>
            ) : (
              <div className="hidden lg:block" />
            )}

            <div className="max-w-[68ch] space-y-5 text-[15.5px] leading-relaxed text-muted">{children}</div>
          </div>

          <footer className="mt-16 lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
            <div className="lg:col-start-2">
              <div className="rounded-panel bg-mist p-6">
                <h2 className="caps text-muted" style={{ fontFamily: 'var(--font-sans)' }}>
                  {content.legalCommon.otherDocs}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {others.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="press inline-flex h-11 items-center rounded-pill bg-paper px-4 text-[14px] font-medium text-ink ring-1 ring-line ring-inset hover:bg-violet-soft"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[12.5px] text-muted">{content.legalCommon.draftNotice}</p>
              </div>
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
        <p key={p} className="text-[17px] leading-relaxed text-ink">
          {p}
        </p>
      ))}
      {doc.sections.map((section) => {
        const [num, text] = splitHeading(section.heading);
        return (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24 space-y-4 border-t border-line pt-8 first-of-type:mt-10">
            <h2 id={`${section.id}-h`} className="flex items-baseline gap-3 text-[1.55rem] leading-tight text-ink">
              {num && (
                <span className="grid h-7 min-w-7 shrink-0 translate-y-[-0.15em] place-items-center rounded-pill bg-violet-soft px-2 font-sans text-[12px] font-bold text-violet" style={{ fontFamily: 'var(--font-sans)' }}>
                  <span className="sr-only">{num}. </span>
                  <span aria-hidden>{num}</span>
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

