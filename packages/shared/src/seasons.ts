import type { Localized, Season } from './schemas';

export type SeasonFamily = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  id: Season;
  family: SeasonFamily;
  /** Dominant colour temperature of the season. */
  temperature: 'warm' | 'cool' | 'neutral_warm' | 'neutral_cool';
  /** Typical contrast between skin, hair and eyes. */
  contrast: 'low' | 'medium' | 'high';
  name: Localized;
  description: Localized;
  /** Reference palette, 8 hex colours that flatter this season. */
  palette: string[];
  /** 4 hex colours this season usually wants to keep away from the face. */
  avoid: string[];
}

export const SEASONS: Record<Season, SeasonInfo> = {
  light_spring: {
    id: 'light_spring',
    family: 'spring',
    temperature: 'neutral_warm',
    contrast: 'low',
    name: { tr: 'Açık İlkbahar', en: 'Light Spring' },
    description: {
      tr: 'Açık, sıcak ve taze tonlar sana çok yakışıyor. Şeftali, açık mercan ve tereyağı sarısı gibi hafif renkler yüzünü aydınlatır; çok koyu ve ağır tonlar ise seni gölgede bırakabilir.',
      en: 'Light, warm and fresh shades are your sweet spot. Peach, soft coral and butter yellow brighten your face, while very dark, heavy colours can overpower you.',
    },
    palette: ['#FFCBA4', '#F88379', '#F7A4A6', '#FBE7A1', '#A8E6CF', '#7FD1C9', '#A7B8E8', '#D8B48A'],
    avoid: ['#000000', '#4B0082', '#5C4033', '#808080'],
  },
  true_spring: {
    id: 'true_spring',
    family: 'spring',
    temperature: 'warm',
    contrast: 'medium',
    name: { tr: 'Sıcak İlkbahar', en: 'True Spring' },
    description: {
      tr: 'Altın alt tonlu, canlı ve neşeli renkler senin için. Mercan, kayısı, zeytin yeşili ve turkuaz cildine sıcak bir ışıltı katar; gri ve buz gibi soğuk tonlardan uzak durmak iyi olur.',
      en: 'Golden-based, lively and cheerful colours are made for you. Coral, apricot, leaf green and turquoise give your skin a warm glow; greys and icy cool shades are best kept away.',
    },
    palette: ['#FF7F50', '#FFB347', '#F4C430', '#7BB661', '#40B5AD', '#E2725B', '#C19A6B', '#FF6F61'],
    avoid: ['#000000', '#C0C0C0', '#6A5ACD', '#800020'],
  },
  bright_spring: {
    id: 'bright_spring',
    family: 'spring',
    temperature: 'neutral_warm',
    contrast: 'high',
    name: { tr: 'Parlak İlkbahar', en: 'Bright Spring' },
    description: {
      tr: 'Net, doygun ve parlak renklerle ışıldıyorsun. Karpuz kırmızısı, canlı turkuaz ve güneş sarısı seni öne çıkarır; tozlu, soluk tonlar ise yüzünü donuk gösterebilir.',
      en: 'Clear, saturated and bright colours make you shine. Watermelon red, vivid turquoise and sunny yellow bring you forward, while dusty, faded shades can make you look tired.',
    },
    palette: ['#FF5A5F', '#FFA62B', '#FCE205', '#2EC4B6', '#0081A7', '#7B2CBF', '#F15BB5', '#FDF6EC'],
    avoid: ['#8B8589', '#A67B5B', '#556B2F', '#D2B48C'],
  },
  light_summer: {
    id: 'light_summer',
    family: 'summer',
    temperature: 'neutral_cool',
    contrast: 'low',
    name: { tr: 'Açık Yaz', en: 'Light Summer' },
    description: {
      tr: 'Pastel, serin ve yumuşak tonlar sana çok yakışıyor. Lavanta, pudra pembesi ve açık mavi zarif bir uyum yaratır; turuncu ve çok koyu renkler ise sert kalabilir.',
      en: 'Pastel, cool and gentle shades suit you beautifully. Lavender, powder pink and soft blue create an elegant harmony, while orange and very dark colours can feel harsh.',
    },
    palette: ['#E6E6FA', '#B0C4DE', '#F4C2C2', '#C8A2C8', '#98D7C2', '#A7C7E7', '#F8C8DC', '#D8D8E8'],
    avoid: ['#FF8C00', '#000000', '#8B4513', '#FFD700'],
  },
  true_summer: {
    id: 'true_summer',
    family: 'summer',
    temperature: 'cool',
    contrast: 'medium',
    name: { tr: 'Soğuk Yaz', en: 'True Summer' },
    description: {
      tr: 'Mavi alt tonlu, serin ve dengeli renkler seni en iyi hâlinle gösterir. Gül kurusu, çelik mavisi ve ahududu cildini tazeler; sıcak turuncu ve hardal tonları ise uyumu bozabilir.',
      en: 'Blue-based, cool and balanced colours show you at your best. Dusty rose, steel blue and raspberry refresh your skin, while warm orange and mustard can clash.',
    },
    palette: ['#6A8CAF', '#B3446C', '#D98695', '#7E9CB9', '#5F9EA0', '#8E7CC3', '#C0C0C0', '#2F4F6F'],
    avoid: ['#FF8C00', '#FFD700', '#8B4513', '#FF4500'],
  },
  soft_summer: {
    id: 'soft_summer',
    family: 'summer',
    temperature: 'neutral_cool',
    contrast: 'low',
    name: { tr: 'Yumuşak Yaz', en: 'Soft Summer' },
    description: {
      tr: 'Tozlu, gri alt tonlu ve sakin renkler sana doğal bir zarafet katar. Mürdüm, adaçayı yeşili ve füme mavi çok uyumludur; neon ve çok parlak renkler ise seni bastırabilir.',
      en: 'Muted, grey-toned and calm colours give you an effortless elegance. Plum, sage and smoky blue are lovely on you, while neon and very bright shades can overwhelm you.',
    },
    palette: ['#A3A3C2', '#B784A7', '#C8A2A8', '#8FA9A0', '#9DB4C0', '#7A6F8F', '#D4B9BD', '#6E7F80'],
    avoid: ['#FF0000', '#FFA500', '#000000', '#FFFF00'],
  },
  soft_autumn: {
    id: 'soft_autumn',
    family: 'autumn',
    temperature: 'neutral_warm',
    contrast: 'low',
    name: { tr: 'Yumuşak Sonbahar', en: 'Soft Autumn' },
    description: {
      tr: 'Toprak tonları, yumuşak ve hafif sıcak renkler seni çok iyi tamamlıyor. Deve tüyü, gül kurusu, adaçayı ve soft terrakota cildinle uyum içinde; neon ve buz gibi soğuk tonlar ise sert durabilir.',
      en: 'Earthy, soft and gently warm colours complement you beautifully. Camel, dusty rose, sage and soft terracotta harmonise with your skin, while neon and icy shades can look harsh.',
    },
    palette: ['#C2A383', '#B97A57', '#A8B08C', '#8A9A5B', '#6B8E8E', '#D4A59A', '#B5838D', '#8C6E5D'],
    avoid: ['#FF1493', '#0000FF', '#000000', '#E0FFFF'],
  },
  true_autumn: {
    id: 'true_autumn',
    family: 'autumn',
    temperature: 'warm',
    contrast: 'medium',
    name: { tr: 'Sıcak Sonbahar', en: 'True Autumn' },
    description: {
      tr: 'Zengin, sıcak ve altın dokunuşlu renkler senin doğal alanın. Kiremit, hardal, zeytin yeşili ve petrol mavisi cildini canlandırır; pastel pembe ve gümüş tonlar ise solgun gösterebilir.',
      en: 'Rich, warm, golden colours are your natural territory. Rust, mustard, olive and teal bring your skin to life, while pastel pink and silver can wash you out.',
    },
    palette: ['#CC5500', '#B7410E', '#DAA520', '#808000', '#556B2F', '#8B4513', '#D2691E', '#008080'],
    avoid: ['#FF69B4', '#E6E6FA', '#000080', '#C0C0C0'],
  },
  deep_autumn: {
    id: 'deep_autumn',
    family: 'autumn',
    temperature: 'neutral_warm',
    contrast: 'high',
    name: { tr: 'Koyu Sonbahar', en: 'Deep Autumn' },
    description: {
      tr: 'Derin, sıcak ve yoğun renkler sende çok etkileyici duruyor. Bordo, çikolata kahvesi, koyu zeytin ve eski altın karakterini öne çıkarır; çok açık pasteller ise seni silik gösterebilir.',
      en: 'Deep, warm and intense colours look striking on you. Burgundy, chocolate, dark olive and antique gold bring out your character, while very light pastels can make you fade.',
    },
    palette: ['#7B3F00', '#800020', '#4B5320', '#B8860B', '#8B0000', '#2F4F4F', '#A0522D', '#654321'],
    avoid: ['#FFB6C1', '#E0FFFF', '#FFFACD', '#D8BFD8'],
  },
  deep_winter: {
    id: 'deep_winter',
    family: 'winter',
    temperature: 'neutral_cool',
    contrast: 'high',
    name: { tr: 'Koyu Kış', en: 'Deep Winter' },
    description: {
      tr: 'Koyu, serin ve güçlü renklerle göz alıcı görünüyorsun. Gece mavisi, şarap kırmızısı, zümrüt ve saf beyaz sana çok yakışır; bej, şeftali ve soluk sıcak tonlar ise etkini azaltabilir.',
      en: 'Dark, cool and powerful colours make you look stunning. Midnight navy, wine red, emerald and crisp white suit you perfectly, while beige, peach and faded warm tones can dull your impact.',
    },
    palette: ['#1C1C3C', '#800020', '#006400', '#4B0082', '#DC143C', '#00416A', '#F8F8FF', '#2E2E2E'],
    avoid: ['#FFDAB9', '#F5DEB3', '#DAA520', '#D2B48C'],
  },
  true_winter: {
    id: 'true_winter',
    family: 'winter',
    temperature: 'cool',
    contrast: 'high',
    name: { tr: 'Soğuk Kış', en: 'True Winter' },
    description: {
      tr: 'Net, soğuk ve kontrastlı renkler seni ışıl ışıl gösterir. Kobalt mavisi, fuşya, zümrüt yeşili ve kar beyazı idealdir; turuncu, hardal ve toprak tonları ise cildini sarımsı gösterebilir.',
      en: 'Clear, cool, high-contrast colours make you glow. Cobalt, fuchsia, emerald and snow white are ideal, while orange, mustard and earthy tones can make your skin look sallow.',
    },
    palette: ['#0047AB', '#D2042D', '#C71585', '#009473', '#1B1B1B', '#FAFAFA', '#6A0DAD', '#4682B4'],
    avoid: ['#FFA500', '#C19A6B', '#F5DEB3', '#808000'],
  },
  bright_winter: {
    id: 'bright_winter',
    family: 'winter',
    temperature: 'neutral_cool',
    contrast: 'high',
    name: { tr: 'Parlak Kış', en: 'Bright Winter' },
    description: {
      tr: 'Elektrik gibi canlı, serin ve parlak renklerle hayat buluyorsun. Neon pembe, safir mavisi, parlak yeşil ve saf beyaz sana enerji verir; bej ve tozlu kahveler ise seni matlaştırabilir.',
      en: 'Electric, cool and vivid colours bring you to life. Hot pink, sapphire, bright green and pure white energise your look, while beige and dusty browns can dull you.',
    },
    palette: ['#FF007F', '#1F51FF', '#00C389', '#FF2400', '#7F00FF', '#00CED1', '#F7F7F7', '#111111'],
    avoid: ['#C2B280', '#8B7D6B', '#D2B48C', '#A67B5B'],
  },
};

/** All seasons in canonical order. */
export const SEASON_LIST: SeasonInfo[] = Object.values(SEASONS);

export function getSeason(id: Season): SeasonInfo {
  return SEASONS[id];
}
