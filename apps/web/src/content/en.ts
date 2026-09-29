import { COMPANY } from '@/config/company';
import type { SiteContent } from './types';

const C = COMPANY;

export const en: SiteContent = {
  meta: {
    homeTitle: 'Tonelle · See the makeup that suits you, on your own face',
    homeDescription:
      'Take one selfie. Tonelle finds your undertone and colour season, builds your personal palette and shows makeup looks on your own face. Your photo is never stored.',
    analyzeTitle: 'Free colour & makeup analysis',
    analyzeDescription:
      'Find your colour season, undertone and the makeup shades that flatter you in about a minute. Your photo is never stored.',
    ogAlt: 'Tonelle: AI colour season and makeup analysis',
    keywords: [
      'colour analysis',
      'colour season',
      'undertone test',
      'makeup try on',
      'AI makeup',
      'foundation shade',
      'seasonal colour analysis',
    ],
  },
  nav: {
    skipToContent: 'Skip to content',
    home: 'Tonelle home',
    howItWorks: 'How it works',
    looks: 'Makeup try-on',
    pricing: 'Pricing',
    faq: 'FAQ',
    startCta: 'Start analysis',
    primaryNavLabel: 'Main',
    menu: 'Menu',
    closeMenu: 'Close menu',
    menuTitle: 'Menu',
  },
  hero: {
    eyebrow: 'Discover yourself',
    title: 'See the makeup that suits you, on your own face',
    subtitle:
      'One selfie is all it takes. Tonelle reads your undertone, finds your colour season and shows makeup looks on your own face.',
    cta: 'Start my free analysis',
    ctaNote: 'Free analysis · About 1 minute · No sign-up',
    trustPoints: ['Your photo is never stored', '12 colour seasons', 'Made for warm & olive skin'],
    storesLabel: 'Also on your phone',
    portraitAlt: 'A portrait analysed with Tonelle, with undertone, colour season and fit details over the photo.',
    undertoneChip: 'Undertone',
    seasonChip: 'Colour season',
    fitChip: 'Fit',
    colorCard: {
      title: 'Colour analysis',
      body: 'Find your season, undertone and personal palette.',
    },
    makeupCard: {
      title: 'Makeup try-on',
      body: 'Looks on your own face, before and after.',
      shade: 'Matte lip · Dusty rose',
    },
  },
  beforeAfter: {
    eyebrow: 'Makeup try-on',
    title: 'Before and after, on your own face',
    storyTitle: 'See it on your face before you buy',
    body: [
      'Natural, office, glam or evening: the look you pick is applied to your own photo. Drag the slider and see the difference instantly.',
      'Every look comes with shades chosen for your colour season and a step-by-step guide for your level.',
    ],
    shadesTitle: 'Your shades for this look',
    beforeAlt: 'Portrait without makeup',
    afterAlt: 'The same portrait with the suggested shades',
    sliderLabel: 'Before and after comparison slider',
    aiNote: 'Sample images are illustrative; the app uses your own photo.',
  },
  people: {
    eyebrow: 'Stories',
    title: 'How people use Tonelle',
    caption: 'Example user scenarios',
    starsLabel: '5 out of 5 stars',
  },
  dock: {
    note: 'Free · ~1 min · No sign-up',
  },
  how: {
    eyebrow: 'How it works',
    title: 'From selfie to personal guide in three steps',
    subtitle: 'It takes about a minute. Your photo is deleted right after the analysis.',
    steps: [
      {
        title: 'Take a selfie',
        body: 'Face soft daylight and switch off filters. The tips help you take the ideal photo.',
      },
      {
        title: 'We read your colours',
        body: 'AI reads your undertone, skin depth and contrast and matches you with one of 12 seasons.',
      },
      {
        title: 'Try it on your face',
        body: 'See the looks that suit you on your own photo and explore lip, blush and eyeshadow shades with their fit.',
      },
    ],
    snippetGood: 'Ideal selfie',
    snippetScanning: 'Reading undertone',
  },
  looks: {
    eyebrow: 'Looks',
    title: 'Looks made for your colours',
    subtitle: 'Every look comes with shades picked from your palette and a step-by-step guide for your level.',
    cta: 'Find my looks',
  },
  profile: {
    eyebrow: 'Colour profile',
    title: 'Your colours at a glance',
    body: 'Tonelle doesn’t stop at a single label. It maps your colour profile across warmth, contrast and softness, and picks your palette and shades from it. It is tuned for the warm, olive and golden undertones common in Turkish and Mediterranean skin.',
    points: [
      'Recognises olive undertones, not just “warm” or “cool”',
      'Foundation guidance for every skin depth, fair to deep',
      'Never rates your looks; it only shows colour fit',
    ],
    radarTitle: 'Colour profile',
    seasonLabel: 'Colour season',
    paletteTitle: 'Personal palette',
    sampleNote: 'Sample result',
  },
  privacy: {
    title: 'Your photo stays yours',
    body: 'Your selfie is only used to create your analysis and is never stored on our servers.',
    points: [
      'Photos are processed in memory and deleted as soon as the analysis is done',
      'Never used to train AI models',
      'Your results are stored only on your device; delete them with one tap',
      'We never rate your looks',
    ],
    link: 'Read the Privacy Policy',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Simple pricing',
    subtitle: 'The analysis is free. Unlock your full report and looks on your own face with Premium.',
    cta: 'Start the free analysis',
    note: 'Prices include VAT. Subscriptions are charged and managed by Apple or Google; the store shows the exact price for your country.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions, answered',
    subtitle: 'Everything to know before you take your selfie.',
    items: [
      {
        q: 'Do you store my photo?',
        a: 'No. Your selfie is sent securely to our AI provider only to create your analysis (and, with Premium, the makeup previews). We process it in memory and discard it as soon as the request finishes (if our AI provider needs a temporary copy, it is deleted automatically within 3 days). It is never saved on our servers and never used to train AI models. Your results are stored only on your device.',
      },
      {
        q: 'How accurate is the analysis?',
        a: 'Tonelle gives you a well-grounded starting point, not a verdict. Lighting, camera quality, filters and makeup all affect colours in a photo, so for the best result take your selfie in soft daylight with bare skin. The analysis is guidance to help you choose shades; it is not a professional or medical assessment.',
      },
      {
        q: 'Are the makeup images real?',
        a: 'No, and we always say so. Makeup previews are generated by AI from your photo and are labelled “AI-generated”. They simulate how a look could appear; real products and application will look slightly different.',
      },
      {
        q: 'What is free and what is Premium?',
        a: 'Your colour analysis and season are free. Premium unlocks your full report: best and avoid colours, foundation range, lip, blush and eyeshadow shades, looks rendered on your own photo and step-by-step guides.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'Subscriptions are managed by Apple or Google. Cancel anytime in your App Store or Google Play account settings, at least 24 hours before the end of the current period (or the free trial) to avoid being charged again. Deleting the app does not cancel a subscription.',
      },
      {
        q: 'Does it work for olive and darker skin tones?',
        a: 'Yes. Tonelle is designed with Turkish and Mediterranean colouring in mind and recognises olive undertones and skin depths from fair to deep.',
      },
      {
        q: 'Do I need an account?',
        a: 'No. You don’t need to sign up or give us your name or email. Purchases are linked to an anonymous ID and your store account.',
      },
      {
        q: 'Is this medical or skincare advice?',
        a: 'No. Tonelle offers cosmetic colour and makeup suggestions only. If you have a skin condition, allergy or irritation, talk to a dermatologist and always patch-test new products.',
      },
    ],
  },
  finalCta: {
    title: 'Ready to meet your colours?',
    body: 'Take one selfie and get your colour season in about a minute. Free, private, no sign-up.',
    button: 'Start my free analysis',
  },
  footer: {
    tagline: 'AI colour and makeup analysis that shows what suits you, on your own face.',
    productTitle: 'Product',
    legalTitle: 'Legal',
    companyTitle: 'Company',
    registration: 'Registration no.',
  },
  stores: {
    appStoreTop: 'Download on the',
    appStoreBottom: 'App Store',
    playTop: 'Get it on',
    playBottom: 'Google Play',
  },
  legalCommon: {
    lastUpdated: 'Last updated: {date}',
    draftNotice: 'Draft document, to be reviewed by legal counsel before publication.',
    tocTitle: 'Contents',
    otherDocs: 'Other legal documents',
    backHome: 'Back to home',
  },
  legal: {
    privacy: {
      title: 'Privacy Policy',
      metaDescription:
        'How Tonelle (Doribleg Trade Ltd) processes your personal data: no photo storage, results on your device, your GDPR rights.',
      intro: [
        `This Privacy Policy explains how ${C.legalName} (“we”, “us”) processes personal data when you use the Tonelle website and mobile apps (together, the “Service”). We designed Tonelle so that we process as little personal data as possible: we do not store your photos, we do not require an account, and your results are kept on your own device.`,
        'This policy applies to users in the European Economic Area (EEA) and elsewhere. If you are in Türkiye, please also read our KVKK Privacy Notice (Aydınlatma Metni).',
      ],
      sections: [
        {
          id: 'controller',
          heading: '1. Who is responsible for your data',
          blocks: [
            `The controller of your personal data is ${C.legalName}, ${C.address} (registration no. ${C.registrationNumber}).`,
            `For any privacy question or request, contact us at ${C.privacyEmail}.`,
            `EU representative (GDPR Art. 27): ${C.euRepresentative}.`,
          ],
        },
        {
          id: 'data',
          heading: '2. What data we process',
          blocks: [
            {
              list: [
                'Facial image (selfie): the photo you take or upload for analysis. Because it shows your face, we treat it with the protection given to special categories of data, even though we never use it to identify you.',
                'Analysis results: derived information such as undertone, skin depth, contrast, face and eye shape, colour season and suggested shades. These are generated from your photo and stored only on your device.',
                'Questionnaire answers: skin type, eye colour, occasion, budget and experience level, sent together with your photo to tailor results.',
                'Anonymous app user ID: a random identifier created on your device, used only to check whether you have an active Premium subscription.',
                'Purchase and subscription status: whether a subscription or one-time purchase is active, its product, and renewal dates. Payment details are handled by Apple or Google; we never see your card details.',
                'Technical data: IP address, browser or device type, operating system, and request timestamps, used for security, rate limiting and troubleshooting.',
                'Communications: your email address and message if you contact us.',
              ],
            },
            'We do not ask for your name, email or phone number to use the Service, and we do not rate or score your appearance.',
          ],
        },
        {
          id: 'purposes',
          heading: '3. Why we process it and on what legal basis',
          blocks: [
            {
              rows: [
                [
                  'Analysing your facial image to determine your colouring and colour season, and (Premium) generating makeup previews on your photo',
                  'Your explicit consent (GDPR Art. 6(1)(a) and Art. 9(2)(a)). You give it by ticking the consent box before the analysis; you can withdraw it at any time.',
                ],
                [
                  'Providing the Service you requested, including personalised recommendations from your questionnaire answers and unlocking Premium features',
                  'Performance of a contract (Art. 6(1)(b)).',
                ],
                [
                  'Checking your subscription status through RevenueCat with your anonymous app user ID',
                  'Performance of a contract (Art. 6(1)(b)).',
                ],
                [
                  'Keeping the Service secure, preventing abuse and fraud, rate limiting and fixing errors',
                  'Our legitimate interests in operating a safe and reliable service (Art. 6(1)(f)).',
                ],
                ['Answering your messages and requests', 'Performance of a contract or our legitimate interests (Art. 6(1)(b) or (f)).'],
                [
                  'Keeping records required by tax, accounting or consumer protection law',
                  'Compliance with legal obligations (Art. 6(1)(c)).',
                ],
              ],
            },
            'If you do not give explicit consent, we cannot analyse your photo. You can still browse the website and read about the Service.',
          ],
        },
        {
          id: 'photos',
          heading: '4. How your photo is handled',
          blocks: [
            {
              list: [
                'Your photo is reduced in size on your device and sent over an encrypted connection (HTTPS) to our server.',
                'Our server forwards it to our AI provider to create your analysis or makeup preview, and discards it as soon as the request finishes, typically within seconds.',
                'We do not write your photo to any database, file storage or log.',
                'We instruct our AI providers not to use your photo to train their models and choose provider settings that minimise or disable data retention where available.',
                'Makeup previews generated for you are returned to your device and are not stored by us.',
              ],
            },
          ],
        },
        {
          id: 'device',
          heading: '5. Data stored on your device',
          blocks: [
            'The website stores your latest analysis results, your anonymous app user ID and your language preference in your browser’s local storage or in a strictly necessary cookie (tonelle_locale). Your photo is never stored there. You can delete this data at any time with “Delete my data” on the results page or by clearing your browser data.',
            'We currently do not use advertising or analytics cookies. If we introduce them, we will ask for your consent first where required.',
          ],
        },
        {
          id: 'processors',
          heading: '6. Who we share data with',
          blocks: [
            'We use carefully selected service providers (processors) who act only on our instructions under data processing agreements:',
            {
              rows: [
                ['Vercel Inc. (USA; servers in the EU, Frankfurt)', 'Website and API hosting; receives technical data and transiently the photo in transit.'],
                ['OpenRouter, Inc. (USA)', 'Routes your photo and questionnaire answers to the AI vision model that performs the analysis.'],
                ['AI model provider reached through OpenRouter (e.g. Google LLC)', 'Performs the analysis of your photo.'],
                ['Google LLC (Gemini API) or Features & Labels, Inc. (fal.ai) (USA)', 'Generates makeup previews on your photo (Premium only).'],
                ['Kie.ai (AI API provider)', 'Where enabled, routes your photo to the AI models (Google Gemini / Nano Banana) for the analysis and makeup previews. For this, your photo is held in Kie.ai’s temporary file storage and deleted automatically within 3 days.'],
                ['RevenueCat, Inc. (USA)', 'Manages subscription status linked to your anonymous app user ID.'],
              ],
            },
            'Apple Inc. (App Store) and Google LLC (Google Play) process your purchase and payment as independent controllers under their own privacy policies.',
            'We may disclose data to authorities where required by law. We never sell your personal data.',
          ],
        },
        {
          id: 'transfers',
          heading: '7. International transfers',
          blocks: [
            'Some of our providers are located in, or may access data from, the United States or other countries outside the EEA. Where a country does not have an adequacy decision, we rely on the EU–US Data Privacy Framework (where the provider is certified) or on the European Commission’s Standard Contractual Clauses (GDPR Art. 46(2)(c)), together with additional safeguards such as encryption in transit and not storing photos. You can request a copy of the relevant safeguards from us.',
          ],
        },
        {
          id: 'retention',
          heading: '8. How long we keep data',
          blocks: [
            {
              rows: [
                ['Facial image', 'Not stored by us. Discarded when the analysis or preview request ends. Where Kie.ai is used, its temporary copy is deleted automatically within 3 days.'],
                ['Analysis results', 'Only on your device, until you delete them.'],
                ['Technical logs (without photos)', 'Up to 30 days, unless needed longer to investigate a security incident.'],
                ['Rate-limiting counters (IP address or app user ID)', 'Up to 1 hour.'],
                ['Subscription records (RevenueCat)', 'While your subscription is active and as required by law afterwards.'],
                ['Support emails', 'Up to 2 years after the conversation ends.'],
              ],
            },
          ],
        },
        {
          id: 'automated',
          heading: '9. Automated processing',
          blocks: [
            'The analysis is performed automatically by AI. It produces cosmetic suggestions only and does not make decisions that have legal or similarly significant effects on you (GDPR Art. 22). AI-generated images are clearly labelled as such.',
          ],
        },
        {
          id: 'rights',
          heading: '10. Your rights',
          blocks: [
            'Depending on where you live, you have the right to:',
            {
              list: [
                'access your personal data and receive a copy;',
                'have inaccurate data corrected;',
                'have your data erased;',
                'restrict or object to processing, including processing based on legitimate interests;',
                'data portability;',
                'withdraw your consent at any time, without affecting processing carried out before withdrawal;',
                'lodge a complaint with a data protection authority, in particular in the EU country where you live or work.',
              ],
            },
            `To exercise your rights, email ${C.privacyEmail}. Because we do not store photos or accounts, most of your data is on your device and you can delete it yourself. We will reply within one month.`,
          ],
        },
        {
          id: 'children',
          heading: '11. Age limit',
          blocks: [
            'The Service is intended for people aged 16 and over. We do not knowingly process data of children under 16. If you believe a child has used the Service, contact us and we will help remove any data.',
          ],
        },
        {
          id: 'security',
          heading: '12. Security',
          blocks: [
            'We use encryption in transit, strict access controls, minimal data collection and no storage of photos to protect your data. No system is completely secure, but we work to keep risks as low as possible.',
          ],
        },
        {
          id: 'changes',
          heading: '13. Changes to this policy',
          blocks: [
            'We may update this policy when the Service or the law changes. We will show the date of the latest version at the top of this page and, for significant changes, inform you in the app or on the website.',
          ],
        },
      ],
    },
    kvkk: {
      title: 'KVKK Privacy Notice',
      metaDescription:
        'Privacy notice under Turkish Personal Data Protection Law No. 6698 (KVKK) for Tonelle users in Türkiye.',
      intro: [
        `This notice is provided by ${C.legalName} as data controller under Article 10 of the Turkish Personal Data Protection Law No. 6698 (“KVKK”) to inform users of Tonelle about the processing of their personal data. The Turkish version of this notice is the authoritative text.`,
      ],
      sections: [
        {
          id: 'controller',
          heading: '1. Data controller',
          blocks: [
            {
              rows: [
                ['Data controller', `${C.legalName}`],
                ['Address', C.address],
                ['Data controller representative in Türkiye', C.turkeyRepresentative],
                ['Email', C.privacyEmail],
              ],
            },
          ],
        },
        {
          id: 'data',
          heading: '2. Personal data processed',
          blocks: [
            {
              list: [
                'Visual data: your facial image (selfie). As a facial image may qualify as biometric data, a special category of personal data, it is processed only with your explicit consent.',
                'Analysis data: undertone, skin depth, contrast, face and eye shape, colour season and shade suggestions derived from your photo (stored only on your device).',
                'Preference data: questionnaire answers (skin type, eye colour, occasion, budget, experience).',
                'Customer transaction data: anonymous app user ID, subscription and purchase status.',
                'Transaction security data: IP address, device/browser information, request times.',
                'Communication data: email address and message content if you contact us.',
              ],
            },
          ],
        },
        {
          id: 'purposes',
          heading: '3. Purposes of processing',
          blocks: [
            {
              list: [
                'Performing colour and makeup analysis on your facial image and, for Premium users, generating makeup previews;',
                'Providing personalised look, shade and step-by-step recommendations;',
                'Managing subscriptions and purchases and checking Premium entitlement;',
                'Ensuring information and transaction security, preventing abuse, rate limiting;',
                'Answering requests and complaints;',
                'Fulfilling legal obligations and responding to requests of authorised public bodies.',
              ],
            },
          ],
        },
        {
          id: 'grounds',
          heading: '4. Method of collection and legal grounds',
          blocks: [
            'Personal data is collected electronically and partly by automated means through the Tonelle website and mobile applications, when you take or upload a photo, answer the questionnaire, make a purchase or contact us.',
            {
              list: [
                'Facial image: your explicit consent (KVKK Art. 6(2)).',
                'Preference, customer transaction data: processing is necessary for the establishment or performance of a contract (Art. 5(2)(c)).',
                'Transaction security data: processing is necessary for our legitimate interests, provided it does not harm your fundamental rights and freedoms (Art. 5(2)(f)).',
                'Records required by law: compliance with a legal obligation (Art. 5(2)(ç)).',
                'Communication data: establishment or performance of a contract and our legitimate interests (Art. 5(2)(c) and (f)).',
              ],
            },
            'Your photo is not stored: it is deleted when the analysis request ends. Analysis results are kept only on your device.',
          ],
        },
        {
          id: 'transfer',
          heading: '5. Transfer of personal data (including abroad, Art. 9)',
          blocks: [
            'To provide the Service we transfer personal data to service providers located abroad: hosting (Vercel Inc., servers in the EU), AI analysis (OpenRouter, Inc. and the model provider it routes to, e.g. Google LLC, USA), AI image generation (Google LLC or Features & Labels, Inc. / fal.ai, USA), an AI API provider (Kie.ai) and subscription management (RevenueCat, Inc., USA). Payments are processed by Apple Inc. and Google LLC.',
            'Transfers abroad are carried out in accordance with KVKK Article 9: primarily on the basis of standard contracts announced by the Personal Data Protection Board and notified to the Authority within five business days of signature (Art. 9(4)). Where such safeguards cannot be applied, data is transferred only occasionally and with your explicit consent (Art. 9(6)(a)).',
            'Personal data may also be shared with authorised public institutions where required by law.',
          ],
        },
        {
          id: 'rights',
          heading: '6. Your rights under Article 11',
          blocks: [
            'You have the right to:',
            {
              list: [
                'learn whether your personal data is processed;',
                'request information if it has been processed;',
                'learn the purpose of processing and whether data is used in line with that purpose;',
                'know the third parties in Türkiye or abroad to whom data is transferred;',
                'request correction of incomplete or inaccurate data;',
                'request deletion or destruction of data under the conditions of Article 7;',
                'request that correction, deletion or destruction be notified to third parties to whom data was transferred;',
                'object to a result against you arising from analysis exclusively by automated systems;',
                'claim compensation for damages arising from unlawful processing.',
              ],
            },
            'You can exercise these rights by applying to us as described below.',
          ],
        },
        {
          id: 'application',
          heading: '7. How to apply',
          blocks: [
            `Under the Communiqué on the Procedures and Principles of Application to the Data Controller, you can send your request in writing to ${C.address}, via registered electronic mail (KEP) to ${C.kepAddress}, or by email to ${C.privacyEmail} from an email address you have previously shared with us. Your application must include your name, signature (for written applications), contact address and a clear description of your request.`,
            'We will respond free of charge within 30 days at the latest. If the response requires an additional cost, a fee may be charged according to the tariff set by the Board. If your application is rejected or the answer is insufficient, you may lodge a complaint with the Personal Data Protection Board within the periods set out in Article 14.',
          ],
        },
      ],
    },
    consent: {
      title: 'Explicit Consent Text',
      metaDescription:
        'Explicit consent for processing your facial image and for cross-border transfer of personal data in Tonelle.',
      intro: [
        `This text explains the processing for which ${C.legalName} asks for your explicit consent under GDPR Article 9(2)(a) and KVKK Articles 6 and 9. Please read our Privacy Policy and KVKK Privacy Notice as well. Giving consent is voluntary.`,
      ],
      sections: [
        {
          id: 'face',
          heading: '1. Processing of your facial image',
          blocks: [
            'I consent to Tonelle processing the photo of my face that I take or upload, which may qualify as biometric / special category personal data, for the following purposes only:',
            {
              list: [
                'determining my undertone, skin depth, contrast, face and eye shape and colour season;',
                'creating personalised colour, shade and makeup recommendations;',
                'if I am a Premium user, generating AI makeup previews on my photo.',
              ],
            },
            'I understand that my photo is not stored, is deleted when the request ends, is not used to identify me and is not used to train AI models.',
          ],
        },
        {
          id: 'transfer',
          heading: '2. Transfer abroad',
          blocks: [
            'I understand that, to perform the analysis, my photo and questionnaire answers are sent to AI service providers located abroad (OpenRouter, Inc. and the model provider it routes to, Google LLC, Features & Labels, Inc. / fal.ai, USA, or Kie.ai) and that hosting is provided by Vercel Inc. These transfers are primarily based on standard contracts / Standard Contractual Clauses. Where such safeguards cannot be applied, I consent to the occasional transfer of my data abroad for these purposes (KVKK Art. 9(6)(a)).',
          ],
        },
        {
          id: 'withdraw',
          heading: '3. Withdrawing consent',
          blocks: [
            `You can withdraw your consent at any time by no longer using the analysis, deleting your data in the app or on the website, and emailing ${C.privacyEmail}. Withdrawal applies to the future and does not affect processing carried out before it.`,
            'If you do not give consent, we cannot analyse your photo; this has no other consequence for you.',
          ],
        },
        {
          id: 'how',
          heading: '4. How consent is given',
          blocks: [
            'You give consent by ticking the unticked box “I give my explicit consent to the processing of my facial image…” before taking or uploading your photo. We do not treat silence, pre-ticked boxes or continued use as consent.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Use',
      metaDescription:
        'Terms of Use for Tonelle: subscriptions, free trials, auto-renewal, cancellation, refunds and AI output disclaimer.',
      intro: [
        `These Terms of Use (“Terms”) govern your use of the Tonelle website and mobile applications (the “Service”) provided by ${C.legalName}, ${C.address} (“we”, “us”). By using the Service you agree to these Terms. If you do not agree, please do not use the Service.`,
      ],
      sections: [
        {
          id: 'eligibility',
          heading: '1. Who can use Tonelle',
          blocks: [
            'You must be at least 16 years old to use the Service. By using it you confirm that you meet this requirement and that you can enter into a binding agreement.',
          ],
        },
        {
          id: 'service',
          heading: '2. The Service',
          blocks: [
            'Tonelle uses artificial intelligence to analyse a photo of your face and suggest colours, makeup shades and looks, and (for Premium users) to generate previews of makeup looks on your photo. Features may differ between the website and the apps.',
          ],
        },
        {
          id: 'ai',
          heading: '3. AI output: cosmetic suggestions only',
          blocks: [
            {
              list: [
                'All results are automated, AI-generated suggestions for cosmetic purposes only. They are not medical, dermatological or professional advice and are not a diagnosis of any kind.',
                'Results depend on lighting, camera, filters and makeup in your photo and may be inaccurate. Use your own judgement when choosing products.',
                'Makeup previews are AI-generated simulations, labelled “AI-generated”, and may differ from how real products look on you.',
                'Always read product ingredients and patch-test new cosmetics. If you have a skin condition, allergy or irritation, consult a dermatologist.',
                'We never rate or score your attractiveness.',
              ],
            },
          ],
        },
        {
          id: 'photos',
          heading: '4. Your photos',
          blocks: [
            'Only upload photos of yourself, or of another adult who has given you permission. Do not upload photos of children. You keep all rights to your photos; you give us a limited permission to process them solely to provide the Service. We do not store your photos, as described in the Privacy Policy.',
          ],
        },
        {
          id: 'acceptable-use',
          heading: '5. Acceptable use',
          blocks: [
            'You agree not to:',
            {
              list: [
                'upload photos of other people without their consent, of minors, or content that is illegal, sexual, violent or offensive;',
                'use generated images to deceive, impersonate, harass or defame anyone, or remove the “AI-generated” label to present them as real;',
                'attempt to bypass rate limits, payment or security measures, or reverse engineer the Service;',
                'use automated means to access the Service or overload it;',
                'use the Service for any unlawful purpose.',
              ],
            },
            'We may suspend access if you breach these rules.',
          ],
        },
        {
          id: 'subscriptions',
          heading: '6. Premium subscriptions and purchases',
          blocks: [
            'Premium is available as an auto-renewing weekly or yearly subscription and, where offered, as a one-time report. Purchases are made in the Tonelle app through the Apple App Store or Google Play, and are subject to their terms. Prices shown on the website are for information; the price shown by your store at checkout, including applicable taxes, applies.',
            'Payment is charged to your Apple ID or Google Play account when you confirm the purchase.',
          ],
        },
        {
          id: 'trials',
          heading: '7. Free trials and introductory offers',
          blocks: [
            'Some plans include a free trial (for example 3 days on the yearly plan) or a discounted introductory price for the first period (for example the first week of the weekly plan). When the trial or introductory period ends, the subscription automatically renews at the regular price unless you cancel at least 24 hours before it ends. Trials are available once per user and store account.',
          ],
        },
        {
          id: 'renewal',
          heading: '8. Automatic renewal and cancellation',
          blocks: [
            'Subscriptions renew automatically at the end of each period for the same length and price until cancelled. Your account is charged for renewal within 24 hours before the end of the current period.',
            'You can cancel at any time in your App Store or Google Play account settings. Cancellation must be made at least 24 hours before the end of the current period to avoid the next charge; you keep Premium access until the end of the period you paid for. Deleting the app or your local data does not cancel a subscription.',
          ],
        },
        {
          id: 'refunds',
          heading: '9. Refunds',
          blocks: [
            'Because purchases are processed by Apple or Google, refund requests must be made to them under their refund policies (Apple: reportaproblem.apple.com; Google Play: your Google Play order history). We cannot issue refunds for store purchases directly.',
            'For digital content supplied immediately, the statutory right of withdrawal may end once supply begins with your prior express consent and acknowledgement. This does not affect your other statutory rights as a consumer, including in case of defective digital content.',
          ],
        },
        {
          id: 'ip',
          heading: '10. Intellectual property',
          blocks: [
            'The Service, its design, texts, look guides, software and trademarks belong to us or our licensors. You may use generated images and your share card for personal, non-commercial purposes, keeping the “AI-generated” label.',
          ],
        },
        {
          id: 'availability',
          heading: '11. Availability and changes',
          blocks: [
            'We work to keep the Service available but cannot guarantee it will always be uninterrupted or error-free. We may change or discontinue features; if a change significantly affects a paid feature, we will inform you and you can cancel your subscription.',
          ],
        },
        {
          id: 'liability',
          heading: '12. Liability',
          blocks: [
            'Nothing in these Terms limits liability that cannot be limited by law, including for death or personal injury caused by negligence, fraud, or your mandatory rights as a consumer. Subject to this, we are not liable for decisions you make based on AI suggestions, for products you buy from third parties, or for indirect losses. Our total liability to you is limited to the amount you paid for the Service in the 12 months before the claim.',
          ],
        },
        {
          id: 'termination',
          heading: '13. Ending the relationship',
          blocks: [
            'You can stop using the Service at any time and delete your data on your device. We may suspend or end access in case of serious or repeated breaches of these Terms.',
          ],
        },
        {
          id: 'law',
          heading: '14. Governing law and disputes',
          blocks: [
            `These Terms are governed by the laws of ${C.governingLaw}, without depriving consumers of the protection of the mandatory laws of their country of residence. Consumers in the EU may bring claims in the courts of their country of residence. Consumers in Türkiye may apply to Consumer Arbitration Committees (Tüketici Hakem Heyetleri) or Consumer Courts within the monetary limits set each year.`,
          ],
        },
        {
          id: 'changes',
          heading: '15. Changes to these Terms',
          blocks: [
            'We may update these Terms. We will show the date of the latest version at the top and give reasonable notice of material changes. If you continue to use the Service after changes take effect, the updated Terms apply.',
          ],
        },
        {
          id: 'contact',
          heading: '16. Contact',
          blocks: [`Questions about these Terms: ${C.supportEmail}.`],
        },
      ],
    },
  },
  contact: {
    title: 'Contact',
    metaDescription: 'Contact Tonelle support and privacy team (Doribleg Trade Ltd).',
    intro: 'We’re happy to help with questions about your results, subscriptions or privacy.',
    cards: [
      {
        kind: 'support',
        title: 'Support',
        body: 'Questions about the app, your results or your subscription. For refunds, please contact Apple or Google directly.',
      },
      {
        kind: 'privacy',
        title: 'Privacy & data requests',
        body: 'GDPR and KVKK requests, consent withdrawal and data protection questions.',
      },
      {
        kind: 'company',
        title: 'Company',
        body: 'Tonelle is published by Doribleg Trade Ltd.',
      },
    ],
    responseTime: 'We usually reply within 2 business days.',
    addressLabel: 'Address',
    registrationLabel: 'Registration no.',
    kepLabel: 'KEP address',
    representativeLabel: 'Representative in Türkiye',
  },
  analyze: {
    consentTermsCheckbox: 'I am 16 or older and I accept the {terms}.',
    consentTermsLink: 'Terms of Use',
    quizLabel: 'Questions',
    selfieDrop: 'or drag and drop a photo here',
    selfiePreparing: 'Preparing your photo…',
    selfieAnalyze: 'Start the analysis',
    tipsTitle: 'Find your best angle',
    tipsWellTitle: 'For an accurate result',
    tipsIdealTitle: 'Ideal selfie',
    tipsAvoidTitle: 'Things to avoid',
    tipsAvoidDark: 'Too dark',
    tipsAvoidFilter: 'Filter',
    tipsAvoidAngle: 'Angled',
    tipsExampleAlt: 'Example selfie',
    tipsCta: 'Take or upload a selfie',
    confirmTitle: 'You look great',
    confirmChip: 'Great selfie!',
    confirmOther: 'Choose another selfie',
    cameraStarting: 'Starting camera…',
    cameraClose: 'Close camera',
    cameraGuideLabel: 'Camera preview with a round face guide',
    scanningLabel: 'Analysis in progress',
    scanningChip: 'Analysing',
    scanningTitle: 'Reading your colours',
    lockedProgress: 'Result {current}/{total}',
    lockedClose: 'Back to home',
    lockedSeasonLabel: 'Your colour season',
    lockedUnlock: 'Unlock your results',
    lockedSkinColor: 'Skin colour',
    lockedTrialCta: 'Try {days} days free',
    lockedCta: 'Unlock the full report',
    lockedFine: 'Then {price}/year · Cancel anytime',
    teaserHidden: 'Visible once unlocked',
    paywallClose: 'Close',
    paywallPlansLabel: 'Choose a plan',
    chooseStoreTitle: 'Continue in the Tonelle app',
    chooseStoreBody:
      'Plans are purchased securely through the App Store or Google Play. Download the app to unlock your full report.',
    comingSoonTitle: 'The Tonelle app is coming soon',
    comingSoonBody:
      'Premium purchases open when our app launches. Leave us a note and we’ll tell you the moment it’s live.',
    notifyCta: 'Notify me at launch',
    notifySubject: 'Let me know when Tonelle launches',
    demoUnlock: 'Demo: unlock all results',
    demoNote: 'Only visible in development and demo mode.',
    resultsPhotoNeeded:
      'We don’t keep your photo, so after a page reload the previews need a new selfie.',
    resultsNewSelfie: 'Take a new selfie',
    resultsStartOver: 'Start over',
    resultsFoundationHint: 'Before buying, test shades on your jawline in daylight.',
    resultsShareCta: 'Create my share card',
    resultsSeasonChip: 'Colour season',
    resultsProfileTitle: 'Your colour profile',
    resultsTraitsTitle: 'Your face and skin traits',
    resultsShadesTitle: 'Shades that suit you',
    fitLabel: '{n}% fit',
    tryOnTitle: 'Makeup try-on',
    tryOnLooksLabel: 'Choose a look',
    tryOnShadesTitle: 'Your shades for this look',
    tryOnSliderLabel: 'Before and after comparison slider',
    shareClose: 'Close',
    shareFailed: 'Couldn’t create the image. Please try again.',
    renderFailed: 'This preview couldn’t be created.',
    homeLink: 'Tonelle home',
    navResults: 'Colour result',
    navLooks: 'Makeup try-on',
    photoFrameLabel: 'Preview of the photo you chose',
  },
};
