import { CONTENT_OVERLAYS, withOverlays } from './i18n/content';
import { interpolate, isCoreLocale } from './i18n';
import type { Contrast, CoreLocalized, FaceAnalysis, Locale, Localized, SkinDepth, Undertone } from './schemas';
import { getSeason } from './seasons';

/** Axes of the colour-profile radar shown on the results screen. Descriptive, never a beauty score. */
export const PROFILE_AXES = ['warmth', 'depth', 'contrast', 'clarity', 'softness', 'lightness'] as const;
export type ProfileAxis = (typeof PROFILE_AXES)[number];
export type ColorProfile = Record<ProfileAxis, number>;

const CORE_AXIS_LABELS: Record<ProfileAxis, CoreLocalized> = {
  warmth: { tr: 'Sıcaklık', en: 'Warmth' },
  depth: { tr: 'Derinlik', en: 'Depth' },
  contrast: { tr: 'Kontrast', en: 'Contrast' },
  clarity: { tr: 'Canlılık', en: 'Clarity' },
  softness: { tr: 'Yumuşaklık', en: 'Softness' },
  lightness: { tr: 'Açıklık', en: 'Lightness' },
};

export const PROFILE_AXIS_LABELS = Object.fromEntries(
  PROFILE_AXES.map((axis) => [axis, withOverlays(CORE_AXIS_LABELS[axis], (o) => o.profileAxes[axis])]),
) as Record<ProfileAxis, Localized>;

const WARMTH: Record<Undertone, number> = { warm: 82, olive: 64, neutral: 50, cool: 22 };
const DEPTH: Record<SkinDepth, number> = { fair: 12, light: 26, light_medium: 42, medium: 58, tan: 74, deep: 90 };
const CONTRAST: Record<Contrast, number> = { low: 30, medium: 56, high: 84 };
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Deterministic 0–100 profile derived from the analysis, so web and mobile draw the same radar. */
export function colorProfile(analysis: FaceAnalysis): ColorProfile {
  const season = getSeason(analysis.season);
  const bright = season.id.startsWith('bright') || season.id.startsWith('true');
  const soft = season.id.startsWith('soft') || season.id.startsWith('light');
  const depth = DEPTH[analysis.skinDepth];
  const contrast = CONTRAST[analysis.contrast];
  return {
    warmth: WARMTH[analysis.undertone],
    depth,
    contrast,
    clarity: clamp((bright ? 70 : soft ? 38 : 54) + (contrast - 56) / 4),
    softness: clamp((soft ? 78 : bright ? 30 : 52) - (contrast - 56) / 4),
    lightness: clamp(100 - depth),
  };
}

function rgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Weighted RGB distance ("redmean"), good enough to rank shades. 0 = identical, ~765 = black vs white. */
function distance(a: string, b: string): number {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const rm = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
}

/**
 * How well a shade fits the user's season, as a display percentage in [60, 98].
 * Based on the closest colour in the season palette plus the user's own recommended colours.
 */
export function shadeMatch(hex: string, analysis: FaceAnalysis): number {
  const refs = [...getSeason(analysis.season).palette, ...analysis.bestColors, ...analysis.lip, ...analysis.blush];
  const best = Math.min(...refs.map((r) => distance(hex, r)));
  const avoid = Math.min(...analysis.avoidColors.map((r) => distance(hex, r)));
  const base = 98 - (best / 300) * 38;
  const penalty = avoid < best ? 8 : 0;
  return Math.max(60, Math.min(98, Math.round(base - penalty)));
}

/** Everyday makeup colour names; a shade is labelled with the nearest one. */
const NAMED_SHADES = [
  ['#D2A48C', 'Nude', 'Nude'],
  ['#F1DDBE', 'Şampanya', 'Champagne'],
  ['#FFB38A', 'Şeftali', 'Peach'],
  ['#F5A065', 'Kayısı', 'Apricot'],
  ['#F39A80', 'Somon', 'Salmon'],
  ['#F7786B', 'Mercan', 'Coral'],
  ['#C0583F', 'Kiremit', 'Terracotta'],
  ['#E0442E', 'Domates kırmızısı', 'Tomato red'],
  ['#C41E3A', 'Klasik kırmızı', 'Classic red'],
  ['#9E1B32', 'Kiraz', 'Cherry'],
  ['#7B1E2D', 'Bordo', 'Burgundy'],
  ['#5E1A2C', 'Şarap', 'Wine'],
  ['#6B2D4E', 'Erik', 'Plum'],
  ['#4E2A4F', 'Mürdüm', 'Aubergine'],
  ['#B9784E', 'Karamel', 'Caramel'],
  ['#A0673F', 'Bronz', 'Bronze'],
  ['#8B4A2B', 'Tarçın', 'Cinnamon'],
  ['#5C3A2E', 'Çikolata', 'Chocolate'],
  ['#C08081', 'Gül kurusu', 'Dusty rose'],
  ['#B07A8C', 'Mor gül', 'Mauve'],
  ['#E4718A', 'Gül pembesi', 'Rose'],
  ['#F2B8C0', 'Pudra pembe', 'Powder pink'],
  ['#F7C6D0', 'Bebek pembe', 'Baby pink'],
  ['#F06C9B', 'Şeker pembe', 'Candy pink'],
  ['#D7347E', 'Fuşya', 'Fuchsia'],
  ['#C72C5B', 'Ahududu', 'Raspberry'],
  ['#C8A2C8', 'Leylak', 'Lilac'],
  ['#B39DDB', 'Lavanta', 'Lavender'],
  ['#7E57C2', 'Menekşe', 'Violet'],
  ['#D4AF37', 'Altın', 'Gold'],
  ['#8B7D73', 'Vizon', 'Taupe'],
  ['#9CAF88', 'Adaçayı', 'Sage'],
  ['#C19A6B', 'Kamel', 'Camel'],
  ['#D8A390', 'Pembe bej', 'Rosy beige'],
  ['#A04A3A', 'Tuğla', 'Brick'],
  ['#7B5544', 'Kakao', 'Cocoa'],
  ['#7A7A4E', 'Haki', 'Khaki'],
  ['#6B6B30', 'Zeytin', 'Olive'],
  ['#2E7D5B', 'Zümrüt', 'Emerald'],
  ['#1F6F78', 'Petrol mavisi', 'Teal'],
  ['#1F2A55', 'Lacivert', 'Navy'],
  ['#A9C8E8', 'Buz mavisi', 'Icy blue'],
  ['#8C8C94', 'Gri', 'Grey'],
  ['#36363C', 'Füme', 'Charcoal'],
] as const satisfies readonly (readonly [hex: string, tr: string, en: string])[];

/** English name of a makeup colour; the key of `ContentOverlay.shades`. */
export type ShadeName = (typeof NAMED_SHADES)[number][2];

/** sRGB hex → CIELAB (D65), so colour names follow perceived difference rather than raw RGB. */
function lab(hex: string): [number, number, number] {
  const [x, y, z] = rgb(hex)
    .map((c) => {
      const v = c / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    })
    .reduce<[number, number, number]>(
      (acc, v, i) => {
        const m = [
          [0.4124 / 0.95047, 0.2126, 0.0193 / 1.08883],
          [0.3576 / 0.95047, 0.7152, 0.1192 / 1.08883],
          [0.1805 / 0.95047, 0.0722, 0.9505 / 1.08883],
        ][i]!;
        return [acc[0] + v * m[0]!, acc[1] + v * m[1]!, acc[2] + v * m[2]!];
      },
      [0, 0, 0],
    )
    .map((t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116)) as [number, number, number];
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** Human colour name for a shade hex ("Gül kurusu" / "Dusty rose"): the nearest named makeup colour (ΔE76). */
export function shadeName(hex: string, locale: Locale): string {
  const [l1, a1, b1] = lab(hex);
  let best: (typeof NAMED_SHADES)[number] = NAMED_SHADES[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const named of NAMED_SHADES) {
    const [l2, a2, b2] = lab(named[0]);
    const d = (l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2;
    if (d < bestDistance) {
      best = named;
      bestDistance = d;
    }
  }
  if (isCoreLocale(locale)) return locale === 'tr' ? best[1] : best[2];
  return CONTENT_OVERLAYS[locale].shades[best[2]];
}

/** Names for a row of shades; repeated names get "Açık"/"Koyu" (Light/Deep) by lightness so cards stay distinct. */
export function shadeNames(hexes: readonly string[], locale: Locale): string[] {
  const names = hexes.map((hex) => shadeName(hex, locale));
  return names.map((name, i) => {
    const twins = hexes.filter((_, j) => names[j] === name);
    if (twins.length < 2) return name;
    const l = lab(hexes[i]!)[0];
    const lightest = Math.max(...twins.map((h) => lab(h)[0]));
    const darkest = Math.min(...twins.map((h) => lab(h)[0]));
    const modifier = l === lightest ? 'light' : l === darkest ? 'deep' : null;
    if (!modifier) return name;
    if (isCoreLocale(locale)) {
      const lower = name.toLocaleLowerCase(locale);
      return locale === 'tr' ? `${modifier === 'light' ? 'Açık' : 'Koyu'} ${lower}` : `${modifier === 'light' ? 'Light' : 'Deep'} ${lower}`;
    }
    return interpolate(CONTENT_OVERLAYS[locale].shadeModifiers[modifier], { name });
  });
}

/** Jewellery metal that usually flatters a season, from its colour temperature. */
export type JewelleryMetal = 'gold' | 'silver' | 'gold_rose' | 'silver_white';

export function jewelleryMetal(analysis: FaceAnalysis): JewelleryMetal {
  const temperature = getSeason(analysis.season).temperature;
  if (temperature === 'warm') return 'gold';
  if (temperature === 'cool') return 'silver';
  return temperature === 'neutral_warm' ? 'gold_rose' : 'silver_white';
}
