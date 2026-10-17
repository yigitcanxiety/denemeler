import { AppStoreCta } from '@/components/site/AppStoreCta';
import { Logo } from '@/components/site/Logo';
import type { SiteContent } from '@/content';

/** Closing block: mirrors the hero CTA, centred. */
export function FinalCta({ content }: { content: SiteContent }) {
  return (
    <section aria-labelledby="final-cta-title" className="py-12 sm:py-20">
      <div className="shell">
        <div className="relative overflow-hidden rounded-xl bg-board px-6 py-12 text-center sm:px-12 sm:py-16" data-reveal>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(255_255_255/0.85)_0%,rgb(255_255_255/0)_100%)]"
          />
          <div className="relative flex flex-col items-center gap-5">
            <Logo className="text-[1.8rem] text-violet" />
            <h2 id="final-cta-title" className="max-w-[18ch] text-[clamp(1.9rem,7vw,3.2rem)] text-ink">
              {content.finalCta.title}
            </h2>
            <p className="max-w-[46ch] text-[15px] text-muted">{content.finalCta.body}</p>
            <AppStoreCta labels={content.stores} className="max-sm:w-full" />
            <p className="text-[12.5px] text-muted">{content.hero.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
