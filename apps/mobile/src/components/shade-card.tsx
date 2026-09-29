import type { FaceAnalysis, Locale } from '@tonelle/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { seasonText, type ShadeCard as ShadeCardData } from '@/lib/results';
import { percentLabel, uiCopy } from '@/lib/ui-copy';
import { colors, radii, seasonGradient } from '@/theme';

import { AppText } from './text';
import { Eyebrow, MatchPill, SwatchRow } from './ui';

/** Mixes a hex colour with white (0 = colour, 1 = white) for the soft well behind a tube. */
function tint(hex: string, amount: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const ch = (shift: number) => Math.round(((n >> shift) & 255) + (255 - ((n >> shift) & 255)) * amount);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/** Shade card: "% uyum" pill, colour tube in a tinted well, name and hex. */
export function ShadeCard({
  shade,
  locale,
  style,
}: {
  shade: ShadeCardData;
  locale: Locale;
  style?: StyleProp<ViewStyle>;
}) {
  const copy = uiCopy(locale);
  const name = copy[shade.kind];
  return (
    <View style={[styles.card, style]} accessible accessibilityLabel={`${name} ${shade.hex}. ${copy.match(percentLabel(shade.match, locale))}`}>
      <MatchPill percent={shade.match} />
      <View style={[styles.well, { backgroundColor: tint(shade.hex, 0.84) }]}>
        <View style={[styles.bullet, { backgroundColor: shade.hex }]} />
        <View style={styles.case} />
      </View>
      <AppText variant="smallStrong" numberOfLines={1}>
        {name}
      </AppText>
      <AppText variant="caption">{shade.hex.toUpperCase()}</AppText>
    </View>
  );
}

/** Gradient season card: eyebrow, serif season name and the season palette. */
export function SeasonCard({ analysis, locale }: { analysis: FaceAnalysis; locale: Locale }) {
  const season = seasonText(analysis, locale);
  const gradient = seasonGradient[season.family];
  return (
    <LinearGradient colors={[...gradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.season}>
      <Eyebrow label={uiCopy(locale).yourSeasonIs} tone="glass" sparkle={false} />
      <AppText variant="display" style={styles.seasonName} accessibilityRole="header">
        {season.name}
      </AppText>
      <AppText variant="small" color={colors.ink} style={styles.seasonDesc}>
        {season.description}
      </AppText>
      <SwatchRow colors={season.palette.slice(0, 7)} height={30} radius={9} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 0,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 10,
    gap: 6,
    backgroundColor: colors.paper,
  },
  well: { height: 66, borderRadius: 11, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  bullet: { width: 18, height: 30, borderTopLeftRadius: 9, borderTopRightRadius: 4 },
  case: { width: 24, height: 16, borderRadius: 3, backgroundColor: 'rgba(23,20,31,0.16)' },
  season: { borderRadius: radii.xl, padding: 16, gap: 10 },
  seasonName: { fontSize: 34, lineHeight: 38 },
  seasonDesc: { opacity: 0.8 },
});
