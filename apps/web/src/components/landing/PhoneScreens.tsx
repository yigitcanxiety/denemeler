import { LOOKS, SEASONS, localized, t, type Locale } from '@tonelle/shared';
import type { ReactNode } from 'react';
import { AccentTag, PaletteBar } from '@/components/lab/primitives';
import { LANDING_IMAGES } from '@/config/company';
import { FaceIllustration } from './FaceIllustration';

/* All sizes inside the phone are in container-query units (cqw) so the mock scales cleanly. */

function ScreenTop({ title, chip }: { title: string; chip: string }) {
  return (
    <div className="flex items-end justify-between px-[6cqw] pt-[15cqw]">
      <div>
        <p className="font-sans text-[3.4cqw] text-ink-muted">Tonelle</p>
        <p className="mt-[0.6cqw] font-sans text-[8.4cqw] leading-none font-semibold tracking-[-0.05em] text-ink">{title}</p>
      </div>
      <span className="rounded-[1.6cqw] bg-accent-soft px-[2cqw] py-[1cqw] font-mono text-[2.8cqw] text-ink">{chip}</span>
    </div>
  );
}

function Photo({ variant }: { variant: 'bare' | 'makeup' }) {
  const src = variant === 'bare' ? LANDING_IMAGES.before : LANDING_IMAGES.after;
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- optional static marketing image
    <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
  ) : (
    <FaceIllustration variant={variant} id={`phone-${variant}`} className="absolute inset-x-0 bottom-0 h-[94%] w-full" />
  );
}

function Ticks() {
  const tick = 'absolute size-[5cqw] border-accent';
  return (
    <span aria-hidden>
      <span className={`${tick} top-[3cqw] left-[3cqw] border-t-[0.6cqw] border-l-[0.6cqw]`} />
      <span className={`${tick} top-[3cqw] right-[3cqw] border-t-[0.6cqw] border-r-[0.6cqw]`} />
      <span className={`${tick} bottom-[3cqw] left-[3cqw] border-b-[0.6cqw] border-l-[0.6cqw]`} />
      <span className={`${tick} right-[3cqw] bottom-[3cqw] border-r-[0.6cqw] border-b-[0.6cqw]`} />
    </span>
  );
}

function PhotoFrame({ children, variant }: { children?: ReactNode; variant: 'bare' | 'makeup' }) {
  return (
    <div className="relative mx-[6cqw] mt-[5cqw] aspect-[4/5] overflow-hidden rounded-[6cqw] bg-[radial-gradient(120%_80%_at_50%_0%,#f4ece6,#e3d6cc_60%,#d7c6ba)]">
      <Photo variant={variant} />
      {children}
    </div>
  );
}

export function phoneScreens(locale: Locale, titles: string[]): ReactNode[] {
  const season = SEASONS.soft_autumn;
  const look = LOOKS.natural_glow;
  return [
    // 0 — selfie
    <div key="selfie" className="absolute inset-0">
      <ScreenTop title={titles[0] ?? ''} chip="1/4" />
      <PhotoFrame variant="bare">
        <svg aria-hidden viewBox="0 0 100 125" className="absolute inset-0 size-full">
          <ellipse cx="50" cy="56" rx="29" ry="39" fill="none" stroke="white" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M50 10V20M50 92V102M14 56H24M76 56H86" stroke="white" strokeWidth="0.5" />
        </svg>
        <Ticks />
      </PhotoFrame>
      <div className="mt-[6cqw] flex items-center justify-center">
        <span className="grid size-[16cqw] place-items-center rounded-full border-[0.8cqw] border-ink">
          <span className="size-[12cqw] rounded-full bg-accent" />
        </span>
      </div>
    </div>,
    // 1 — scan
    <div key="scan" className="absolute inset-0">
      <ScreenTop title={titles[1] ?? ''} chip="2/4" />
      <PhotoFrame variant="bare">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.18)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.18)_1px,transparent_1px)] bg-[size:12%_10%]" />
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div className="scanline h-full w-full">
            <div className="h-[0.5cqw] w-full bg-accent" />
            <div className="h-[10cqw] w-full bg-gradient-to-b from-accent/25 to-transparent" />
          </div>
        </div>
        <span className="absolute top-[44%] left-1/2 -translate-x-1/2 origin-center scale-[0.8]">
          <AccentTag blink>{t(locale, 'analyzing.stepUndertone').split(' ').slice(0, 2).join(' ')}</AccentTag>
        </span>
      </PhotoFrame>
      <div className="mx-[6cqw] mt-[5cqw] flex items-end justify-between">
        <div className="font-mono text-[2.8cqw] leading-[1.5] text-ink-muted">
          <p>✓ {t(locale, 'analyzing.stepFace')}</p>
          <p className="text-ink">› {t(locale, 'analyzing.stepUndertone')}</p>
        </div>
        <span className="font-sans text-[9cqw] leading-none font-light tracking-[-0.05em] text-ink tabular-nums">
          <span className="opacity-35">0</span>64%
        </span>
      </div>
    </div>,
    // 2 — season (mini BRIK stack)
    <div key="season" className="absolute inset-0 bg-paper-raised">
      <div className="mt-[14cqw] flex flex-col gap-[2.2cqw] px-[4cqw] [--neck-gap:2.2cqw] [--neck-inset:5.5cqw]">
        <div className="ink-card rounded-[5cqw] p-[5cqw]">
          <p className="font-mono text-[2.6cqw] tracking-[0.06em] text-ink-inverse-muted uppercase">{t(locale, 'results.yourSeason')}</p>
          <p className="mt-[2cqw] font-sans text-[10cqw] leading-[0.92] font-semibold tracking-[-0.05em]">{localized(season.name, locale)}</p>
          <span className="mt-[3cqw] inline-block rounded-[1.4cqw] bg-accent-soft px-[2cqw] py-[0.8cqw] font-mono text-[2.6cqw] text-ink">
            {t(locale, 'results.confidence', { percent: 86 })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[2.2cqw]">
          <div className="ink-card neck-top rounded-[5cqw] p-[4cqw]">
            <p className="font-sans text-[3.2cqw] text-ink-inverse-muted">{t(locale, 'results.undertoneTitle')}</p>
            <p className="mt-[2cqw] font-sans text-[7cqw] leading-none font-light">{t(locale, 'results.undertone.warm')}</p>
          </div>
          <div className="ink-card neck-left rounded-[5cqw] p-[4cqw]">
            <p className="font-sans text-[3.2cqw] text-ink-inverse-muted">{t(locale, 'results.contrastTitle')}</p>
            <p className="mt-[2cqw] font-sans text-[7cqw] leading-none font-light">{t(locale, 'results.contrast.low')}</p>
          </div>
        </div>
        <div className="ink-card neck-top rounded-[5cqw] p-[4cqw]">
          <p className="font-sans text-[3.2cqw] text-ink-inverse-muted">{t(locale, 'results.bestColors')}</p>
          <PaletteBar colors={season.palette} className="mt-[3cqw] rounded-[2cqw]" height="h-[9cqw]" />
        </div>
      </div>
    </div>,
    // 3 — look on face
    <div key="look" className="absolute inset-0">
      <ScreenTop title={localized(look.name, locale)} chip="AI" />
      <PhotoFrame variant="makeup">
        <span className="absolute bottom-[3cqw] left-[3cqw] rounded-[1.4cqw] bg-ink/85 px-[2cqw] py-[1cqw] font-mono text-[2.6cqw] text-ink-inverse">
          {t(locale, 'common.aiGenerated')}
        </span>
      </PhotoFrame>
      <div className="mx-[6cqw] mt-[5cqw]">
        <p className="font-mono text-[2.8cqw] text-ink-muted">{t(locale, 'look.shadesTitle')}</p>
        <PaletteBar colors={['#C27C6B', '#DC8A8F', '#B5838D', '#A0785A']} className="mt-[2cqw] rounded-[2cqw]" height="h-[8cqw]" />
      </div>
    </div>,
  ];
}
