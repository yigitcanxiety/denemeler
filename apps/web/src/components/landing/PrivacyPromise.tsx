import { Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@tonelle/shared';
import type { SiteContent } from '@/content';

export function PrivacyPromise({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { privacy } = content;
  return (
    <section aria-labelledby="privacy-title" className="px-4 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-surface-inverse px-6 py-12 text-ink-inverse sm:px-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10">
              <ShieldCheck aria-hidden className="size-7 text-blush-200" />
            </span>
            <h2 id="privacy-title" className="mt-5 text-3xl text-ink-inverse sm:text-[2.4rem]">
              {privacy.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-nude-200">{privacy.body}</p>
            <Link
              href={`/${locale}/privacy`}
              className="mt-6 inline-block font-semibold text-blush-200 underline decoration-blush-400 underline-offset-4 hover:text-white"
            >
              {privacy.link}
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {privacy.points.map((point) => (
              <li key={point} className="flex gap-3 rounded-2xl bg-white/[0.06] p-4 text-[0.95rem] leading-relaxed text-nude-100">
                <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-blush-300" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
