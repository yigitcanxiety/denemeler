import { LOOK_LIST, localized, t, type Locale } from '@tonelle/shared';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { HeatFace } from '@/components/lab/HeatFace';
import { Chip, InkCard, NumberTag, PaletteBar } from '@/components/lab/primitives';
import type { SiteContent } from '@/content';
import { heatFrom } from '@/lib/heat';
import { LOOK_VISUALS } from './look-visuals';

/** Looks catalogue: horizontal snap-scroll of dark BRIK cards joined by notch necks. */
export function LooksGallery({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section id="looks" aria-labelledby="looks-title" className="relative overflow-hidden border-t border-line-strong py-20 sm:py-28">
      <div className="shell grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="mono-caps text-ink-muted" data-reveal>
            /{String(LOOK_LIST.length).padStart(2, '0')} {content.nav.looks}
          </p>
          <h2 id="looks-title" className="mt-3 text-[clamp(2.2rem,7vw,4.8rem)] text-ink" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
            {content.looks.title}
          </h2>
        </div>
        <div className="lg:col-span-4 lg:col-start-9" data-reveal style={{ '--d': '160ms' } as CSSProperties}>
          <p className="mono text-ink-muted">{content.looks.subtitle}</p>
          <Link
            href={`/${locale}/analyze`}
            className="press mt-5 inline-flex h-12 items-center gap-3 rounded-pill px-5 font-medium text-ink ring-1 ring-ink hover:bg-ink hover:text-ink-inverse"
          >
            {content.looks.cta}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>

      <ul
        className="mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:mt-14 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        aria-label={content.looks.title}
      >
        {LOOK_LIST.map((look, i) => {
          const v = LOOK_VISUALS[look.id];
          return (
            <li key={look.id} className="w-[78vw] max-w-[340px] shrink-0 snap-start" data-reveal style={{ '--d': `${Math.min(i, 4) * 70}ms` } as CSSProperties}>
              <article className="flex flex-col gap-[10px]">
                <InkCard padding="none" className="relative h-[270px] overflow-hidden">
                  <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                    <NumberTag n={i + 1} tone="light" />
                    <Chip tone="soft">AI</Chip>
                  </div>
                  <HeatFace
                    id={`look-${look.id}`}
                    palette={heatFrom([v.lip, v.cheek, v.eye])}
                    tone="night"
                    showBody={false}
                    animated={false}
                    className="absolute inset-x-0 top-10 mx-auto h-[250px] w-auto"
                  />
                </InkCard>
                <InkCard neck="top" padding="md">
                  <h3 className="text-[1.6rem] leading-none tracking-[-0.045em]">{localized(look.name, locale)}</h3>
                  <p className="mono mt-3 line-clamp-3 min-h-[3lh] text-[12.5px] text-ink-inverse-muted">{localized(look.description, locale)}</p>
                  <PaletteBar colors={[v.eye, v.cheek, v.lip]} height="h-3" className="mt-5 rounded-[4px]" />
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {look.occasions.slice(0, 2).map((o) => (
                      <Chip key={o} tone="line" className="text-ink-inverse-muted">
                        {t(locale, `look.occasionTag.${o}`)}
                      </Chip>
                    ))}
                    <Chip tone="soft">{t(locale, `look.intensity.${look.intensity}`)}</Chip>
                  </div>
                </InkCard>
              </article>
            </li>
          );
        })}
        <li aria-hidden className="w-1 shrink-0" />
      </ul>
    </section>
  );
}
