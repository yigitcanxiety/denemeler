import type { Locale } from '@tonelle/shared';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { SiteContent } from '@/content';
import { TESTIMONIALS, hasPlaceholderTestimonials, type Testimonial } from '@/content/testimonials';

/**
 * Monochrome duotone portraits (ink on warm paper), drawn in SVG: an illustration, never a
 * photo of a real person. Each variant differs in hair, accessories and clothing.
 */
const INK = '#231816';
const INK_SOFT = '#3A2A27';

function Hair({ variant, back }: { variant: Testimonial['avatar']; back: boolean }) {
  if (variant === 0) {
    // shoulder-length, side part, tucked behind one ear
    return back ? (
      <path d="M44 84C40 50 58 34 82 34C108 34 124 52 120 88C118 104 122 118 128 130C116 136 104 132 102 120L104 88H58L60 124C56 134 42 134 34 128C42 116 46 102 44 84Z" fill={INK} />
    ) : (
      <>
        <path d="M52 76C52 50 66 40 84 40C104 40 114 54 110 78C102 62 90 54 70 58C62 60 56 66 52 76Z" fill={INK} />
        <path d="M70 46C80 44 96 46 104 56" fill="none" stroke="#6E605B" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M60 52C64 48 70 46 76 46" fill="none" stroke="#6E605B" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </>
    );
  }
  if (variant === 1) {
    // long, softly waved, centre part
    return back ? (
      <path d="M40 90C36 52 56 32 80 32C104 32 124 52 120 90C118 112 128 128 136 150C122 160 106 154 102 140L104 96H56L58 140C54 154 38 160 24 150C32 128 42 112 40 90Z" fill={INK} />
    ) : (
      <>
        <path d="M50 84C50 54 64 40 80 40C96 40 110 54 110 84C104 66 94 56 80 50C66 56 56 66 50 84Z" fill={INK} />
        <path d="M80 42C76 56 66 64 56 72M80 42C86 56 96 64 104 72" fill="none" stroke="#6E605B" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </>
    );
  }
  // short crop with a top bun
  return back ? (
    <>
      <circle cx="80" cy="30" r="13" fill={INK} />
      <path d="M50 80C48 54 62 40 80 40C98 40 112 54 110 80C108 92 106 100 104 106L56 106C54 100 52 92 50 80Z" fill={INK} />
    </>
  ) : (
    <>
      <path d="M52 74C54 52 66 44 80 44C96 44 108 54 108 74C98 62 88 58 76 60C66 62 58 66 52 74Z" fill={INK} />
      <path d="M72 24C76 20 84 20 88 24" fill="none" stroke="#6E605B" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    </>
  );
}

function PersonaAvatar({ variant, className }: { variant: Testimonial['avatar']; className?: string }) {
  const id = `pa-${variant}`;
  const tilt = [-3, 2, -1][variant];
  return (
    <svg aria-hidden viewBox="0 0 160 200" className={className}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" x2="0.4" y1="0" y2="1">
          <stop offset="0%" stopColor="#E3DAD2" />
          <stop offset="100%" stopColor="#C9BDB4" />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0%" stopColor="#EDE5DE" />
          <stop offset="55%" stopColor="#D6CAC1" />
          <stop offset="100%" stopColor="#A8998F" />
        </linearGradient>
        <linearGradient id={`${id}-cloth`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4A3935" />
          <stop offset="100%" stopColor={INK} />
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.14  0 0 0 0 0.09  0 0 0 0 0.08  0 0 0 0.55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="160" height="200" fill={`url(#${id}-bg)`} />
      <circle cx="116" cy="46" r="56" fill="#fff" opacity="0.18" />

      <g transform={`rotate(${tilt} 80 110)`}>
        <Hair variant={variant} back />
        {/* neck + shoulders */}
        <path d="M68 104H92V132C92 140 68 140 68 132Z" fill="#B3A49B" />
        <path d="M70 118C76 124 86 124 92 116V124C86 130 76 130 70 124Z" fill="#8F8078" opacity="0.6" />
        {variant === 2 ? (
          <path d="M14 200C16 164 40 146 66 140V128H94V140C120 146 144 164 146 200Z" fill={`url(#${id}-cloth)`} />
        ) : (
          <path d="M10 200C14 162 40 144 70 138C74 146 86 146 90 138C120 144 146 162 150 200Z" fill={`url(#${id}-cloth)`} />
        )}
        {variant === 2 && <path d="M66 130H94" stroke="#6E605B" strokeWidth="1" opacity="0.7" />}
        {variant === 0 && <path d="M70 138L80 156L90 138" fill="none" stroke="#6E605B" strokeWidth="1" />}

        {/* face */}
        <path d="M54 76C54 56 66 46 80 46C96 46 106 58 106 78C106 98 96 116 80 116C64 116 54 98 54 76Z" fill={`url(#${id}-skin)`} />
        <path d="M96 60C104 72 104 94 94 106C100 96 101 78 96 60Z" fill="#8F8078" opacity="0.35" />
        {/* ears */}
        <path d="M54 80C49 78 48 88 54 92" fill="#C9BBB2" stroke="#8F8078" strokeWidth="0.8" />
        <path d="M106 80C111 78 112 88 106 92" fill="#B3A49B" stroke="#8F8078" strokeWidth="0.8" />
        {variant === 0 && <circle cx="105" cy="96" r="2.2" fill="none" stroke={INK} strokeWidth="1.1" />}

        {/* brows */}
        <path d="M62 72C66 69 71 69 75 71" fill="none" stroke={INK_SOFT} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M85 71C89 69 94 69 98 72" fill="none" stroke={INK_SOFT} strokeWidth="1.8" strokeLinecap="round" />
        {/* eyes */}
        {[69, 91].map((x) => (
          <g key={x}>
            <path d={`M${x - 6} 80C${x - 3} 76.6 ${x + 3} 76.6 ${x + 6} 80C${x + 3} 82.6 ${x - 3} 82.6 ${x - 6} 80Z`} fill="#F3ECE6" />
            <circle cx={x} cy="79.8" r="2.5" fill={INK} />
            <circle cx={x + 0.9} cy="78.9" r="0.7" fill="#fff" />
            <path d={`M${x - 6.5} 79.8C${x - 3} 76 ${x + 3} 76 ${x + 6.5} 79.4`} fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
          </g>
        ))}
        {variant === 1 && (
          <g fill="none" stroke={INK} strokeWidth="1.3">
            <circle cx="69" cy="80" r="8" />
            <circle cx="91" cy="80" r="8" />
            <path d="M77 79.5C79 78 81 78 83 79.5M61 79L55 77M99 79L105 77" />
          </g>
        )}
        {/* nose */}
        <path d="M81 82C81 88 79 94 76 97C78 99 82 99 85 97" fill="none" stroke="#7E6F68" strokeWidth="1.1" strokeLinecap="round" />
        {/* lips */}
        <path d="M72 104C76 102 78 101.5 80 102.5C82 101.5 84 102 88 104C84 106.5 76 106.5 72 104Z" fill="#6E605B" />
        <path d="M73 104.2C77 108.5 83 108.5 87 104.2C83 105.6 77 105.6 73 104.2Z" fill="#8F7F78" />
        <path d="M72 104C76 105.2 84 105.2 88 104" fill="none" stroke={INK_SOFT} strokeWidth="0.9" strokeLinecap="round" />
        <Hair variant={variant} back={false} />
      </g>

      <rect width="160" height="200" filter={`url(#${id}-grain)`} opacity="0.5" />
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

        <ul className="mt-14 grid gap-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-6">
          {TESTIMONIALS.map((item, i) => (
            <li key={item.id} className={clsx('max-w-[42ch]', offsets[i])} data-reveal style={{ '--d': `${i * 110}ms` } as CSSProperties}>
              <figure>
                <PersonaAvatar variant={item.avatar} className="h-auto w-36 sm:w-40" />
                <figcaption className="mono mt-7 text-[14px]">
                  <span className="font-medium text-ink">
                    {item.name}, {item.age}
                  </span>
                  <span className="text-ink-muted"> · {item.role[locale]}</span>
                </figcaption>
                <blockquote className="mono mt-6 text-ink">
                  <p>“{item.quote[locale]}”</p>
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
        {hasPlaceholderTestimonials() && (
          <p className="mono mt-16 text-[11px] text-ink-muted lg:mt-20">{content.people.caption}</p>
        )}
      </div>
    </section>
  );
}
