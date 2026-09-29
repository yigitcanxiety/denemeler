import type { SeasonFamily } from '@tonelle/shared';

/** Five stops, deepest → palest, used for the heat-map "makeup glow" blobs. */
export type HeatPalette = readonly [string, string, string, string, string];

/** Default Tonelle glow: berry → lipstick → terracotta → peach → champagne (DESIGN §2). */
export const HEAT_DEFAULT: HeatPalette = ['#7A1F2B', '#C8354A', '#E0775E', '#F3B27A', '#FBE3C6'];

/** Season-family glows used by the dark sphere section. */
export const HEAT_SEASONS: Record<SeasonFamily, HeatPalette> = {
  spring: ['#B8402C', '#FF7F50', '#FFA05A', '#F9CF5E', '#FFF1C9'],
  summer: ['#7A4A86', '#D67BA0', '#B9A3E3', '#9DBDE6', '#E6EEF8'],
  autumn: ['#5E2F18', '#B5552F', '#C98A4B', '#8E8F46', '#E8D2A6'],
  winter: ['#4A0B26', '#A3124A', '#E86FA3', '#3552C8', '#EAF0FF'],
};

function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.slice(0, 6);
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return [200, 53, 74];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const hex2 = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');

/** Linear mix of two hex colours (t = 0 → a, t = 1 → b). */
export function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return `#${hex2(r1 + (r2 - r1) * t)}${hex2(g1 + (g2 - g1) * t)}${hex2(b1 + (b2 - b1) * t)}`.toUpperCase();
}

/** Relative luminance (0–1), for picking readable text on a swatch. */
export function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Build a heat palette from a few real colours (e.g. a user's lip / blush / eyeshadow shades). */
export function heatFrom(colors: string[]): HeatPalette {
  const [a = HEAT_DEFAULT[1], b = a, c = b] = colors;
  return [mixHex(a, '#1A0F0E', 0.35), a, b, mixHex(c, '#FFFFFF', 0.25), mixHex(c, '#FFF6EA', 0.75)];
}
