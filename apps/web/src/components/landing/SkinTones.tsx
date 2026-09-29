import { SEASON_LIST, SKIN_DEPTHS, UNDERTONES, localized, t, type Locale } from '@tonelle/shared';
import { Check } from 'lucide-react';
import type { SiteContent } from '@/content';

/** Representative, illustrative skin-depth swatches (fair → deep, warm/olive leaning). */
const DEPTH_SWATCHES = ['#F3D9C6', '#E9C2A6', '#DAA888', '#C68E6B', '#A66F4F', '#6E4631'];

export function SkinTones({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { tones } = content;
  return (
    <section aria-labelledby="tones-title" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent">{tones.eyebrow}</p>
          <h2 id="tones-title" className="mt-2 text-3xl leading-tight text-ink sm:text-[2.6rem]">
            {tones.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{tones.body}</p>
          <ul className="mt-6 space-y-3">
            {tones.points.map((p) => (
              <li key={p} className="flex gap-3 text-ink">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check aria-hidden className="size-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card border border-border/70 bg-surface-raised p-5 shadow-card sm:p-7">
          <p className="text-sm font-semibold text-ink">{t(locale, 'results.skinDepthTitle')}</p>
          <ul className="mt-3 grid grid-cols-6 gap-1.5">
            {SKIN_DEPTHS.map((depth, i) => (
              <li key={depth} className="flex flex-col items-center gap-1.5">
                <span aria-hidden className="h-12 w-full rounded-lg ring-1 ring-black/5" style={{ backgroundColor: DEPTH_SWATCHES[i] }} />
                <span className="text-center text-[0.65rem] leading-tight text-ink-muted sm:text-xs">
                  {t(locale, `results.skinDepth.${depth}`)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-semibold text-ink">{t(locale, 'results.undertoneTitle')}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {UNDERTONES.map((u) => (
              <li
                key={u}
                className={
                  u === 'olive'
                    ? 'rounded-pill bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-contrast'
                    : 'rounded-pill bg-surface-sunken px-3.5 py-1.5 text-sm text-ink'
                }
              >
                {t(locale, `results.undertone.${u}`)}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-semibold text-ink">{tones.seasonsTitle}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SEASON_LIST.map((s) => (
              <li key={s.id} className="flex items-center gap-2 rounded-lg bg-surface-sunken/70 px-2.5 py-2">
                <span aria-hidden className="flex -space-x-1">
                  {s.palette.slice(0, 3).map((c) => (
                    <span key={c} className="size-3.5 rounded-full ring-2 ring-surface-raised" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="truncate text-xs text-ink sm:text-sm">{localized(s.name, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
