import { Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui';
import type { SiteContent } from '@/content';

export function Faq({ content }: { content: SiteContent }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-16 sm:py-24">
      <div className="shell grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="faq-title" eyebrow={content.faq.eyebrow} title={content.faq.title} lead={content.faq.subtitle} align="left" />
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {content.faq.items.map((item) => (
            <details key={item.q} className="group rounded-card bg-mist px-5 open:bg-paper open:shadow-soft open:ring-1 open:ring-line">
              <summary className="flex min-h-16 cursor-pointer items-center gap-4 py-4 text-left">
                <h3 className="flex-1 font-sans text-[15.5px] leading-snug font-semibold tracking-normal text-ink" style={{ fontFamily: 'var(--font-sans)' }}>
                  {item.q}
                </h3>
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-paper text-violet transition-transform duration-200 group-open:rotate-45 group-open:bg-violet-soft motion-reduce:transition-none">
                  <Plus className="size-4" strokeWidth={2} />
                </span>
              </summary>
              <p className="max-w-[64ch] pb-5 text-[14.5px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
