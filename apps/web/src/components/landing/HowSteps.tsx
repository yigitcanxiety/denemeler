import { Camera, Palette, WandSparkles } from 'lucide-react';
import { SectionHeading, delay } from '@/components/ui';
import type { SiteContent } from '@/content';

const ICONS = [Camera, Palette, WandSparkles];

/** Three numbered step cards. */
export function HowSteps({ content }: { content: SiteContent }) {
  const { how } = content;
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-20 py-12 sm:py-20">
      <div className="shell">
        <SectionHeading id="how-title" eyebrow={how.eyebrow} title={how.title} />
        <ol className="mt-9 grid gap-3 sm:mt-12 md:grid-cols-3 md:gap-4">
          {how.steps.map((step, i) => {
            const Icon = ICONS[i]!;
            return (
              <li
                key={step.title}
                className="relative flex flex-col gap-3 overflow-hidden rounded-panel bg-violet-soft/60 p-5 ring-1 ring-white/70 ring-inset sm:p-6"
                data-reveal
                style={delay(i * 90)}
              >
                <span aria-hidden className="serif pointer-events-none absolute -top-3 right-4 text-[7rem] leading-none text-violet/10">
                  {i + 1}
                </span>
                <span className="relative grid size-11 place-items-center rounded-full bg-paper text-violet shadow-soft">
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="relative text-[1.5rem] text-ink">
                  <span className="sr-only">{i + 1}. </span>
                  {step.title}
                </h3>
                <p className="relative text-[14.5px] text-muted">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
