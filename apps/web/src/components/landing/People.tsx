import type { Locale } from '@tonelle/shared';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { SiteContent } from '@/content';
import { TESTIMONIALS, hasPlaceholderTestimonials, type Testimonial } from '@/content/testimonials';

const HAIR: Record<Testimonial['avatar'], string> = {
  0: 'M40 56C37 31 49 23 60 23C72 23 85 31 81 57C80 67 84 73 88 77H73C78 64 76 45 62 38C52 44 46 51 44 61C44 67 46 72 48 77H32C37 70 40 63 40 56Z',
  1: 'M37 52C35 28 49 21 60 21C75 21 87 29 85 53C84 72 91 89 97 104H80C78 88 76 71 76 56C70 43 57 37 45 46C43 63 42 86 36 104H19C28 88 37 71 37 52Z',
  2: 'M41 52C39 33 50 27 60 27C72 27 81 33 79 52C73 42 56 38 43 54Z',
};

/** Monochrome, illustrated portrait avatar (never a photo of a real person). */
function PersonaAvatar({ variant, className }: { variant: Testimonial['avatar']; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      <defs>
        <linearGradient id={`pa-bg-${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#E3DAD2" />
          <stop offset="100%" stopColor="#C9BDB4" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#pa-bg-${variant})`} />
      <path d="M12 120C16 97 36 87 60 87C84 87 104 97 108 120Z" fill="#3A2A27" />
      <path d="M52 68H68V86C68 92 52 92 52 86Z" fill="#B5A59C" />
      {variant === 2 && <circle cx="60" cy="22" r="9" fill="#231816" />}
      <ellipse cx="60" cy="53" rx="17" ry="21" fill="#D3C5BC" />
      <path d={HAIR[variant]} fill="#231816" />
      <g fill="none" stroke="#231816" strokeWidth="1" strokeLinecap="round">
        <path d="M50 49C52 47.5 55 47.5 57 49M63 49C65 47.5 68 47.5 70 49" />
        <path d="M51 53.5C52.5 54.5 54.5 54.5 56 53.5M64 53.5C65.5 54.5 67.5 54.5 69 53.5" />
        <path d="M60 55V61.5L58 62.5" />
        <path d="M55 66C57.5 67.6 62.5 67.6 65 66" />
      </g>
      <rect width="120" height="120" fill="#231816" opacity="0.04" />
    </svg>
  );
}

/**
 * "How people use Tonelle": three mono testimonial columns. Entries live in
 * content/testimonials.ts; while any is a placeholder the disclosure caption is always shown.
 */
export function People({ locale, content }: { locale: Locale; content: SiteContent }) {
  const offsets = ['lg:mt-0', 'lg:mt-44', 'lg:mt-20'];
  return (
    <section aria-labelledby="people-title" className="relative overflow-hidden border-t border-line-strong py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cgrid">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      <div className="shell relative">
        <h2 id="people-title" className="max-w-[12ch] text-[clamp(2.6rem,9vw,6.4rem)] text-ink" data-reveal>
          {content.people.title}
        </h2>
        {hasPlaceholderTestimonials() && (
          <p className="mono mt-4 text-[12px] text-ink-muted" data-reveal style={{ '--d': '100ms' } as CSSProperties}>
            {content.people.caption}
          </p>
        )}

        <ul className="mt-14 grid gap-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-6">
          {TESTIMONIALS.map((item, i) => (
            <li key={item.id} className={clsx('max-w-[42ch]', offsets[i])} data-reveal style={{ '--d': `${i * 110}ms` } as CSSProperties}>
              <figure>
                <PersonaAvatar variant={item.avatar} className="size-28 sm:size-32" />
                <figcaption className="mt-8">
                  <p className="mono text-[15px] font-medium text-ink">
                    {item.name}, {item.age}
                  </p>
                  <p className="mono text-[15px] text-ink-muted">{item.role[locale]}</p>
                </figcaption>
                <blockquote className="mono mt-6 text-ink">
                  <p>“{item.quote[locale]}”</p>
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
