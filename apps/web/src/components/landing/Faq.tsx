import type { SiteContent } from '@/content';

export function Faq({ content }: { content: SiteContent }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative border-t border-line-strong py-20 sm:py-28">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28" data-reveal>
            <h2 id="faq-title" className="text-[clamp(2.4rem,8vw,5rem)] text-ink">
              {content.faq.title}
            </h2>
            <p className="mono mt-5 max-w-[34ch] text-ink-muted">{content.faq.subtitle}</p>
          </div>
        </div>
        <div className="border-t border-line-strong lg:col-span-8">
          {content.faq.items.map((item, i) => (
            <details key={item.q} className="group border-b border-line-strong">
              <summary className="flex min-h-16 cursor-pointer items-start gap-4 py-5 text-left">
                <span className="mono-caps mt-1.5 w-10 shrink-0 text-ink-muted">Q.{String(i + 1).padStart(2, '0')}</span>
                <h3 className="flex-1 text-[1.2rem] leading-tight font-medium tracking-[-0.03em] text-ink sm:text-[1.45rem]">{item.q}</h3>
                <span
                  aria-hidden
                  className="relative mt-1 grid size-7 shrink-0 place-items-center bg-ink text-ink-inverse transition-colors group-open:bg-accent"
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="mono max-w-[64ch] pb-6 pl-14 text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
