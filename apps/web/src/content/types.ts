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
    /** Compact header CTA labels (live / before launch). */
    ctaDownload: string;
    ctaSoon: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaNote: string;
    undertoneChip: string;
    seasonChip: string;
    sliderLabel: string;
    sliderBefore: string;
    sliderAfter: string;
    sliderHint: string;
    beforeAlt: string;
    afterAlt: string;
  };
  how: {
    eyebrow: string;
    title: string;
    steps: { title: string; body: string }[];
  };
  looks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    note: string;
    pause: string;
    play: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    note: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    title: string;
    body: string;
  };
  inAppNotice: {
    text: string;
    close: string;
  };
  cookieBanner: {
    text: string;
    accept: string;
    decline: string;
    more: string;
  };
  footer: {
    legalTitle: string;
  };
  stores: {
    /** App Store CTA: link text once the app is live, plain label before launch. */
    download: string;
    soon: string;
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
