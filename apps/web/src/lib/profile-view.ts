import { PROFILE_AXES, PROFILE_AXIS_LABELS, colorProfile, localized, type FaceAnalysis, type Locale } from '@tonelle/shared';

export const BAR_COLORS = {
  warmth: 'var(--color-chart-warmth)',
  contrast: 'var(--color-chart-contrast)',
  softness: 'var(--color-chart-softness)',
} as const;

/** Radar axes + the three coloured bars for an analysis (shared by the landing and results). */
export function profileView(analysis: FaceAnalysis, locale: Locale) {
  const profile = colorProfile(analysis);
  const axes = PROFILE_AXES.map((axis) => ({ label: localized(PROFILE_AXIS_LABELS[axis], locale), value: profile[axis] }));
  const bars = (['warmth', 'contrast', 'softness'] as const).map((axis) => ({
    label: localized(PROFILE_AXIS_LABELS[axis], locale),
    value: profile[axis],
    color: BAR_COLORS[axis],
  }));
  return { profile, axes, bars };
}
