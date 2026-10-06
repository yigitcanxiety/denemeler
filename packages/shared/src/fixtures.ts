import type { FaceAnalysis, Locale, SkinAnalysis } from './schemas';

/** Deterministic analysis used in mock mode and tests (Soft Autumn). */
export const MOCK_ANALYSIS: FaceAnalysis = {
  faceDetected: true,
  qualityIssues: [],
  undertone: 'warm',
  skinDepth: 'light_medium',
  contrast: 'low',
  faceShape: 'oval',
  eyeShape: 'almond',
  season: 'soft_autumn',
  seasonConfidence: 0.82,
  bestColors: ['#C2A383', '#B97A57', '#A8B08C', '#8A9A5B', '#6B8E8E', '#D4A59A', '#B5838D', '#8C6E5D'],
  avoidColors: ['#FF1493', '#0000FF', '#000000', '#E0FFFF'],
  foundation: {
    undertoneLabel: 'Warm neutral (golden-beige)',
    shadeRange: 'Light-medium, warm beige (e.g. W2–W3)',
  },
  lip: ['#B5655B', '#C27C6B', '#9E5A4F', '#D08C7E'],
  blush: ['#D4927D', '#C97B6B', '#E0A58F'],
  eyeshadow: ['#A0785A', '#8A9A5B', '#C2A383', '#6E4F3A'],
  summary:
    'Your colouring is soft and gently warm, which places you in Soft Autumn. Muted earthy shades like camel, sage and dusty rose harmonise with your skin, while very bright or icy colours can feel harsh next to your face.',
};

const MOCK_LOCALIZED_TEXT: Record<Locale, Pick<FaceAnalysis, 'foundation' | 'summary'>> = {
  en: { foundation: MOCK_ANALYSIS.foundation, summary: MOCK_ANALYSIS.summary },
  tr: {
    foundation: {
      undertoneLabel: 'Sıcak nötr (altın bej)',
      shadeRange: 'Açık-orta, sıcak bej (ör. W2–W3)',
    },
    summary:
      'Renklerin yumuşak ve hafif sıcak; bu seni Yumuşak Sonbahar yapıyor. Deve tüyü, adaçayı ve gül kurusu gibi toprak tonları cildinle uyum içinde; çok parlak ya da buz gibi soğuk renkler ise yüzünün yanında sert durabilir.',
  },
};

/** `MOCK_ANALYSIS` with its human-readable text in the requested locale. */
export function mockAnalysisFor(locale: Locale): FaceAnalysis {
  return { ...MOCK_ANALYSIS, ...MOCK_LOCALIZED_TEXT[locale] };
}

/** 1×1 transparent PNG, handy as a placeholder image in mock mode and tests. */
export const MOCK_IMAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const MOCK_SKIN_TEXT: Record<Locale, Pick<SkinAnalysis, 'routine' | 'ingredients' | 'summary'>> = {
  en: {
    routine: {
      morning: ['Gentle gel cleanser', 'Light hydrating serum', 'Oil-free moisturiser', 'SPF 50 sunscreen'],
      evening: ['Gentle cleanser', 'Niacinamide serum', 'Barrier-repair moisturiser'],
    },
    ingredients: ['Niacinamide', 'Hyaluronic acid', 'Ceramides'],
    summary:
      'Your skin looks balanced with a little shine in the T-zone. A light, hydrating routine with daily sunscreen will keep it comfortable and even.',
  },
  tr: {
    routine: {
      morning: ['Nazik jel temizleyici', 'Hafif nemlendirici serum', 'Yağsız nemlendirici', 'SPF 50 güneş kremi'],
      evening: ['Nazik temizleyici', 'Niasinamid serumu', 'Bariyer onarıcı nemlendirici'],
    },
    ingredients: ['Niasinamid', 'Hyaluronik asit', 'Seramid'],
    summary:
      'Cildin dengeli görünüyor, T bölgesinde hafif parlama var. Hafif ve nem veren bir rutin ile her gün güneş kremi cildini rahat ve eşit tonlu tutar.',
  },
};

/** Deterministic skin analysis used in mock mode and tests, in the requested locale. */
export function mockSkinAnalysisFor(locale: Locale): SkinAnalysis {
  return {
    faceDetected: true,
    qualityIssues: [],
    skinType: 'combination',
    concerns: { hydration: 'medium', oiliness: 'medium', pores: 'medium', redness: 'low', pigmentation: 'low', texture: 'low' },
    ...MOCK_SKIN_TEXT[locale],
  };
}
