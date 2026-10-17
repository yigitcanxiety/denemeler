import { SEASONS, localized, t, type CoreLocale } from '@tonelle/shared';
import Image from 'next/image';
import { AppStoreCta } from '@/components/site/AppStoreCta';
import { BeforeAfter, Eyebrow, delay } from '@/components/ui';
import type { SiteContent } from '@/content';

/** Face-mesh dots over the portrait: the "analysis" layer of the slider (decorative). */
function MeshDots() {
  const dots: [number, number][] = [
    [50, 33],
    [39, 47],
    [61, 47],
    [33, 58],
    [67, 58],
    [50, 56],
    [43, 66],
    [57, 66],
    [50, 75],
  ];
  return (
    <svg aria-hidden viewBox="0 0 100 125" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
      <g stroke="rgb(255 255 255 / 0.4)" strokeWidth="0.2" fill="none">
        <path d="M39 47 50 56 61 47M43 66 50 56 57 66M50 33 50 56" />
      </g>
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="rgb(255 255 255 / 0.95)" />
      ))}
    </svg>
  );
}

/**
 * Hero: copy + CTA, then a selfie ↔ analysis slider. There is no same-person makeup pair in the
 * repo, so the "after" layer is the same portrait with the analysis chips (undertone, season).
 * Values are an illustrative sample (Soft Autumn), flagged as such in the hint line.
 */
export function Hero({ locale, content }: { locale: CoreLocale; content: SiteContent }) {
  const { hero, stores } = content;
  const season = SEASONS.soft_autumn;
  const sizes = '(min-width: 1024px) 440px, (min-width: 480px) 440px, 92vw';

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_15%_0%,#EDE8FF_0%,rgb(237_232_255/0)_100%),radial-gradient(50%_40%_at_95%_55%,#F3EEFF_0%,rgb(243_238_255/0)_100%)]"
      />
      <div className="shell relative grid items-center gap-9 pt-8 pb-12 sm:pt-12 lg:grid-cols-[1.05fr_minmax(0,440px)] lg:gap-16 lg:pt-16 lg:pb-20">
        <div className="flex flex-col items-start">
          <Eyebrow className="enter" tone="paper">
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" className="enter mt-4 max-w-[16ch] text-[clamp(2.2rem,9.4vw,4.4rem)] leading-[1.02] text-ink" style={delay(60)}>
            {hero.title}
          </h1>
          <p className="enter mt-4 max-w-[46ch] text-[15.5px] text-muted sm:text-[17px]" style={delay(120)}>
            {hero.subtitle}
          </p>
          <div className="enter mt-6 w-full sm:w-auto" style={delay(180)}>
            <AppStoreCta labels={stores} className="max-sm:w-full" />
          </div>
          <p className="enter mt-3 text-[12.5px] text-muted" style={delay(220)}>
            {hero.ctaNote}
          </p>
        </div>

        <figure className="enter relative mx-auto w-full max-w-[440px]" style={delay(200)}>
          <div aria-hidden className="absolute -inset-5 -z-10 rounded-[40px] bg-violet-soft/70 blur-2xl" />
          <BeforeAfter
            className="aspect-[4/5] rounded-xl bg-mist shadow-lift ring-1 ring-white/60"
            beforeLabel={hero.sliderBefore}
            afterLabel={hero.sliderAfter}
            sliderLabel={hero.sliderLabel}
            before={<Image src="/images/portrait-hero.jpg" alt={hero.beforeAlt} fill priority sizes={sizes} className="object-cover" />}
            after={
              <>
                <Image src="/images/portrait-hero.jpg" alt={hero.afterAlt} fill priority sizes={sizes} className="object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-violet/25 via-transparent to-violet/10" />
                <MeshDots />
                <div className="float-chip absolute top-14 right-3 flex flex-col gap-0.5 px-3 py-2">
                  <span className="text-[10.5px] text-muted">{hero.undertoneChip}</span>
                  <b className="text-[12.5px] font-semibold text-ink">{t(locale, 'results.undertone.warm')}</b>
                </div>
                <div className="float-chip absolute right-3 bottom-4 flex flex-col gap-0.5 px-3 py-2">
                  <span className="text-[10.5px] text-muted">{hero.seasonChip}</span>
                  <b className="serif text-[15px] font-normal text-ink">{localized(season.name, locale)}</b>
                  <span aria-hidden className="mt-1 flex gap-0.5">
                    {season.palette.slice(0, 5).map((c) => (
                      <i key={c} className="block size-3 rounded-[4px]" style={{ backgroundColor: c }} />
                    ))}
                  </span>
                </div>
              </>
            }
          />
          <figcaption className="mt-3 text-center text-[12px] text-muted">{hero.sliderHint}</figcaption>
        </figure>
      </div>
    </section>
  );
}
