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
  /** Registered office — placeholder. */
  address: '[Registered office address, City, Postcode, Country]',
  /** Company / trade registry number — placeholder. */
  registrationNumber: '[Company registration number]',
  /** Jurisdiction whose law governs the Terms — placeholder. */
  governingLaw: '[Governing law jurisdiction]',
  /** General support contact — placeholder mailbox on the product domain. */
  supportEmail: 'support@tonelle.app',
  /** Privacy / data-protection requests (GDPR & KVKK applications). */
  privacyEmail: 'privacy@tonelle.app',
  /** Registered electronic mail (KEP) address for KVKK applications — placeholder. */
  kepAddress: '[KEP address, if any]',
  /** Representative in Türkiye (KVKK "veri sorumlusu temsilcisi") — placeholder. */
  turkeyRepresentative: '[Data controller representative in Türkiye — name and address]',
  /** EU representative under GDPR Art. 27, if the controller is established outside the EU — placeholder. */
  euRepresentative: '[EU representative under GDPR Art. 27 — name and address, if required]',
} as const;

/** Date the legal documents were last revised (ISO). Shown on every legal page. */
export const LEGAL_LAST_UPDATED = '2026-09-29';

/** Canonical site origin, without trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tonelle.app').replace(/\/+$/, '');

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
