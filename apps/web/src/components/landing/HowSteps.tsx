import { LOOKS, localized, type Locale } from '@tonelle/shared';
import { Check } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { FitPill, ProgressRing, SectionHeading, delay } from '@/components/ui';
import type { SiteContent } from '@/content';
import { landingSample } from './sample';

const THUMBS = ['/images/portrait-hero.jpg', '/images/portrait-2.jpg', '/images/portrait-3.jpg'];

/** Three steps (selfie → analiz → yüzünde dene), each with a small UI snippet. */
export function HowSteps({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { how, analyze } = content;
  const sample = landingSample(locale);

  const snippets: ReactNode[] = [
    <div key="selfie" className="flex h-full flex-col justify-center gap-3 px-4">
      <span className="caps text-mint-ink">{how.snippetGood}</span>
      <div className="flex gap-2">
        {THUMBS.map((src) => (
          <span key={src} className="relative aspect-[3/4] flex-1 overflow-hidden rounded-[12px] outline-[2.5px] -outline-offset-[2.5px] outline-[#44C06A] outline-solid">
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            <span className="absolute bottom-1.5 left-1.5 grid size-5 place-items-center rounded-full bg-[#44C06A] text-white">
              <Check aria-hidden className="size-3" strokeWidth={3} />
            </span>
          </span>
        ))}
      </div>
    </div>,
    <div key="scan" className="flex h-full items-center justify-center gap-5 px-4">
      <ProgressRing value={64} size={112} stroke={5}>
        <span className="absolute inset-[9px] overflow-hidden rounded-full">
          <Image src="/images/portrait-2.jpg" alt="" fill sizes="112px" className="object-cover" />
          <span className="scan-band" />
        </span>
      </ProgressRing>
      <div>
        <p className="serif text-[2rem] leading-none text-ink">%64</p>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-violet">
          <span aria-hidden className="pulse size-1.5 rounded-full bg-violet" />
          {how.snippetScanning}
        </p>
      </div>
    </div>,
    <div key="tryon" className="flex h-full flex-col justify-center gap-3 px-4">
      <div className="flex gap-1.5 overflow-hidden">
        {(['soft_glam', 'natural_glow', 'office_chic'] as const).map((id, i) => (
          <span
            key={id}
            className={
              i === 0
                ? 'shrink-0 rounded-pill bg-ink px-3 py-1.5 text-[11.5px] font-semibold text-white'
                : 'shrink-0 rounded-pill bg-mist px-3 py-1.5 text-[11.5px] font-semibold text-ink ring-1 ring-line ring-inset'
            }
          >
            {localized(LOOKS[id].name, locale)}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {sample.shades.map((s) => (
          <span key={s.hex} className="flex flex-1 flex-col gap-1.5 rounded-[12px] bg-mist p-2">
            <span className="block h-8 rounded-[8px]" style={{ backgroundColor: s.hex }} />
            <FitPill value={s.fit} template={analyze.fitLabel} className="text-[10px]" />
          </span>
        ))}
      </div>
    </div>,
  ];

  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-20 py-16 sm:py-24">
      <div className="shell">
        <SectionHeading id="how-title" eyebrow={how.eyebrow} title={how.title} lead={how.subtitle} />
        <ol className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {how.steps.map((step, i) => (
            <li key={step.title} className="flex min-w-0 flex-col rounded-panel bg-mist p-3 pb-6" data-reveal style={delay(i * 90)}>
              <div aria-hidden className="h-44 rounded-card bg-paper shadow-soft">
                {snippets[i]}
              </div>
              <div className="px-3 pt-5">
                <span className="grid size-8 place-items-center rounded-full bg-violet-soft text-[13px] font-bold text-violet">{i + 1}</span>
                <h3 className="mt-3 text-[1.45rem] text-ink">{step.title}</h3>
                <p className="mt-2 text-[14.5px] text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
