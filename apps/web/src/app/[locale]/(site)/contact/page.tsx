import { isLocale } from '@tonelle/shared';
import { Building2, LifeBuoy, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalShell } from '@/components/legal/LegalDocument';
import { COMPANY } from '@/config/company';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { contact } = getContent(locale);
  return pageMetadata({ locale, path: '/contact', title: contact.title, description: contact.metaDescription });
}

const ICONS = { support: LifeBuoy, privacy: ShieldCheck, company: Building2 } as const;
const EMAILS = { support: COMPANY.supportEmail, privacy: COMPANY.privacyEmail, company: null } as const;

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const { contact } = content;

  return (
    <LegalShell locale={locale} content={content} title={contact.title} path="/contact">
      <p className="text-[17px] text-ink">{contact.intro}</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {contact.cards.map((card) => {
          const Icon = ICONS[card.kind];
          const email = EMAILS[card.kind];
          return (
            <li
              key={card.kind}
              className={`rounded-panel bg-mist p-6 ${card.kind === 'company' ? 'sm:col-span-2' : ''}`}
            >
              <span className="grid size-10 place-items-center rounded-[12px] bg-paper text-violet">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <h2 className="mt-4 text-[1.4rem] text-ink">{card.title}</h2>
              <p className="mt-2 text-[0.95rem]">{card.body}</p>
              {email && (
                <a href={`mailto:${email}`} className="mt-2 inline-flex min-h-11 items-center font-semibold text-violet underline decoration-violet/40 underline-offset-4 hover:decoration-violet">
                  {email}
                </a>
              )}
              {card.kind === 'company' && (
                <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-line pt-4 text-[0.95rem] sm:grid-cols-[auto_1fr]">
                  <dt className="caps pt-[3px] text-ink">{contact.addressLabel}</dt>
                  <dd>
                    {COMPANY.legalName}, {COMPANY.address}
                  </dd>
                  <dt className="caps pt-[3px] text-ink">{contact.registrationLabel}</dt>
                  <dd>{COMPANY.registrationNumber}</dd>
                  {COMPANY.kepAddress && (
                    <>
                      <dt className="caps pt-[3px] text-ink">{contact.kepLabel}</dt>
                      <dd>{COMPANY.kepAddress}</dd>
                    </>
                  )}
                  {COMPANY.turkeyRepresentative && (
                    <>
                      <dt className="caps pt-[3px] text-ink">{contact.representativeLabel}</dt>
                      <dd>{COMPANY.turkeyRepresentative}</dd>
                    </>
                  )}
                </dl>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-[13px]">{contact.responseTime}</p>
    </LegalShell>
  );
}
