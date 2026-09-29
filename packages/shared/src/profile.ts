import type { Contrast, FaceAnalysis, Localized, SkinDepth, Undertone } from './schemas';
import { getSeason } from './seasons';

/** Axes of the colour-profile radar shown on the results screen. Descriptive, never a beauty score. */
export const PROFILE_AXES = ['warmth', 'depth', 'contrast', 'clarity', 'softness', 'lightness'] as const;
export type ProfileAxis = (typeof PROFILE_AXES)[number];
export type ColorProfile = Record<ProfileAxis, number>;

export const PROFILE_AXIS_LABELS: Record<ProfileAxis, Localized> = {
  warmth: { tr: 'Sıcaklık', en: 'Warmth' },
  depth: { tr: 'Derinlik', en: 'Depth' },
  contrast: { tr: 'Kontrast', en: 'Contrast' },
  clarity: { tr: 'Canlılık', en: 'Clarity' },
  softness: { tr: 'Yumuşaklık', en: 'Softness' },
  lightness: { tr: 'Açıklık', en: 'Lightness' },
};

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
