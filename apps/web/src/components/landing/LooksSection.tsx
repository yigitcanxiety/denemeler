import { LOOKS, LOOK_IDS, localized, type CoreLocale } from '@tonelle/shared';
import { SectionHeading } from '@/components/ui';
import type { SiteContent } from '@/content';
import { LooksMarquee } from './LooksMarquee';

/** Looks strip: renders in /public/looks/<id>.jpg, one line of copy and the AI disclosure. */
export function LooksSection({ locale, content }: { locale: CoreLocale; content: SiteContent }) {
  const { looks: copy } = content;
  const looks = LOOK_IDS.map((id) => ({ id, src: `/looks/${id}.jpg`, name: localized(LOOKS[id].name, locale) }));
  return (
    <section id="looks" aria-labelledby="looks-title" className="scroll-mt-20 py-12 sm:py-20">
      <div className="shell">
        <SectionHeading id="looks-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.subtitle} />
      </div>
      <div className="mt-8 flex flex-col sm:mt-10">
        <LooksMarquee looks={looks} pauseLabel={copy.pause} playLabel={copy.play} />
        <p className="shell mt-3 text-center text-[12px] text-muted">{copy.note}</p>
      </div>
    </section>
  );
}
