/**
 * Company, legal and store configuration for the web app.
 *
 * PLACEHOLDERS: every value wrapped in [square brackets] must be replaced with the real
 * details before launch (and the legal texts reviewed by counsel). They are rendered
 * verbatim in the legal pages and the footer, so they are easy to spot.
 */

export const COMPANY = {
  /** Data controller / publisher. */
  /** Individual developer (sole publisher); contact is by email, no postal address shown. */
  legalName: 'Yiğit Gördebil',
  brand: 'Tonelle',
  /** Jurisdiction whose law governs the Terms. */
  governingLaw: 'Türkiye',
  /** General support contact — placeholder mailbox on the product domain. */
  supportEmail: 'support@tonelleapp.com',
  /** Privacy / data-protection requests (GDPR & KVKK applications). */
  privacyEmail: 'privacy@tonelleapp.com',
  /** Registered electronic mail (KEP) address for KVKK applications; empty = none, hidden. */
  kepAddress: '',
  /** Representative in Türkiye (KVKK "veri sorumlusu temsilcisi"); empty = not appointed, hidden. */
  turkeyRepresentative: '',
  /** EU representative under GDPR Art. 27; empty = not appointed, hidden. */
  euRepresentative: '',
} as const;

/** Date the legal documents were last revised (ISO). Shown on every legal page. */
export const LEGAL_LAST_UPDATED = '2026-10-19';

/** Canonical site origin, without trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tonelleapp.com').replace(/\/+$/, '');

/**
 * Store links. NEXT_PUBLIC_* variables are inlined at build time, so they must be read
 * with literal `process.env.X` access. An empty string means "not published yet":
 * the matching badge is hidden and the paywall falls back to a "coming soon" state.
 */
export const STORE_URLS = {
  appStore: process.env.NEXT_PUBLIC_APP_STORE_URL ?? '',
  playStore: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '',
} as const;

/**
 * Image slots for the landing page. Drop real, licensed images into `public/landing/`
 * with these names and set the value to the path to replace the illustrated placeholder
 * (keep a 4:5 aspect ratio to avoid layout shift). `null` renders the SVG illustration.
 */
export const LANDING_IMAGES: { before: string | null; after: string | null } = {
  before: null, // e.g. '/landing/before.webp'
  after: null, // e.g. '/landing/after.webp'
};
