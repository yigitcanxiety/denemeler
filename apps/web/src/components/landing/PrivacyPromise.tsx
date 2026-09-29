import type { Locale } from '@tonelle/shared';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { NumberTag } from '@/components/lab/primitives';
import type { SiteContent } from '@/content';

export function PrivacyPromise({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { privacy } = content;
  return (
    <section aria-labelledby="privacy-title" className="relative border-t border-line-strong py-20 sm:py-24">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <p className="mono-caps flex items-center gap-2 text-ink-muted">
            <span aria-hidden className="size-1.5 bg-accent" />
            {content.hero.trustPoints[0]}
          </p>
          <h2 id="privacy-title" className="mt-4 text-[clamp(2.2rem,7vw,4.2rem)] text-ink">
            {privacy.title}
          </h2>
          <p className="mono mt-5 max-w-[46ch] text-ink-muted">{privacy.body}</p>
          <Link
            href={`/${locale}/privacy`}
            className="mono mt-6 inline-flex min-h-11 items-center gap-1.5 text-ink underline decoration-accent underline-offset-4 hover:text-accent"
          >
            {privacy.link}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ol className="grid border-t border-l border-line-strong sm:grid-cols-2 lg:col-span-7">
          {privacy.points.map((point, i) => (
            <li
              key={point}
              className="flex min-h-40 flex-col justify-between gap-8 border-r border-b border-line-strong p-5"
              data-reveal
              style={{ '--d': `${i * 80}ms` } as CSSProperties}
            >
              <NumberTag n={i + 1} />
              <p className="mono text-ink">{point}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
