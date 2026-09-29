import { t, type Locale } from '@tonelle/shared';
import Image from 'next/image';
import { BeforeAfter, FitPill, SectionHeading, ShadeTube } from '@/components/ui';
import type { SiteContent } from '@/content';
import { landingSample } from './sample';

/** "Önce / Sonra" section modelled on the Aura tablet screen: story · slider · shade cards. */
export function TryOnSection({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { beforeAfter: copy, analyze } = content;
  const sample = landingSample(locale);

  return (
    <section id="try-on" aria-labelledby="try-on-title" className="scroll-mt-20 py-16 sm:py-24">
      <div className="shell">
        <SectionHeading id="try-on-title" eyebrow={copy.eyebrow} title={copy.title} />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)_1fr] lg:gap-12">
          <div className="order-2 lg:order-1" data-reveal>
            <h3 className="max-w-[18ch] text-[1.7rem] text-ink">{copy.storyTitle}</h3>
            {copy.body.map((p) => (
              <p key={p} className="mt-4 max-w-[46ch] text-[15px] text-muted">
                {p}
              </p>
            ))}
          </div>

          <div className="order-1 mx-auto w-full max-w-[420px] lg:order-2" data-reveal>
            <BeforeAfter
              className="aspect-[4/5] rounded-xl bg-mist shadow-lift"
              beforeLabel={t(locale, 'look.before')}
              afterLabel={t(locale, 'look.after')}
              sliderLabel={copy.sliderLabel}
              before={<Image src="/images/portrait-hero.jpg" alt={copy.beforeAlt} fill sizes="(min-width: 480px) 420px, 92vw" className="object-cover" />}
              after={<Image src="/images/portrait-after.jpg" alt={copy.afterAlt} fill sizes="(min-width: 480px) 420px, 92vw" className="object-cover" />}
            >
              <span className="float-chip pointer-events-none absolute right-3 bottom-3 rounded-pill px-2.5 py-1 text-[11px] font-semibold text-violet">
                ✦ {t(locale, 'common.aiGenerated')}
              </span>
            </BeforeAfter>
            <p className="mt-3 text-center text-[12px] text-muted">{t(locale, 'look.compareHint')}</p>
          </div>

          <div className="order-3" data-reveal>
            <h3 className="text-[1.7rem] text-ink">{copy.shadesTitle}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {sample.shades.map((shade) => (
                <li key={shade.hex} className="flex items-center gap-4 rounded-card bg-paper p-3 pr-4 shadow-soft ring-1 ring-line ring-inset">
                  <ShadeTube color={shade.hex} className="w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="serif text-[1.1rem] text-ink">{shade.label}</p>
                    <p className="text-[12px] text-muted">{shade.hex}</p>
                  </div>
                  <FitPill value={shade.fit} template={analyze.fitLabel} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] text-muted">{copy.aiNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
