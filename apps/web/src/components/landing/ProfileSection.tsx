import type { Locale } from '@tonelle/shared';
import { Check } from 'lucide-react';
import { Eyebrow, ProfileBars, Radar } from '@/components/ui';
import type { SiteContent } from '@/content';
import { landingSample } from './sample';

/** Colour-profile section: lavender band, radar + bars + palette in a white card. */
export function ProfileSection({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { profile } = content;
  const sample = landingSample(locale);

  return (
    <section id="profile" aria-labelledby="profile-title" className="scroll-mt-20 bg-board py-16 sm:py-24">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div data-reveal>
          <Eyebrow tone="paper">{profile.eyebrow}</Eyebrow>
          <h2 id="profile-title" className="mt-5 max-w-[16ch] text-[clamp(1.9rem,6.4vw,3.1rem)] text-ink">
            {profile.title}
          </h2>
          <p className="mt-5 max-w-[52ch] text-[15.5px] text-muted">{profile.body}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {profile.points.map((point) => (
              <li key={point} className="flex gap-3 text-[14.5px] text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-paper text-violet">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-paper p-4 shadow-lift sm:p-6" data-reveal>
          <div className="rounded-panel bg-[linear-gradient(160deg,#F8E4D8,#EFD8E6_60%,#E6E0FA)] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="caps rounded-pill bg-paper/80 px-2.5 py-1 text-ink">{profile.seasonLabel}</span>
              <span className="text-[11.5px] font-medium text-muted">{profile.sampleNote}</span>
            </div>
            <p className="serif mt-3 text-[clamp(1.8rem,7vw,2.3rem)] leading-none text-ink">{sample.seasonName}</p>
            <div aria-label={profile.paletteTitle} role="img" className="mt-4 flex gap-1.5">
              {sample.palette.map((c) => (
                <i key={c} className="block h-8 flex-1 rounded-[9px]" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="mt-2 grid items-center gap-4 sm:grid-cols-[1.1fr_1fr]">
            <Radar axes={sample.axes} label={profile.radarTitle} className="mx-auto max-w-[340px]" />
            <ProfileBars items={sample.bars} className="px-2 pb-4 sm:px-0 sm:pb-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
