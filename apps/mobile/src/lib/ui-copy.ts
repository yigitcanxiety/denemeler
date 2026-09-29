import type { Locale } from '@tonelle/shared';

import { intlTag } from './locale';

/**
 * Short, design-specific copy for the v3 mobile screens that is not part of the shared
 * dictionary (chips, tab labels, card captions). Bilingual (TR default + EN); longer product
 * copy belongs in @tonelle/shared.
 */
const COPY = {
  tr: {
    tabToday: 'Bugün',
    tabResults: 'Sonuçlar',
    tabProfile: 'Profil',
    tabScan: 'Yeni analiz',
    menu: 'Menü',

    discover: 'Kendini keşfet',
    heroTitle: 'Yapay Zekâ ile Yüz Taraması, Anında Sonuç',
    heroLead: 'Sana yakışan renkleri ve makyajı kendi yüzünde gör.',
    heroImageLabel: 'Örnek portre, yüzen analiz etiketleriyle',
    chipUndertone: 'Alt ton',
    chipSeason: 'Renk sezonu',
    chipFit: 'Uyum',
    featureColorTitle: 'Renk Analizi',
    featureColorBody: 'Sezonunu ve paletini bul',
    featureMakeupTitle: 'Makyaj Denemesi',
    featureMakeupBody: 'Görünümleri yüzünde dene',
    lastResult: 'Son analizin',
    seeResults: 'Sonuçları gör',

    tipsTitle: 'En iyi açını yakala',
    tipsWell: 'Doğru sonuç için',
    idealTitle: 'İdeal selfie',
    avoidTitle: 'Kaçınılması gerekenler',
    avoidDark: 'Karanlık',
    avoidFilter: 'Filtre',
    avoidAngle: 'Açılı',
    tipsCta: 'Selfie çek veya yükle',

    uploadTitle: 'Selfie yükle',
    uploadBody: 'Gün ışığında, karşıdan çekilmiş net bir selfie seç.',
    confirmTitle: 'Harika görünüyorsun',
    confirmBody: 'İyi bir sonuç için yüz hatlarının net göründüğünden emin ol.',
    greatSelfie: 'Harika selfie!',
    otherSelfie: 'Başka selfie seç',
    startAnalysis: 'Analizi başlat',

    scanChip: 'Analiz sürüyor',
    scanTitle: 'Renklerini okuyoruz',

    yourSeasonIs: 'Senin renk sezonun',
    decoySeason: 'Gizli Sezonun',
    unlockResults: 'Sonuçlarını aç',
    lockedUndertone: 'Cilt alt tonu',
    lockedContrast: 'Kontrast',
    lockedFaceShape: 'Yüz şekli',
    lockedSkinColor: 'Cilt rengi',
    trialCta: (days: number) => `${days} gün ücretsiz dene`,
    photoCheck: 'Fotoğraf kontrolü',

    paywallTitle: 'Tam raporun ve makyaj denemen hazır',
    restoreShort: 'Geri yükle',
    perWeekShort: 'haftalık',
    once: 'bir kez',
    noSubscription: 'Abonelik yok',
    firstWeek: (price: string) => `İlk hafta ${price}`,
    trialFine: 'Deneme bitmeden iptal edersen ücret alınmaz.',
    dev: 'DEV',

    radarTitle: 'Renk profilin',
    traitsTitle: 'Özelliklerin',
    shadesTitle: 'Sana uyan tonlar',
    lip: 'Ruj',
    blush: 'Allık',
    eyeshadow: 'Far',
    foundation: 'Fondöten',
    noResultTitle: 'Henüz bir analizin yok',
    noResultBody: 'Bir selfie ile renk sezonunu ve sana yakışan makyajı keşfet.',

    tryOnTitle: 'Makyaj denemesi',
    shadesForLook: 'Bu görünüm için tonların',
    needPhoto: 'Görünümü yüzünde görmek için bir selfie gerekiyor. Fotoğrafın saklanmaz.',
    addSelfie: 'Selfie ekle',
    sliderLabel: 'Önce ve sonra karşılaştırma kaydırıcısı',

    profileTitle: 'Profil',
    preferences: 'Makyaj tercihlerin',
    preferencesBody: 'Görünüm önerilerini kişiselleştir',

    demoBadge: 'DEMO',
    demoDetail: 'Tarayıcı önizlemesi · örnek analiz, fotoğrafın hiçbir yere gönderilmez',
    shareAppOnly: 'Görsel olarak paylaşma yalnızca uygulamada. Tarayıcı önizlemesinde kartı ekran görüntüsüyle kaydedebilirsin.',
    shareEyebrow: 'Renk sezonum',
    match: (percent: string) => `${percent} uyum`,
  },
  en: {
    tabToday: 'Today',
    tabResults: 'Results',
    tabProfile: 'Profile',
    tabScan: 'New analysis',
    menu: 'Menu',

    discover: 'Discover yourself',
    heroTitle: 'AI Face Scan, Instant Results',
    heroLead: 'See the colours and makeup that suit you, on your own face.',
    heroImageLabel: 'Sample portrait with floating analysis labels',
    chipUndertone: 'Undertone',
    chipSeason: 'Colour season',
    chipFit: 'Fit',
    featureColorTitle: 'Colour Analysis',
    featureColorBody: 'Find your season and palette',
    featureMakeupTitle: 'Makeup Try-on',
    featureMakeupBody: 'Try looks on your face',
    lastResult: 'Your last analysis',
    seeResults: 'See results',

    tipsTitle: 'Find your best angle',
    tipsWell: 'For an accurate result',
    idealTitle: 'Ideal selfie',
    avoidTitle: 'What to avoid',
    avoidDark: 'Too dark',
    avoidFilter: 'Filter',
    avoidAngle: 'Angled',
    tipsCta: 'Take or upload a selfie',

    uploadTitle: 'Upload a selfie',
    uploadBody: 'Choose a sharp, front-facing selfie taken in daylight.',
    confirmTitle: 'You look great',
    confirmBody: 'For a good result, make sure your features are clearly visible.',
    greatSelfie: 'Great selfie!',
    otherSelfie: 'Choose another selfie',
    startAnalysis: 'Start analysis',

    scanChip: 'Analysing',
    scanTitle: 'Reading your colours',

    yourSeasonIs: 'Your colour season',
    decoySeason: 'Hidden Season',
    unlockResults: 'Unlock your results',
    lockedUndertone: 'Skin undertone',
    lockedContrast: 'Contrast',
    lockedFaceShape: 'Face shape',
    lockedSkinColor: 'Skin colour',
    trialCta: (days: number) => `Try ${days} days free`,
    photoCheck: 'Photo check',

    paywallTitle: 'Your full report and makeup try-on are ready',
    restoreShort: 'Restore',
    perWeekShort: 'per week',
    once: 'one-time',
    noSubscription: 'No subscription',
    firstWeek: (price: string) => `First week ${price}`,
    trialFine: 'Cancel before the trial ends and you won’t be charged.',
    dev: 'DEV',

    radarTitle: 'Your colour profile',
    traitsTitle: 'Your features',
    shadesTitle: 'Shades that suit you',
    lip: 'Lipstick',
    blush: 'Blush',
    eyeshadow: 'Eyeshadow',
    foundation: 'Foundation',
    noResultTitle: 'No analysis yet',
    noResultBody: 'Discover your colour season and the makeup that suits you with one selfie.',

    tryOnTitle: 'Makeup try-on',
    shadesForLook: 'Your shades for this look',
    needPhoto: 'To see the look on your face we need a selfie. Your photo is never stored.',
    addSelfie: 'Add a selfie',
    sliderLabel: 'Before and after comparison slider',

    profileTitle: 'Profile',
    preferences: 'Your makeup preferences',
    preferencesBody: 'Personalise look recommendations',

    demoBadge: 'DEMO',
    demoDetail: 'Browser preview · sample analysis, your photo is not sent anywhere',
    shareAppOnly: 'Sharing as an image works in the app. In the browser preview, take a screenshot of the card.',
    shareEyebrow: 'My colour season',
    match: (percent: string) => `${percent} match`,
  },
} as const satisfies Record<Locale, unknown>;

export type UiCopy = (typeof COPY)[Locale];

export function uiCopy(locale: Locale): UiCopy {
  return COPY[locale] ?? COPY.en;
}

/** Locale-aware uppercase (Turkish dotted/dotless i: "i" → "İ", "ı" → "I"). */
export function upper(text: string, locale: Locale): string {
  return text.toLocaleUpperCase(intlTag(locale));
}

/** Percent in local style: "%95" in Turkish, "95%" in English. */
export function percentLabel(value: number, locale: Locale): string {
  const n = Math.round(value);
  return locale === 'tr' ? `%${n}` : `${n}%`;
}

export type MatchTone = 'high' | 'mid' | 'low';

/** Badge tone for a shade fit: ≥ 90 mint, 75–89 butter, < 75 rose (DESIGN.md §2). */
export function matchTone(percent: number): MatchTone {
  if (percent >= 90) return 'high';
  if (percent >= 75) return 'mid';
  return 'low';
}
