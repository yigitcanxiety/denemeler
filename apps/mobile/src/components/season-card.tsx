import type { FaceAnalysis, Locale } from '@tonelle/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useT } from '@/hooks/use-i18n';
import { confidencePercent, seasonText } from '@/lib/results';
import { colors, palette, radii, shadows, spacing } from '@/theme';

import { AppText } from './text';
import { SwatchRow } from './ui';

export function SeasonCard({
  analysis,
  locale,
  showPalette = true,
  showDescription = true,
}: {
  analysis: FaceAnalysis;
  locale: Locale;
  showPalette?: boolean;
  showDescription?: boolean;
}) {
  const t = useT();
  const season = seasonText(analysis, locale);
  return (
    <View style={styles.shadow}>
      <LinearGradient
        colors={[palette.blush[100], palette.nude[100], colors.surfaceRaised]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <AppText variant="overline">{t('results.yourSeason')}</AppText>
        <AppText variant="display" accessibilityRole="header">
          {season.name}
        </AppText>
        <AppText variant="caption" color={colors.inkMuted}>
          {t('results.confidence', { percent: confidencePercent(analysis) })}
        </AppText>
        {showDescription ? <AppText variant="bodyMuted">{season.description}</AppText> : null}
        {showPalette ? <SwatchRow colors={season.palette} size={30} /> : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { borderRadius: radii.card, ...shadows.card },
  card: {
    borderRadius: radii.card,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
