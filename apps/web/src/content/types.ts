/**
 * Web-only copy (marketing + long-form legal). Short UI strings shared with mobile live in
 * `@tonelle/shared` dictionaries; only text that exists solely on the website goes here.
 * Every locale file must satisfy this type, and `content.test.ts` checks the key sets match.
 */

/** A paragraph, a bullet list, or a small key/value table inside a legal section. */
export type LegalBlock = string | { list: string[] } | { rows: [string, string][] };

export interface LegalSection {
  /** Stable anchor id (same in every locale). */
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  metaDescription: string;
  intro: string[];
  sections: LegalSection[];
}

export interface SiteContent {
  meta: {
    homeTitle: string;
    homeDescription: string;
    analyzeTitle: string;
    analyzeDescription: string;
    ogAlt: string;
    keywords: string[];
  };
  nav: {
    skipToContent: string;
    home: string;
    howItWorks: string;
    looks: string;
    pricing: string;
    faq: string;
    startCta: string;
    primaryNavLabel: string;
    menu: string;
    closeMenu: string;
    menuTitle: string;
  };
  preloader: {
    label: string;
    skip: string;
    /** Four season families, clockwise from the top (N, E, S, W). */
    seasons: string[];
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaNote: string;
    trustPoints: string[];
    storesLabel: string;
    illustrationLabel: string;
    analyzingTag: string;
    notes: string[];
  };
  story: {
    title: string;
    subtitle: string;
    steps: { title: string; body: string; screen: string }[];
  };
  sphere: {
    eyebrow: string;
    title: string;
    steps: { title: string; body: string }[];
  };
  people: {
    title: string;
    /** Small disclosure shown whenever placeholder testimonials are displayed. */
    caption: string;
  };
  dock: {
    note: string;
  };
  how: {
    title: string;
    subtitle: string;
    steps: { title: string; body: string }[];
  };
  looks: {
    title: string;
    subtitle: string;
    cta: string;
  };
  tones: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    seasonsTitle: string;
  };
  privacy: {
    title: string;
    body: string;
    points: string[];
    link: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    cta: string;
    note: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    title: string;
    body: string;
    button: string;
  };
  footer: {
    tagline: string;
    productTitle: string;
    legalTitle: string;
    companyTitle: string;
    registration: string;
  };
  stores: {
    appStoreTop: string;
    appStoreBottom: string;
    playTop: string;
    playBottom: string;
  };
  legalCommon: {
    lastUpdated: string;
    draftNotice: string;
    tocTitle: string;
    otherDocs: string;
    backHome: string;
  };
  legal: {
    privacy: LegalDocument;
    kvkk: LegalDocument;
    consent: LegalDocument;
    terms: LegalDocument;
  };
  contact: {
    title: string;
    metaDescription: string;
    intro: string;
    cards: { title: string; body: string; kind: 'support' | 'privacy' | 'company' }[];
    responseTime: string;
    addressLabel: string;
    registrationLabel: string;
    kepLabel: string;
    representativeLabel: string;
  };
  analyze: {
    consentTermsCheckbox: string;
    consentTermsLink: string;
    quizLabel: string;
    selfieDrop: string;
    selfiePreparing: string;
    selfieReady: string;
    selfieAnalyze: string;
    selfieTipsTitle: string;
    cameraStarting: string;
    cameraClose: string;
    cameraGuideLabel: string;
    scanningLabel: string;
    teaserHidden: string;
    paywallClose: string;
    paywallPlansLabel: string;
    chooseStoreTitle: string;
    chooseStoreBody: string;
    comingSoonTitle: string;
    comingSoonBody: string;
    notifyCta: string;
    notifySubject: string;
    demoUnlock: string;
    demoNote: string;
    resultsLookLocked: string;
    resultsUnlockCta: string;
    resultsPhotoNeeded: string;
    resultsNewSelfie: string;
    resultsStartOver: string;
    resultsFoundationHint: string;
    resultsShareCta: string;
    shareClose: string;
    shareFailed: string;
    renderFailed: string;
    homeLink: string;
    analyzingTag: string;
    navResults: string;
    navLooks: string;
    photoFrameLabel: string;
  };
}
