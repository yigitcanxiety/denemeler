import { SEASONS, localized, mockAnalysisFor, shadeMatch, t, type Locale } from '@tonelle/shared';
import { profileView } from '@/lib/profile-view';

/** Illustrative "sample result" used on the landing page (the shared mock analysis, Soft Autumn). */
export function landingSample(locale: Locale) {
  const analysis = mockAnalysisFor(locale);
  const season = SEASONS[analysis.season];
  const shades = [
    { label: t(locale, 'results.lipTitle'), hex: analysis.lip[0]! },
    { label: t(locale, 'results.blushTitle'), hex: analysis.blush[0]! },
    { label: t(locale, 'results.eyeshadowTitle'), hex: analysis.eyeshadow[0]! },
  ].map((s) => ({ ...s, fit: shadeMatch(s.hex, analysis) }));
  return {
    analysis,
    seasonName: localized(season.name, locale),
    palette: season.palette,
    undertone: t(locale, `results.undertone.${analysis.undertone}`),
    confidence: t(locale, 'results.confidence', { percent: Math.round(analysis.seasonConfidence * 100) }),
    shades,
    ...profileView(analysis, locale),
  };
}
