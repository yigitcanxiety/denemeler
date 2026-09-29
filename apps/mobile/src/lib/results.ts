import {
  PROFILE_AXES,
  PROFILE_AXIS_LABELS,
  SEASONS,
  colorProfile,
  localized,
  shadeMatch,
  type ProfileAxis,
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

export interface ProfilePoint {
  axis: ProfileAxis;
  label: string;
  value: number;
}

/** Colour-profile radar points in `PROFILE_AXES` order (descriptive 0–100, never a score). */
export function profilePoints(analysis: FaceAnalysis, locale: Locale): ProfilePoint[] {
  const profile = colorProfile(analysis);
  return PROFILE_AXES.map((axis) => ({ axis, label: localized(PROFILE_AXIS_LABELS[axis], locale), value: profile[axis] }));
}

/** The three coloured bars under the radar: warmth, contrast, softness. */
export const PROFILE_BAR_AXES = ['warmth', 'contrast', 'softness'] as const satisfies readonly ProfileAxis[];

export function profileBars(analysis: FaceAnalysis, locale: Locale): ProfilePoint[] {
  const points = profilePoints(analysis, locale);
  return PROFILE_BAR_AXES.map((axis) => points.find((p) => p.axis === axis)!);
}

export interface ShadeCard {
  kind: 'lip' | 'blush' | 'eyeshadow';
  hex: string;
  match: number;
}

/** Best-fitting shade per category with its "% uyum" (fit with the user's season). */
export function topShades(
  analysis: FaceAnalysis,
  shades: { lip: readonly string[]; blush: readonly string[]; eyeshadow: readonly string[] } = analysis,
): ShadeCard[] {
  const kinds = ['lip', 'blush', 'eyeshadow'] as const;
  return kinds.flatMap((kind) => {
    const ranked = shades[kind]
      .map((hex) => ({ kind, hex, match: shadeMatch(hex, analysis) }))
      .sort((a, b) => b.match - a.match);
    return ranked[0] ? [ranked[0]] : [];
  });
}
