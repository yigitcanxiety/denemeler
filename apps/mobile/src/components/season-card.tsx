import type { FaceAnalysis, Locale } from '@tonelle/shared';
import { StyleSheet, View } from 'react-native';

import { useT } from '@/hooks/use-i18n';
import { confidencePercent, seasonText } from '@/lib/results';
import { colors, spacing } from '@/theme';

import { BigNumber } from './big-number';
import { FitWordmark } from './fit-wordmark';
import { Chip, MonoLabel } from './labels';
import { SegmentedProgress } from './segmented-progress';
import { Card } from './stack';
import { AppText } from './text';
import { SwatchBar } from './ui';

/**
 * Results hero: dark card with the season in huge type, then the BRIK "79% ||||||" row showing the
 * model's season confidence (never a beauty score).
 */
export function SeasonCard({
  analysis,
  locale,
  showPalette = false,
  showDescription = true,
  chip,
}: {
  analysis: FaceAnalysis;
  locale: Locale;
  showPalette?: boolean;
  showDescription?: boolean;
  chip?: string;
}) {
  const t = useT();
  const season = seasonText(analysis, locale);
  const percent = confidencePercent(analysis);
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <MonoLabel color={colors.onInkMuted} slash>
          {t('results.yourSeason')}
        </MonoLabel>
        {chip ? <Chip label={chip} tone="soft" /> : null}
      </View>
      <FitWordmark lines={season.name.split(' ')} color={colors.onInk} maxSize={78} delay={150} />
      <View style={styles.meter}>
        <BigNumber value={percent} suffix="%" size={48} color={colors.accentSoft} delay={300} />
        <SegmentedProgress
          value={percent / 100}
          onInk
          segments={16}
          height={34}
          style={styles.flex}
          label={t('results.confidence', { percent })}
        />
      </View>
      <MonoLabel color={colors.onInkSubtle}>{t('results.confidence', { percent })}</MonoLabel>
      {showDescription ? (
        <AppText variant="body" color={colors.onInkMuted} style={styles.desc}>
          {season.description}
        </AppText>
      ) : null}
      {showPalette ? <SwatchBar colors={[...season.palette]} height={28} onInk /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, paddingTop: 22, paddingBottom: 24 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  meter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  flex: { flex: 1 },
  desc: { fontSize: 15, lineHeight: 22 },
});
