import { LOOKS } from '@tonelle/shared';
import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { SeasonCard } from '@/components/season-card';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Card, Chip, SectionTitle, SwatchRow } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { lookShades, lookSummary, resolveRecommendedLooks } from '@/lib/looks';
import { completeQuiz } from '@/lib/quiz';
import { traitChips } from '@/lib/results';
import { useAppStore } from '@/store/app-store';
import { colors, palette, radii, spacing } from '@/theme';

export default function ResultsScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);
  const quiz = useAppStore((s) => s.quiz);

  if (!analysis) return <Redirect href="/" />;
  if (!premium) return <Redirect href="/teaser" />;

  const lookIds = resolveRecommendedLooks(analysis, serverLookIds, completeQuiz(quiz));
  const qualityIssues = analysis.qualityIssues;

  return (
    <Screen
      header={
        <TopBar
          onBack={() => router.dismissTo('/')}
          backLabel={t('common.back')}
          title={t('results.title')}
          right={
            <Pressable onPress={() => router.push('/settings')} accessibilityRole="button" hitSlop={10}>
              <AppText variant="caption" color={colors.inkMuted}>
                {t('settings.title')}
              </AppText>
            </Pressable>
          }
        />
      }
    >
      <SeasonCard analysis={analysis} locale={locale} />

      <View style={styles.chips}>
        {traitChips(analysis, t).map((chip) => (
          <Chip key={chip.id} label={chip.label} value={chip.value} />
        ))}
      </View>

      <Card>
        <SectionTitle>{t('results.summaryTitle')}</SectionTitle>
        <AppText variant="body">{analysis.summary}</AppText>
      </Card>

      {qualityIssues.length ? (
        <View style={styles.quality}>
          {qualityIssues.map((issue) => (
            <AppText key={issue} variant="caption" color={colors.warning}>
              {t(`camera.qualityIssues.${issue}`)}
            </AppText>
          ))}
        </View>
      ) : null}

      <Card>
        <SectionTitle>{t('results.bestColors')}</SectionTitle>
        <SwatchRow colors={analysis.bestColors} size={48} showHex />
        <View style={styles.divider} />
        <AppText variant="label">{t('results.avoidColors')}</AppText>
        <SwatchRow colors={analysis.avoidColors} size={34} />
      </Card>

      <Card>
        <SectionTitle>{t('results.foundationTitle')}</SectionTitle>
        <AppText variant="body">{t('results.foundationUndertone', { label: analysis.foundation.undertoneLabel })}</AppText>
        <AppText variant="body">{t('results.foundationRange', { range: analysis.foundation.shadeRange })}</AppText>
      </Card>

      <Card>
        <ShadeRow title={t('results.lipTitle')} colors={analysis.lip} />
        <ShadeRow title={t('results.blushTitle')} colors={analysis.blush} />
        <ShadeRow title={t('results.eyeshadowTitle')} colors={analysis.eyeshadow} />
      </Card>

      <SectionTitle>{t('results.looksTitle')}</SectionTitle>
      {lookIds.map((id) => {
        const look = lookSummary(id, locale);
        const shades = lookShades(analysis, LOOKS[id]);
        return (
          <Pressable
            key={id}
            onPress={() => router.push({ pathname: '/look/[id]', params: { id } })}
            accessibilityRole="button"
            accessibilityLabel={`${look.name}. ${t('results.seeLook')}`}
            style={({ pressed }) => [styles.lookCard, pressed && styles.lookPressed]}
          >
            <View style={styles.lookSwatches}>
              {[...shades.lip.slice(0, 1), ...shades.blush.slice(0, 1), ...shades.eyeshadow.slice(0, 1)].map(
                (hex, i) => (
                  <View key={`${hex}-${i}`} style={[styles.lookDot, { backgroundColor: hex }]} />
                ),
              )}
            </View>
            <View style={styles.lookText}>
              <AppText variant="heading">{look.name}</AppText>
              <AppText variant="bodyMuted" numberOfLines={2}>
                {look.description}
              </AppText>
              <View style={styles.tags}>
                {look.occasions.map((o) => (
                  <View key={o} style={styles.tag}>
                    <AppText variant="caption" color={colors.inkMuted}>
                      {t(`look.occasionTag.${o}`)}
                    </AppText>
                  </View>
                ))}
              </View>
              <AppText variant="label" color={colors.accent}>
                {t('results.seeLook')} →
              </AppText>
            </View>
          </Pressable>
        );
      })}

      <Button label={t('share.title')} variant="inverse" onPress={() => router.push('/share')} />
      <Button label={t('results.newAnalysis')} variant="secondary" onPress={() => router.push('/camera')} />

      <AppText variant="caption" align="center">
        {t('results.savedOnDevice')}
      </AppText>
      <AppText variant="caption" align="center">
        {t('results.disclaimer')}
      </AppText>
    </Screen>
  );
}

function ShadeRow({ title, colors: hexes }: { title: string; colors: string[] }) {
  return (
    <View style={styles.shadeRow}>
      <AppText variant="label">{title}</AppText>
      <SwatchRow colors={hexes} size={38} />
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quality: { gap: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  shadeRow: { gap: spacing.sm },
  lookCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.card,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lookPressed: { backgroundColor: colors.surfaceSunken },
  lookSwatches: {
    width: 64,
    borderRadius: radii.lg,
    backgroundColor: palette.blush[50],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
  },
  lookDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(43,33,36,0.08)' },
  lookText: { flex: 1, gap: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 2 },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.pill, backgroundColor: colors.surfaceSunken },
});
