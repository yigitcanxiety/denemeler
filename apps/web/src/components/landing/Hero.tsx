import type { Locale } from '@tonelle/shared';
import { Check, Palette, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { StoreBadges } from '@/components/site/StoreBadges';
import { ButtonLink, Eyebrow, FitPill, MiniRing, ShadeTube, delay } from '@/components/ui';
import type { SiteContent } from '@/content';
import { landingSample } from './sample';

/** Face-mesh dots over the hero portrait (decorative, like Aura's scan points). */
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
      <g stroke="rgb(255 255 255 / 0.32)" strokeWidth="0.2" fill="none">
        <path d="M39 47 50 56 61 47M43 66 50 56 57 66M50 33 50 56" />
      </g>
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="rgb(255 255 255 / 0.9)" />
      ))}
    </svg>
  );
}

export function Hero({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { hero, analyze } = content;
  const sample = landingSample(locale);
  const lip = sample.shades[0]!;

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,#EFEBFD_0%,rgba(255,255,255,0)_100%)]" />
      <div className="shell relative pt-10 pb-6 sm:pt-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow className="enter" tone="paper">
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" className="enter mt-5 text-[clamp(2.3rem,8.6vw,4rem)] leading-[1.02] text-ink" style={delay(60)}>
            {hero.title}
          </h1>
          <p className="enter mt-5 max-w-[52ch] text-[15.5px] text-muted sm:text-[16.5px]" style={delay(120)}>
            {hero.subtitle}
          </p>
          <div className="enter mt-7 flex flex-wrap items-center justify-center gap-3" style={delay(180)}>
            <ButtonLink href={`/${locale}/analyze`} size="lg" icon={<span aria-hidden>✦</span>}>
              {hero.cta}
            </ButtonLink>
            <StoreBadges labels={content.stores} />
          </div>
          <p className="enter mt-3 text-[12.5px] text-muted" style={delay(220)}>
            {hero.ctaNote}
          </p>
          <p className="enter mt-2 flex flex-wrap items-center justify-center gap-x-1 text-[13.5px] text-muted" style={delay(240)}>
            {hero.modesLabel}
            <Link href={`/${locale}/analyze/color`} className="inline-flex min-h-9 items-center px-1 font-semibold text-violet hover:underline">
              {hero.colorOnly}
            </Link>
            ·
            <Link href={`/${locale}/analyze/skin`} className="inline-flex min-h-9 items-center px-1 font-semibold text-violet hover:underline">
              {hero.skinOnly}
            </Link>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-center gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-[1fr_minmax(0,410px)_1fr] lg:gap-10">
          {/* Portrait with floating data chips */}
          <figure className="enter relative col-span-2 mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-xl bg-mist shadow-lift lg:max-w-[410px] lg:order-2 lg:col-span-1" style={delay(200)}>
            <Image
              src="/images/portrait-hero.jpg"
              alt={hero.portraitAlt}
              fill
              priority
              sizes="(min-width: 1024px) 440px, (min-width: 480px) 440px, 92vw"
              className="object-cover"
            />
            <MeshDots />
            <div className="float-chip absolute top-4 left-3 flex flex-col gap-1 px-3 py-2 sm:left-4">
              <span className="text-[10.5px] text-muted">{hero.undertoneChip}</span>
              <b className="text-[12.5px] font-semibold text-ink">{sample.undertone}</b>
              <span className="w-max rounded-pill bg-mint px-1.5 py-0.5 text-[10px] font-bold text-mint-ink">{sample.confidence}</span>
            </div>
            <div className="float-chip absolute top-[38%] right-3 flex flex-col gap-0.5 px-3 py-2 sm:right-4">
              <span className="text-[10.5px] text-muted">{hero.seasonChip}</span>
              <b className="serif text-[15px] font-normal text-ink">{sample.seasonName}</b>
              <span aria-hidden className="mt-1 flex gap-0.5">
                {sample.palette.slice(0, 5).map((c) => (
                  <i key={c} className="block size-3 rounded-[4px]" style={{ backgroundColor: c }} />
                ))}
              </span>
            </div>
            <div className="float-chip absolute bottom-4 left-3 flex items-center gap-2 py-1.5 pr-3 pl-1.5 sm:left-4">
              <MiniRing value={lip.fit} />
              <span className="flex flex-col leading-tight">
                <span className="text-[10.5px] text-muted">{hero.fitChip}</span>
                <b className="text-[12px] font-semibold text-ink">{hero.makeupCard.shade}</b>
              </span>
            </div>
            <span className="violet-gradient serif absolute right-3 bottom-4 inline-flex h-10 items-center gap-1.5 rounded-pill px-4 text-[17px] text-white shadow-violet sm:right-4">
              <span aria-hidden className="text-[13px]">
                ✦
              </span>
              Tonelle
            </span>
          </figure>

          {/* Feature cards: left and right of the portrait on desktop, a pair below it on mobile */}
          <div className="enter flex h-full flex-col gap-3 rounded-card bg-violet-soft p-4 sm:p-6 lg:order-1 lg:h-auto lg:self-center" style={delay(260)}>
            <span className="grid size-10 place-items-center rounded-[12px] bg-paper text-violet">
              <Palette aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <h2 className="text-[1.3rem] text-ink sm:text-[1.6rem]">{hero.colorCard.title}</h2>
            <p className="text-[13px] text-muted sm:text-[14px]">{hero.colorCard.body}</p>
            <div className="mt-auto hidden rounded-[14px] bg-paper p-3 sm:block">
              <p className="text-[11px] text-muted">{hero.seasonChip}</p>
              <p className="serif mt-0.5 text-[1.15rem] text-ink">{sample.seasonName}</p>
              <div aria-hidden className="mt-2 flex gap-1">
                {sample.palette.map((c) => (
                  <i key={c} className="block h-5 flex-1 rounded-[6px]" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>

          <div className="enter flex h-full flex-col gap-3 rounded-card bg-rose-soft p-4 sm:p-6 lg:order-3 lg:h-auto lg:self-center" style={delay(300)}>
            <span className="grid size-10 place-items-center rounded-[12px] bg-paper text-rose">
              <WandSparkles aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <h2 className="text-[1.3rem] text-ink sm:text-[1.6rem]">{hero.makeupCard.title}</h2>
            <p className="text-[13px] text-muted sm:text-[14px]">{hero.makeupCard.body}</p>
            <div className="mt-auto hidden items-center gap-3 rounded-[14px] bg-paper p-3 sm:flex">
              <ShadeTube color={lip.hex} className="w-14 shrink-0" />
              <div className="min-w-0">
                <FitPill value={lip.fit} template={analyze.fitLabel} />
                <p className="mt-1.5 text-[13px] font-semibold text-ink">{hero.makeupCard.shade}</p>
                <p className="text-[11.5px] text-muted">{lip.hex}</p>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {hero.trustPoints.map((point) => (
            <li key={point} className="inline-flex items-center gap-1.5 rounded-pill bg-mist px-3 py-1.5 text-[12.5px] font-medium text-ink">
              <Check aria-hidden className="size-3.5 text-violet" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div id="hero-end" aria-hidden />
    </section>
  );
}
