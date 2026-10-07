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
    colorTitle: string;
    colorDescription: string;
    skinTitle: string;
    skinDescription: string;
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
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaNote: string;
    /** Links to the single colour / skin analyses under the main CTA. */
    modesLabel: string;
    colorOnly: string;
    skinOnly: string;
    trustPoints: string[];
    storesLabel: string;
    portraitAlt: string;
    undertoneChip: string;
    seasonChip: string;
    fitChip: string;
    colorCard: { title: string; body: string };
    makeupCard: { title: string; body: string; shade: string };
  };
  beforeAfter: {
    eyebrow: string;
    title: string;
    storyTitle: string;
    body: string[];
    shadesTitle: string;
    beforeAlt: string;
    afterAlt: string;
    sliderLabel: string;
    aiNote: string;
  };
  people: {
    eyebrow: string;
    title: string;
    /** Small disclosure shown whenever placeholder testimonials are displayed. */
    caption: string;
    starsLabel: string;
  };
  dock: {
    note: string;
  };
  how: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; body: string }[];
    snippetGood: string;
    snippetScanning: string;
  };
  looks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  profile: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    radarTitle: string;
    seasonLabel: string;
    paletteTitle: string;
    sampleNote: string;
  };
  privacy: {
    title: string;
    body: string;
    points: string[];
    link: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    note: string;
  };
  faq: {
    eyebrow: string;
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
    selfieAnalyze: string;
    tipsTitle: string;
    tipsWellTitle: string;
    tipsIdealTitle: string;
    tipsAvoidTitle: string;
    tipsAvoidDark: string;
    tipsAvoidFilter: string;
    tipsAvoidAngle: string;
    tipsExampleAlt: string;
    tipsCta: string;
    confirmTitle: string;
    confirmChip: string;
    confirmOther: string;
    cameraStarting: string;
    cameraClose: string;
    cameraGuideLabel: string;
    scanningLabel: string;
    scanningChip: string;
    scanningTitle: string;
    lockedProgress: string;
    lockedClose: string;
    lockedSeasonLabel: string;
    lockedUnlock: string;
    lockedSkinColor: string;
    lockedTrialCta: string;
    lockedCta: string;
    lockedFine: string;
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
    inviteLabel: string;
    inviteCta: string;
    inviteError: string;
    demoNote: string;
    resultsPhotoNeeded: string;
    resultsNewSelfie: string;
    resultsStartOver: string;
    resultsFoundationHint: string;
    resultsShareCta: string;
    resultsSeasonChip: string;
    resultsProfileTitle: string;
    resultsTraitsTitle: string;
    resultsShadesTitle: string;
    fitLabel: string;
    tryOnTitle: string;
    tryOnLooksLabel: string;
    tryOnShadesTitle: string;
    tryOnSliderLabel: string;
    shareClose: string;
    shareFailed: string;
    renderFailed: string;
    homeLink: string;
    navResults: string;
    navLooks: string;
    photoFrameLabel: string;
    colorResultsTitle: string;
    skinScanningTitle: string;
    skinScanSteps: string[];
    skin: {
      title: string;
      skinTypeTitle: string;
      concernsTitle: string;
      concerns: Record<'hydration' | 'oiliness' | 'pores' | 'redness' | 'pigmentation' | 'texture', string>;
      levels: Record<'low' | 'medium' | 'high', string>;
      routineTitle: string;
      morning: string;
      evening: string;
      ingredientsTitle: string;
      summaryTitle: string;
      disclaimer: string;
      startOver: string;
      fullAnalysis: string;
    };
  };
}
