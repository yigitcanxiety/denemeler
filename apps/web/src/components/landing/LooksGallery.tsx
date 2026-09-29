import { LOOKS, LOOK_IDS, localized, t, type Locale, type LookId } from '@tonelle/shared';
import Image from 'next/image';
import { ButtonLink, SectionHeading, delay } from '@/components/ui';
import type { SiteContent } from '@/content';
import { LOOK_VISUALS } from './look-visuals';

/** Featured looks, each paired with the portrait that fits it best. */
const FEATURED: { id: LookId; src: string }[] = [
  { id: 'soft_glam', src: '/images/portrait-3.jpg' },
  { id: 'no_makeup_makeup', src: '/images/portrait-hero.jpg' },
  { id: 'office_chic', src: '/images/portrait-2.jpg' },
];

/** Looks gallery: portrait cards with the look name and its colour trio, then the other looks as chips. */
export function LooksGallery({ locale, content }: { locale: Locale; content: SiteContent }) {
  const rest = LOOK_IDS.filter((id) => !FEATURED.some((f) => f.id === id));
  return (
    <section id="looks" aria-labelledby="looks-title" className="scroll-mt-20 py-16 sm:py-24">
      <div className="shell">
        <SectionHeading id="looks-title" eyebrow={content.looks.eyebrow} title={content.looks.title} lead={content.looks.subtitle} />
        <ul className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
          {FEATURED.map(({ id, src }, i) => {
            const look = LOOKS[id];
            const v = LOOK_VISUALS[id];
            return (
              <li key={id} className="w-[72%] shrink-0 snap-start sm:w-auto" data-reveal style={delay(i * 90)}>
                <article className="group relative aspect-[3/4] overflow-hidden rounded-panel bg-mist">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 72vw"
                    className="object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                  <div className="float-chip absolute inset-x-3 bottom-3 p-3.5">
                    <h3 className="text-[1.25rem] text-ink">{localized(look.name, locale)}</h3>
                    <p className="mt-1 line-clamp-2 text-[12.5px] text-muted">{localized(look.description, locale)}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="rounded-pill bg-rose-soft px-2 py-0.5 text-[11px] font-bold text-rose-ink">{t(locale, `look.intensity.${look.intensity}`)}</span>
                      <span aria-hidden className="flex shrink-0 -space-x-1">
                        {[v.eye, v.cheek, v.lip].map((c) => (
                          <i key={c} className="block size-4 rounded-full ring-2 ring-white" style={{ backgroundColor: c }} />
                        ))}
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <ul className="mt-6 flex flex-wrap justify-center gap-2" data-reveal>
          {rest.map((id) => (
            <li key={id} className="inline-flex items-center gap-2 rounded-pill bg-mist py-1.5 pr-3.5 pl-2 text-[13px] font-semibold text-ink ring-1 ring-line ring-inset">
              <span aria-hidden className="block size-4 rounded-full" style={{ backgroundColor: LOOK_VISUALS[id].lip }} />
              {localized(LOOKS[id].name, locale)}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={`/${locale}/analyze`} variant="secondary" size="lg" icon={<span aria-hidden>✦</span>}>
            {content.looks.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
