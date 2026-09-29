import { LOOK_LIST, localized, t, type Locale } from '@tonelle/shared';
import { ArrowRight } from 'lucide-react';
import { ButtonLink, Chip } from '@/components/ui';
import type { SiteContent } from '@/content';
import { LOOK_VISUALS } from './look-visuals';
import { Section } from './Section';

export function LooksGallery({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <Section id="looks" title={content.looks.title} subtitle={content.looks.subtitle} className="bg-surface-sunken/50">
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {LOOK_LIST.map((look) => {
          const v = LOOK_VISUALS[look.id];
          return (
            <li
              key={look.id}
              className="w-[78%] shrink-0 snap-center overflow-hidden rounded-card border border-border/70 bg-surface-raised shadow-soft sm:w-auto"
            >
              <div aria-hidden className="relative h-36" style={{ backgroundColor: v.bg }}>
                <span
                  className="absolute top-6 left-6 size-16 rounded-full opacity-90 blur-[1px]"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${v.eye}, ${v.eye}cc 60%, transparent 72%)` }}
                />
                <span
                  className="absolute top-12 left-24 size-20 rounded-full opacity-70 blur-md"
                  style={{ backgroundColor: v.cheek }}
                />
                <span
                  className="absolute right-6 bottom-6 h-9 w-20 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] shadow-soft"
                  style={{ backgroundColor: v.lip }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg text-ink">{localized(look.name, locale)}</h3>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                  {localized(look.description, locale)}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {look.occasions.slice(0, 2).map((o) => (
                    <Chip key={o} size="sm">
                      {t(locale, `look.occasionTag.${o}`)}
                    </Chip>
                  ))}
                  <Chip size="sm" tone="accent">
                    {t(locale, `look.intensity.${look.intensity}`)}
                  </Chip>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 text-center">
        <ButtonLink href={`/${locale}/analyze`} variant="secondary" icon={<ArrowRight aria-hidden className="order-last size-4" />}>
          {content.looks.cta}
        </ButtonLink>
      </div>
    </Section>
  );
}
