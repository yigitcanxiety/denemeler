import type { Locale } from '@tonelle/shared';
import { en } from './en';
import { tr } from './tr';
import type { SiteContent } from './types';

export type { LegalBlock, LegalDocument, LegalSection, SiteContent } from './types';

export const siteContent: Record<Locale, SiteContent> = { tr, en };

/** Web-only copy for a locale. Server-side use only: it includes the long legal texts. */
export function getContent(locale: Locale): SiteContent {
  return siteContent[locale];
}
