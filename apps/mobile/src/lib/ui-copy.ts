import type { Locale, SeasonFamily } from '@tonelle/shared';

import { intlTag } from './locale';

/**
 * Short design-only labels (mono tags, nav segments) that are not part of the shared
 * dictionary. Kept tiny and bilingual (TR default + EN); longer copy belongs in @tonelle/shared.
 */
const COPY = {
  tr: {
    analyzingTag: 'ANALİZ EDİLİYOR…',
    navResults: 'Sonuçlar',
    navLooks: 'Görünümler',
    premium: 'PREMIUM',
    selected: 'SEÇİLİ',
    ai: 'AI',
    palette: 'Palet',
    free: 'ÜCRETSİZ',
    locked: 'KİLİTLİ',
    season: { spring: 'İlkbahar', summer: 'Yaz', autumn: 'Sonbahar', winter: 'Kış' },
  },
  en: {
    analyzingTag: 'ANALYZING…',
    navResults: 'Results',
    navLooks: 'Looks',
    premium: 'PREMIUM',
    selected: 'SELECTED',
    ai: 'AI',
    palette: 'Palette',
    free: 'FREE',
    locked: 'LOCKED',
    season: { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' },
  },
} as const;

export type UiCopy = (typeof COPY)[Locale];

export function uiCopy(locale: Locale): UiCopy {
  return COPY[locale] ?? COPY.en;
}

/** Locale-aware uppercase (Turkish dotted/dotless i: "i" → "İ", "ı" → "I"). */
export function upper(text: string, locale: Locale): string {
  return text.toLocaleUpperCase(intlTag(locale));
}

/** Season family labels in compass order N, E, S, W for the sunburst. */
export function seasonCompassLabels(locale: Locale): [string, string, string, string] {
  const s = uiCopy(locale).season;
  const order: SeasonFamily[] = ['spring', 'summer', 'autumn', 'winter'];
  const labels = order.map((f) => upper(s[f], locale));
  return [labels[0]!, labels[1]!, labels[2]!, labels[3]!];
}

/** Zero-padded counter split into dimmed leading zeros and the significant digits ("007" → ["00", "7"]). */
export function paddedCounter(value: number, width = 3): { lead: string; digits: string } {
  const n = Math.max(0, Math.round(value));
  const str = String(n).padStart(width, '0');
  const firstSig = str.search(/[1-9]/);
  if (firstSig === -1) return { lead: str.slice(0, -1), digits: str.slice(-1) };
  return { lead: str.slice(0, firstSig), digits: str.slice(firstSig) };
}

/** Two-digit index label for numbered tags ("01"). */
export function indexLabel(index: number): string {
  return String(index + 1).padStart(2, '0');
}
