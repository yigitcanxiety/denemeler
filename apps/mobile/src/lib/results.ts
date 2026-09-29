import {
  SEASONS,
  localized,
  type FaceAnalysis,
  type Locale,
  type TranslationKey,
  type TranslationVars,
} from '@tonelle/shared';

type Translate = (key: TranslationKey, vars?: TranslationVars) => string;

export interface TraitChip {
  id: 'undertone' | 'skinDepth' | 'contrast' | 'faceShape' | 'eyeShape';
  label: string;
  value: string;
}

/** Descriptive trait chips (never scores). */
export function traitChips(analysis: FaceAnalysis, t: Translate): TraitChip[] {
  return [
    { id: 'undertone', label: t('results.undertoneTitle'), value: t(`results.undertone.${analysis.undertone}`) },
    { id: 'skinDepth', label: t('results.skinDepthTitle'), value: t(`results.skinDepth.${analysis.skinDepth}`) },
    { id: 'contrast', label: t('results.contrastTitle'), value: t(`results.contrast.${analysis.contrast}`) },
    { id: 'faceShape', label: t('results.faceShapeTitle'), value: t(`results.faceShape.${analysis.faceShape}`) },
    { id: 'eyeShape', label: t('results.eyeShapeTitle'), value: t(`results.eyeShape.${analysis.eyeShape}`) },
  ];
}

/** Model confidence in the season as a whole percent (0–100). */
export function confidencePercent(analysis: Pick<FaceAnalysis, 'seasonConfidence'>): number {
  return Math.round(Math.min(1, Math.max(0, analysis.seasonConfidence)) * 100);
}

export function seasonText(analysis: Pick<FaceAnalysis, 'season'>, locale: Locale) {
  const season = SEASONS[analysis.season];
  return {
    name: localized(season.name, locale),
    description: localized(season.description, locale),
    family: season.family,
    palette: season.palette,
  };
}

/** Chooses black or white text for a swatch background (WCAG relative luminance). */
export function readableTextOn(hex: string): '#2b2124' | '#ffffff' {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return '#2b2124';
  const value = parseInt(match[1] as string, 16);
  const channel = (shift: number) => {
    const c = ((value >> shift) & 0xff) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
  return luminance > 0.4 ? '#2b2124' : '#ffffff';
}
