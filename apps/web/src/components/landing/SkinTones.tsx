import { SEASON_LIST, SKIN_DEPTHS, UNDERTONES, localized, t, type Locale } from '@tonelle/shared';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { HeatFace } from '@/components/lab/HeatFace';
import { ConstructionGrid, NumberTag } from '@/components/lab/primitives';
import { Sunburst } from '@/components/lab/Sunburst';
import type { SiteContent } from '@/content';

/** Representative, illustrative skin-depth swatches (fair → deep, warm/olive leaning). */
const DEPTH_SWATCHES = ['#F3D9C6', '#E9C2A6', '#DAA888', '#C68E6B', '#A66F4F', '#6E4631'];

/** "Made for Mediterranean skin tones": the 12 seasons as a sunburst around the face. */
export function SkinTones({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { tones } = content;
  const ring = SEASON_LIST.map((s, i) => ({ text: localized(s.name, locale), angle: i * 30 + 15, colors: s.palette }));
  const families = content.preloader.seasons.map((text, i) => ({ text, angle: i * 90 }));

  return (
    <section aria-labelledby="tones-title" className="relative overflow-hidden border-t border-line-strong py-20 sm:py-28">
      <ConstructionGrid rows={['96px']} />
      <div className="shell relative">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="mono-caps text-ink-muted lg:col-span-3" data-reveal>
            /{tones.eyebrow}
          </p>
          <h2 id="tones-title" className="text-[clamp(2.2rem,7vw,4.8rem)] text-ink lg:col-span-9" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
            {tones.title}
          </h2>
        </div>

        {/* Mobile: 4 family labels; desktop: all 12 seasons around the burst. */}
        <div className="relative mx-auto mt-10 w-full max-w-[560px] px-6 sm:px-14 lg:hidden">
          <Sunburst labels={families} inner={36}>
            <div className="grid size-full place-items-center">
              <HeatFace id="tones-face-m" showBody={false} className="h-[92%] w-auto" />
            </div>
          </Sunburst>
        </div>
        <div className="relative mx-auto mt-16 hidden w-[min(62vw,760px)] lg:block">
          <Sunburst labels={ring} inner={34} axisMarkers={false} lines={96}>
            <div className="grid size-full place-items-center">
              <HeatFace id="tones-face" showBody={false} className="h-[92%] w-auto" />
            </div>
          </Sunburst>
        </div>

        <p className="mono-caps mt-10 text-ink-muted lg:hidden">{tones.seasonsTitle}</p>
        <ul className="mt-3 grid grid-cols-2 gap-px border border-line-strong bg-line-strong sm:grid-cols-3 lg:hidden">
          {SEASON_LIST.map((s) => (
            <li key={s.id} className="flex items-center gap-2 bg-paper px-3 py-2.5">
              <span aria-hidden className="flex -space-x-1">
                {s.palette.slice(0, 3).map((c) => (
                  <span key={c} className="size-3 rounded-full ring-1 ring-paper" style={{ backgroundColor: c }} />
                ))}
              </span>
              <span className="mono truncate text-[12px] text-ink">{localized(s.name, locale)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="mono max-w-[46ch] text-ink">{tones.body}</p>
            <ol className="mt-6 space-y-3">
              {tones.points.map((p, i) => (
                <li key={p} className="flex gap-3">
                  <NumberTag n={i + 1} />
                  <span className="mono pt-1 text-ink-muted">{p}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-8 lg:col-span-6 lg:col-start-7" data-reveal style={{ '--d': '120ms' } as CSSProperties}>
            <div>
              <p className="mono-caps text-ink-muted">{t(locale, 'results.skinDepthTitle')}</p>
              <ul className="mt-3 grid grid-cols-6 gap-[3px]">
                {SKIN_DEPTHS.map((depth, i) => (
                  <li key={depth} className="flex flex-col gap-2">
                    <span
                      aria-hidden
                      className={clsx('h-14 w-full', i === 0 && 'rounded-l-[10px]', i === SKIN_DEPTHS.length - 1 && 'rounded-r-[10px]')}
                      style={{ backgroundColor: DEPTH_SWATCHES[i] }}
                    />
                    <span className="mono text-[10.5px] leading-tight text-ink-muted sm:text-[12px]">
                      {t(locale, `results.skinDepth.${depth}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono-caps text-ink-muted">{t(locale, 'results.undertoneTitle')}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {UNDERTONES.map((u) => (
                  <li
                    key={u}
                    className={clsx(
                      'mono flex h-9 items-center rounded-pill px-4',
                      u === 'olive' ? 'bg-ink text-ink-inverse' : 'text-ink ring-1 ring-line-strong',
                    )}
                  >
                    {u === 'olive' && <span aria-hidden className="mr-2 size-1.5 rounded-full bg-accent" />}
                    {t(locale, `results.undertone.${u}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
