import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { LockedSection } from '@/components/locked-section';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Card } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { seasonText } from '@/lib/results';
import { useAppStore } from '@/store/app-store';
import { colors, palette, radii, spacing } from '@/theme';

/** Neutral decoy swatches rendered under the blur — never the user's real palette. */
const DECOY = [palette.nude[300], palette.blush[300], palette.nude[500], palette.blush[400], palette.nude[400], palette.blush[200]];

const INCLUDES = [
  'teaser.includesSeason',
  'teaser.includesPalette',
  'teaser.includesShades',
  'teaser.includesLooks',
  'teaser.includesSteps',
] as const;

export default function TeaserScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);
  const looksCount = useAppStore((s) => s.recommendedLookIds?.length ?? 3);

  if (!analysis) return <Redirect href="/" />;
  if (premium) return <Redirect href="/results" />;

  const season = seasonText(analysis, locale);

  return (
    <Screen
      header={<TopBar onBack={() => router.dismissTo('/')} backLabel={t('common.back')} />}
      footer={
        <>
          <Button label={t('teaser.unlock')} onPress={() => router.push('/paywall')} />
          <AppText variant="caption" align="center">
            {t('common.privacyBadge')}
          </AppText>
        </>
      }
    >
      <AppText variant="overline">{t('teaser.title')}</AppText>
      <AppText variant="bodyMuted">{t('teaser.subtitle', { count: looksCount })}</AppText>

      <Card style={styles.seasonCard}>
        <AppText variant="caption" color={colors.inkMuted}>
          {t('teaser.seasonLocked')}
        </AppText>
        <AppText variant="display" accessibilityRole="header">
          {season.name}
        </AppText>
      </Card>

      <LockedSection title={t('teaser.paletteLocked')}>
        <View style={styles.decoyRow}>
          {DECOY.map((c, i) => (
            <View key={`${c}-${i}`} style={[styles.decoySwatch, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.decoyLine} />
        <View style={[styles.decoyLine, styles.decoyShort]} />
      </LockedSection>

      <LockedSection title={t('teaser.looksLocked')}>
        <View style={styles.decoyLooks}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.decoyLook} />
          ))}
        </View>
      </LockedSection>

      <View style={styles.includes}>
        <AppText variant="heading">{t('teaser.includesTitle')}</AppText>
        {INCLUDES.map((key) => (
          <View key={key} style={styles.includeRow}>
            <AppText variant="label" color={colors.accent}>
              ✓
            </AppText>
            <AppText variant="body" style={styles.flex}>
              {t(key)}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  seasonCard: { alignItems: 'flex-start', backgroundColor: colors.accentSoft, borderColor: colors.accentSoft },
  decoyRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  decoySwatch: { width: 40, height: 40, borderRadius: 20 },
  decoyLine: { height: 12, borderRadius: 6, backgroundColor: colors.surfaceSunken },
  decoyShort: { width: '60%' },
  decoyLooks: { flexDirection: 'row', gap: spacing.md },
  decoyLook: { flex: 1, height: 120, borderRadius: radii.lg, backgroundColor: palette.blush[100] },
  includes: { gap: spacing.md, marginTop: spacing.sm },
  includeRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
});
