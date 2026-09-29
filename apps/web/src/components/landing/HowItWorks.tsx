import { Camera, Palette, Sparkles } from 'lucide-react';
import type { SiteContent } from '@/content';
import { Section } from './Section';

const ICONS = [Camera, Palette, Sparkles];

export function HowItWorks({ content }: { content: SiteContent }) {
  return (
    <Section id="how" title={content.how.title} subtitle={content.how.subtitle}>
      <ol className="grid gap-5 md:grid-cols-3">
        {content.how.steps.map((step, i) => {
          const Icon = ICONS[i] ?? Sparkles;
          return (
            <li key={step.title} className="relative rounded-card border border-border/70 bg-surface-raised p-6 shadow-soft sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon aria-hidden className="size-6" />
                </span>
                <span className="font-display text-4xl text-blush-300" aria-hidden>
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
