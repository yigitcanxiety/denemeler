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
      <p className="text-lg text-ink">{contact.intro}</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {contact.cards.map((card) => {
          const Icon = ICONS[card.kind];
          const email = EMAILS[card.kind];
          return (
            <li
              key={card.kind}
              className={`rounded-card border border-border/70 bg-surface-raised p-6 shadow-soft ${card.kind === 'company' ? 'sm:col-span-2' : ''}`}
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                <Icon aria-hidden className="size-5" />
              </span>
              <h2 className="mt-4 text-xl text-ink">{card.title}</h2>
              <p className="mt-2 text-[0.95rem]">{card.body}</p>
              {email && (
                <a href={`mailto:${email}`} className="mt-3 inline-block font-semibold text-accent hover:underline">
                  {email}
                </a>
              )}
              {card.kind === 'company' && (
                <dl className="mt-4 grid gap-x-6 gap-y-2 text-[0.95rem] sm:grid-cols-[auto_1fr]">
                  <dt className="font-medium text-ink">{contact.addressLabel}</dt>
                  <dd>
                    {COMPANY.legalName}, {COMPANY.address}
                  </dd>
                  <dt className="font-medium text-ink">{contact.registrationLabel}</dt>
                  <dd>{COMPANY.registrationNumber}</dd>
                  <dt className="font-medium text-ink">{contact.kepLabel}</dt>
                  <dd>{COMPANY.kepAddress}</dd>
                  <dt className="font-medium text-ink">{contact.representativeLabel}</dt>
                  <dd>{COMPANY.turkeyRepresentative}</dd>
                </dl>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-sm">{contact.responseTime}</p>
    </LegalShell>
  );
}
