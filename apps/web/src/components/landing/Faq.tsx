import { Plus } from 'lucide-react';
import type { SiteContent } from '@/content';
import { Section } from './Section';

export function Faq({ content }: { content: SiteContent }) {
  return (
    <Section id="faq" title={content.faq.title} subtitle={content.faq.subtitle} className="bg-surface-sunken/50">
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-card border border-border/70 bg-surface-raised shadow-soft">
        {content.faq.items.map((item) => (
          <details key={item.q} className="group px-5 sm:px-7">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-left font-semibold text-ink">
              <h3 className="font-sans text-base sm:text-lg">{item.q}</h3>
              <Plus
                aria-hidden
                className="size-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="pb-5 leading-relaxed text-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
