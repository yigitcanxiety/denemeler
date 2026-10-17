'use client';

import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export interface MarqueeLook {
  id: string;
  src: string;
  name: string;
}

/**
 * Seamless looks strip: the list is rendered twice and the track slides by -50 %. Pauses on
 * hover and with the button (WCAG 2.2.2); with prefers-reduced-motion it is a static, scrollable
 * row (see `.marquee` in globals.css). The duplicate set is hidden from assistive tech.
 */
export function LooksMarquee({ looks, pauseLabel, playLabel }: { looks: MarqueeLook[]; pauseLabel: string; playLabel: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="marquee flex flex-col" data-paused={paused || undefined}>
      <div className="marquee-viewport no-scrollbar">
        <div className="marquee-track">
          {[false, true].map((dup) => (
            <ul key={String(dup)} className="marquee-set flex" aria-hidden={dup || undefined} data-dup={dup || undefined}>
              {looks.map((look) => (
                <li key={look.id} className="relative mr-3 aspect-[3/4] w-[148px] shrink-0 overflow-hidden rounded-panel bg-mist shadow-soft sm:w-[196px]">
                  <Image src={look.src} alt="" fill sizes="(min-width: 640px) 196px, 148px" className="object-cover object-[50%_20%]" />
                  <span className="float-chip absolute inset-x-2 bottom-2 px-2 py-2 text-center text-[12.5px] leading-tight font-semibold text-ink">
                    {look.name}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="marquee-toggle press mx-auto mt-4 inline-flex h-11 items-center gap-2 rounded-pill bg-mist px-4 text-[13px] font-semibold text-ink ring-1 ring-line ring-inset hover:bg-violet-soft"
      >
        {paused ? <Play aria-hidden className="size-4" strokeWidth={2} /> : <Pause aria-hidden className="size-4" strokeWidth={2} />}
        {paused ? playLabel : pauseLabel}
      </button>
    </div>
  );
}
