import { shadeMatch, type FaceAnalysis, type Locale } from '@tonelle/shared';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button, IconButton } from '@/components/button';
import { ProfileBars, RadarChart } from '@/components/charts';
import { Icon, type IconName } from '@/components/icon';
import { LockedResult, QualityWarning } from '@/components/locked-result';
import { PressableScale, Reveal } from '@/components/motion';
import { CoverImage, PORTRAITS } from '@/components/portraits';
import { Screen } from '@/components/screen';
import { SeasonCard, ShadeCard } from '@/components/shade-card';
import { AppText } from '@/components/text';
import { Card, SectionTitle, SwatchRow } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useStartAnalysis } from '@/hooks/use-start-analysis';
import { lookSummary, resolveRecommendedLooks } from '@/lib/looks';
import { displayTrial } from '@/lib/paywall';
import { completeQuiz } from '@/lib/quiz';
import { profileBars, profilePoints, traitChips, type TraitChip } from '@/lib/results';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, GUTTER, radii, spacing, TAB_CLEARANCE } from '@/theme';

const LOOK_PORTRAITS = [PORTRAITS.three, PORTRAITS.two, PORTRAITS.hero];

/** Sonuçlar tab: empty state, locked result, or the full colour result (DESIGN.md §3.7). */
export default function ResultsScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);
  const startAnalysis = useStartAnalysis();

  const title = (
    <View style={styles.top}>
      <AppText variant="h2" accessibilityRole="header">
        {t('results.title')}
      </AppText>
      {analysis && premium ? (
        <IconButton icon="share" label={t('share.title')} onPress={() => router.push('/share')} />
      ) : null}
    </View>
  );

  if (!analysis) {
    return (
      <Screen edges={['top']} contentStyle={styles.tabContent}>
        {title}
        <Card tone="mist" style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="scan" size={26} color={colors.violet} />
          </View>
          <AppText variant="section" align="center">
            {copy.noResultTitle}
          </AppText>
          <AppText variant="bodyMuted" align="center">
            {copy.noResultBody}
          </AppText>
          <Button label={copy.startAnalysis} icon="sparkle" onPress={startAnalysis} style={styles.emptyCta} />
        </Card>
      </Screen>
    );
  }

  if (!premium) {
    return (
      <Screen edges={['top']} contentStyle={styles.tabContent}>
        {title}
        <LockedResult analysis={analysis} />
        <Button label={`${copy.trialCta(displayTrial(locale).days)} ✦`} onPress={() => router.push('/paywall')} />
      </Screen>
    );
  }

  return <FullResult analysis={analysis} locale={locale} />;
}

function FullResult({ analysis, locale }: { analysis: FaceAnalysis; locale: Locale }) {
  const t = useT();
  const copy = uiCopy(locale);
  const { width } = useWindowDimensions();
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);
  const quiz = useAppStore((s) => s.quiz);
  const startAnalysis = useStartAnalysis();
  const contentW = Math.min(width, 600) - GUTTER * 2;
  const chips = traitChips(analysis, t);
  const byId = (id: TraitChip['id']) => chips.find((c) => c.id === id)!;
  const lookIds = resolveRecommendedLooks(analysis, serverLookIds, completeQuiz(quiz));
  const categories = [
    { kind: 'lip', hexes: analysis.lip },
    { kind: 'blush', hexes: analysis.blush },
    { kind: 'eyeshadow', hexes: analysis.eyeshadow },
  ] as const;
  const traits: { chip: TraitChip; icon: IconName }[] = [
    { chip: byId('undertone'), icon: 'drop' },
    { chip: byId('contrast'), icon: 'contrast' },
    { chip: byId('faceShape'), icon: 'face' },
    { chip: byId('eyeShape'), icon: 'eye' },
  ];

  return (
    <Screen edges={['top']} contentStyle={styles.tabContent}>
      <View style={styles.top}>
        <AppText variant="h2" accessibilityRole="header">
          {t('results.title')}
        </AppText>
        <IconButton icon="share" label={t('share.title')} onPress={() => router.push('/share')} />
      </View>

      <Reveal>
        <SeasonCard analysis={analysis} locale={locale} />
      </Reveal>

      {analysis.qualityIssues.length ? <QualityWarning issues={analysis.qualityIssues} /> : null}

      <Reveal delay={60}>
        <Card style={styles.gap}>
          <SectionTitle>{copy.radarTitle}</SectionTitle>
          <RadarChart points={profilePoints(analysis, locale)} width={contentW - 28} />
          <ProfileBars bars={profileBars(analysis, locale)} />
        </Card>
      </Reveal>

      <View style={styles.gapSm}>
        <SectionTitle>{copy.traitsTitle}</SectionTitle>
        <View style={styles.grid}>
          {traits.map(({ chip, icon }) => (
            <View key={chip.id} style={styles.trait} accessible accessibilityLabel={`${chip.label}: ${chip.value}`}>
              <View style={styles.traitIcon}>
                <Icon name={icon} size={16} color={colors.violet} />
              </View>
              <AppText variant="caption">{chip.label}</AppText>
              <AppText variant="label" numberOfLines={2}>
                {chip.value}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <Card tone="mist" style={styles.gapSm}>
        <AppText variant="label">{t('results.summaryTitle')}</AppText>
        <AppText variant="small" color={colors.ink} style={styles.summary}>
          {analysis.summary}
        </AppText>
      </Card>

      <View style={styles.gapSm}>
        <SectionTitle>{t('results.bestColors')}</SectionTitle>
        <SwatchRow colors={analysis.bestColors} height={44} radius={12} gap={6} />
      </View>
      <View style={styles.gapSm}>
        <SectionTitle>{t('results.avoidColors')}</SectionTitle>
        <View style={styles.avoid}>
          <SwatchRow colors={analysis.avoidColors} height={30} radius={10} gap={6} />
        </View>
      </View>

      <Card style={styles.foundation}>
        <View style={styles.foundationIcon}>
          <Icon name="drop" size={18} color={colors.rose} />
        </View>
        <View style={styles.flex}>
          <AppText variant="label">{t('results.foundationTitle')}</AppText>
          <AppText variant="small">{t('results.foundationUndertone', { label: analysis.foundation.undertoneLabel })}</AppText>
          <AppText variant="small" color={colors.ink}>
            {t('results.foundationRange', { range: analysis.foundation.shadeRange })}
          </AppText>
        </View>
      </Card>

      <View style={styles.gapSm}>
        <SectionTitle>{copy.shadesTitle}</SectionTitle>
        {categories.map((cat) => (
          <View key={cat.kind} style={styles.gapXs}>
            <AppText variant="smallStrong">{copy[cat.kind]}</AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
              style={styles.bleed}
            >
              {[...cat.hexes]
                .map((hex) => ({ kind: cat.kind, hex, match: shadeMatch(hex, analysis) }))
                .sort((a, b) => b.match - a.match)
                .map((shade) => (
                  <ShadeCard key={shade.hex} shade={shade} locale={locale} style={styles.shade} />
                ))}
            </ScrollView>
          </View>
        ))}
      </View>

      <View style={styles.gapSm}>
        <SectionTitle>{t('results.looksTitle')}</SectionTitle>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll} style={styles.bleed}>
          {lookIds.map((id, i) => {
            const look = lookSummary(id, locale);
            return (
              <PressableScale
                key={id}
                onPress={() => router.push({ pathname: '/look/[id]', params: { id } })}
                accessibilityRole="button"
                accessibilityLabel={`${look.name}. ${t('look.tryOn')}`}
                style={styles.look}
              >
                <CoverImage source={LOOK_PORTRAITS[i % LOOK_PORTRAITS.length]!} focusY={0.2} style={styles.lookImg} />
                <View style={styles.lookText}>
                  <AppText variant="label" numberOfLines={1}>
                    {look.name}
                  </AppText>
                  <View style={styles.tryRow}>
                    <Icon name="sparkle" size={11} color={colors.rose} />
                    <AppText variant="caption" color={colors.roseInk}>
                      {t('look.tryOn')}
                    </AppText>
                  </View>
                </View>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      <Button label={t('share.title')} icon="share" onPress={() => router.push('/share')} />
      <Button label={t('results.newAnalysis')} variant="ghost" icon="refresh" onPress={startAnalysis} />

      <AppText variant="caption" align="center">
        {t('results.savedOnDevice')}
      </AppText>
      <AppText variant="caption" align="center" style={styles.disclaimer}>
        {t('results.disclaimer')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tabContent: { paddingBottom: TAB_CLEARANCE },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, paddingTop: spacing.xs },
  gap: { gap: spacing.md },
  gapSm: { gap: 10 },
  gapXs: { gap: 6 },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyCta: { alignSelf: 'stretch', marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trait: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 12,
    gap: 3,
  },
  traitIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  summary: { lineHeight: 19 },
  avoid: { opacity: 0.9 },
  foundation: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  foundationIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bleed: { marginHorizontal: -GUTTER },
  hScroll: { gap: 10, paddingHorizontal: GUTTER },
  shade: { width: 108 },
  look: { width: 150, borderRadius: radii.card, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  lookImg: { height: 170, backgroundColor: colors.mist },
  lookText: { padding: 10, gap: 3 },
  tryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  disclaimer: { paddingHorizontal: spacing.md },
});
