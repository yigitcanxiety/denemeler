import { ArrowRight } from 'lucide-react';
import type { Locale } from '@tonelle/shared';
import { ButtonLink } from '@/components/ui';
import type { SiteContent } from '@/content';

export function FinalCta({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section aria-labelledby="final-cta-title" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-[linear-gradient(135deg,#fae6e6,#f2e2d7_60%,#e8cfbf)] px-6 py-12 text-center shadow-card sm:px-12 sm:py-16">
        <h2 id="final-cta-title" className="text-3xl text-ink sm:text-4xl">
          {content.finalCta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-ink-muted">{content.finalCta.body}</p>
        <ButtonLink
          href={`/${locale}/analyze`}
          size="lg"
          className="mt-8"
          icon={<ArrowRight aria-hidden className="order-last size-5" />}
        >
          {content.finalCta.button}
        </ButtonLink>
      </div>
    </section>
  );
}
