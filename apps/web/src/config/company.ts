/**
 * Company, legal and store configuration for the web app.
 *
 * PLACEHOLDERS: every value wrapped in [square brackets] must be replaced with the real
 * details before launch (and the legal texts reviewed by counsel). They are rendered
 * verbatim in the legal pages and the footer, so they are easy to spot.
 */

export const COMPANY = {
  /** Data controller / publisher. */
  legalName: 'Doribleg Trade Ltd',
  brand: 'Tonelle',
  /** Registered office (Companies House). */
  address: 'Suite 10550, 5 Brayford Square, London E1 0SG, United Kingdom',
  /** Companies House number (England and Wales). */
  registrationNumber: '17049929',
  /** Jurisdiction whose law governs the Terms. */
  governingLaw: 'England and Wales',
  /** Merchant of Record for web purchases. */
  merchantOfRecord: 'Paddle.com Market Ltd',
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
export const LEGAL_LAST_UPDATED = '2026-10-11';

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
