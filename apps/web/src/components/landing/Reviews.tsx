import type { Locale } from '@tonelle/shared';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { SectionHeading, delay } from '@/components/ui';
import type { SiteContent } from '@/content';
import { TESTIMONIALS, hasPlaceholderTestimonials } from '@/content/testimonials';

const AVATARS = ['/images/portrait-hero.jpg', '/images/portrait-2.jpg', '/images/portrait-3.jpg'] as const;

/**
 * Aura-style review cards. The entries are illustrative scenarios, so the
 * "Örnek kullanıcı senaryoları" caption is always shown with them (see testimonials.ts).
 */
export function Reviews({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { people } = content;
  return (
    <section id="stories" aria-labelledby="stories-title" className="scroll-mt-20 bg-mist py-16 sm:py-24">
      <div className="shell">
        <SectionHeading id="stories-title" eyebrow={people.eyebrow} title={people.title} />
        {hasPlaceholderTestimonials() && <p className="mt-3 text-center text-[12.5px] font-medium text-muted">{people.caption}</p>}
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <li key={item.id} className="flex flex-col rounded-panel bg-paper p-6 shadow-soft" data-reveal style={delay(i * 90)}>
              <div className="flex items-center gap-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-mist">
                  <Image src={AVATARS[item.avatar]} alt="" fill sizes="44px" className="object-cover object-top" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-ink">{item.name}</p>
                  <p className="text-[12.5px] text-muted">
                    {item.role[locale]} · {item.age}
                  </p>
                </div>
                {/* Star ratings only for real reviews; invented scenarios must not carry a rating. */}
                {!item.isPlaceholder && (
                  <span role="img" aria-label={people.starsLabel} className="flex shrink-0 gap-0.5 text-violet">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} aria-hidden className="size-3.5 fill-current" strokeWidth={0} />
                    ))}
                  </span>
                )}
              </div>
              <blockquote className="mt-5 text-[15px] leading-relaxed text-ink">“{item.quote[locale]}”</blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
