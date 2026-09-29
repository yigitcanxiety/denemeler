import type { Locale } from '@tonelle/shared';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { SiteContent } from '@/content';

/** Compact privacy promise card. */
export function PrivacyStrip({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { privacy } = content;
  return (
    <section aria-labelledby="privacy-title" className="pb-4">
      <div className="shell">
        <div className="grid gap-8 rounded-xl bg-mist p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center" data-reveal>
          <div>
            <span className="grid size-11 place-items-center rounded-[14px] bg-paper text-mint-ink">
              <ShieldCheck aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <h2 id="privacy-title" className="mt-4 text-[clamp(1.7rem,5vw,2.3rem)] text-ink">
              {privacy.title}
            </h2>
            <p className="mt-3 max-w-[44ch] text-[15px] text-muted">{privacy.body}</p>
            <Link href={`/${locale}/privacy`} className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-violet hover:underline">
              {privacy.link}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {privacy.points.map((point) => (
              <li key={point} className="flex gap-3 rounded-card bg-paper p-4 text-[14px] text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-mint-ink">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
