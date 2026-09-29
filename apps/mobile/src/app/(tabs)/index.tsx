import { mockAnalysisFor } from '@tonelle/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { IconButton } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale, Reveal } from '@/components/motion';
import { CoverImage, PORTRAITS } from '@/components/portraits';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Eyebrow, FloatChip, Pill, Ring, SwatchRow, Wordmark } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useStartAnalysis } from '@/hooks/use-start-analysis';
import { resolveRecommendedLooks } from '@/lib/looks';
import { confidencePercent, seasonText, topShades } from '@/lib/results';
import { percentLabel, uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, GUTTER, radii, shadows, spacing, TAB_CLEARANCE } from '@/theme';

export default function TodayScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const startAnalysis = useStartAnalysis();
  const { width } = useWindowDimensions();
  const analysis = useAppStore((s) => s.analysis);
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);

  // Chips over the editorial portrait show the user's own values once they have a result.
  const sample = analysis ?? mockAnalysisFor(locale);
  const season = seasonText(sample, locale);
  const fit = topShades(sample)[0]?.match ?? 90;
  const heroW = Math.min(width, 560) - GUTTER * 2;
  const heroH = Math.round(heroW * 0.9);

  const openMakeup = () => {
    if (!analysis) return startAnalysis();
    if (!premium) return router.push('/teaser');
    const [first] = resolveRecommendedLooks(analysis, serverLookIds);
    router.push({ pathname: '/look/[id]', params: { id: first ?? 'natural_glow' } });
  };

  return (
    <Screen edges={['top']} contentStyle={styles.tabContent}>
      <View style={styles.top}>
        <Wordmark size={26} />
        <IconButton icon="menu" label={copy.menu} tone="violet" onPress={() => router.navigate('/profile')} />
      </View>

      <Reveal style={styles.intro}>
        <Eyebrow label={copy.discover} />
        <AppText variant="display" align="center" style={styles.title} accessibilityRole="header">
          {copy.heroTitle}
        </AppText>
        <AppText variant="bodyMuted" align="center">
          {copy.heroLead}
        </AppText>
      </Reveal>

      <Reveal delay={80}>
        <View style={[styles.hero, { height: heroH }]} accessible accessibilityLabel={copy.heroImageLabel}>
          <LinearGradient colors={['#FFFFFF', '#F3F0FF']} style={StyleSheet.absoluteFill} />
          <CoverImage source={PORTRAITS.hero} focusY={0.18} style={StyleSheet.absoluteFill} />

          <FloatChip style={styles.chipUndertone}>
            <AppText style={styles.chipLabel}>{copy.chipUndertone}</AppText>
            <AppText style={styles.chipValue}>
              {`${t(`results.undertone.${sample.undertone}`)} · ${t(`results.skinDepth.${sample.skinDepth}`)}`}
            </AppText>
            <Pill tone="mint" label={t('results.confidence', { percent: confidencePercent(sample) })} />
          </FloatChip>

          <FloatChip style={styles.chipSeason}>
            <AppText style={styles.chipLabel}>{copy.chipSeason}</AppText>
            <AppText style={styles.chipValue}>{season.name}</AppText>
          </FloatChip>

          <FloatChip style={styles.chipFit}>
            <AppText style={styles.chipLabel}>{copy.chipFit}</AppText>
            <View style={styles.ringWrap}>
              <Ring size={40} stroke={4} progress={fit / 100} />
              <AppText style={styles.ringText}>{percentLabel(fit, locale)}</AppText>
            </View>
          </FloatChip>

          <PressableScale
            onPress={startAnalysis}
            accessibilityRole="button"
            accessibilityLabel={t('common.startAnalysis')}
            style={styles.fabWrap}
          >
            <LinearGradient colors={[colors.violet2, colors.violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
              <Icon name="sparkle" size={13} color={colors.onViolet} />
              <AppText style={styles.fabText}>Tonelle</AppText>
            </LinearGradient>
          </PressableScale>
        </View>
      </Reveal>

      <Reveal delay={160} style={styles.features}>
        <FeatureCard
          tone="violet"
          icon="palette"
          title={copy.featureColorTitle}
          body={copy.featureColorBody}
          onPress={analysis ? () => router.navigate('/results') : startAnalysis}
        />
        <FeatureCard
          tone="rose"
          icon="brush"
          title={copy.featureMakeupTitle}
          body={copy.featureMakeupBody}
          onPress={openMakeup}
        />
      </Reveal>

      {analysis ? (
        <Reveal delay={240}>
          <PressableScale
            onPress={() => router.navigate('/results')}
            accessibilityRole="button"
            accessibilityLabel={`${copy.lastResult}: ${premium ? seasonText(analysis, locale).name : ''}. ${copy.seeResults}`}
            style={styles.last}
          >
            <View style={styles.lastHead}>
              <View style={styles.flex}>
                <AppText variant="caption">{copy.lastResult}</AppText>
                <AppText variant="h2" style={styles.lastSeason} numberOfLines={1}>
                  {premium ? seasonText(analysis, locale).name : copy.yourSeasonIs}
                </AppText>
              </View>
              {premium ? null : <Pill tone="violet" icon="lock" label={copy.unlockResults} />}
              <Icon name="chevronRight" size={18} color={colors.muted} />
            </View>
            {premium ? <SwatchRow colors={analysis.bestColors.slice(0, 7)} height={22} /> : null}
          </PressableScale>
        </Reveal>
      ) : null}

      <View style={styles.privacy}>
        <Icon name="shield" size={14} color={colors.muted} />
        <AppText variant="small">{t('common.privacyBadge')}</AppText>
      </View>
    </Screen>
  );
}

function FeatureCard({
  tone,
  icon,
  title,
  body,
  onPress,
}: {
  tone: 'violet' | 'rose';
  icon: IconName;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const accent = tone === 'violet' ? colors.violet : colors.rose;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      style={[styles.feature, { backgroundColor: tone === 'violet' ? colors.violetSoft : colors.roseSoft }]}
    >
      <View style={styles.featureTop}>
        <View style={styles.featureIcon}>
          <Icon name={icon} size={18} color={accent} />
        </View>
        <Icon name="arrow" size={16} color={accent} />
      </View>
      <AppText variant="label" style={styles.featureTitle}>
        {title}
      </AppText>
      <AppText variant="small">{body}</AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tabContent: { paddingBottom: TAB_CLEARANCE },
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xs },
  intro: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.sm },
  title: { fontSize: 28, lineHeight: 31 },
  hero: { borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.mist },
  chipUndertone: { left: 10, top: 28 },
  chipSeason: { right: 10, top: '30%' },
  chipFit: { left: 10, bottom: 18, alignItems: 'center' },
  chipLabel: { fontFamily: fonts.medium, fontSize: 10.5, lineHeight: 13, color: colors.muted },
  chipValue: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, color: colors.ink, marginBottom: 2 },
  ringWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', fontFamily: fonts.bold, fontSize: 9.5, color: colors.ink },
  fabWrap: { position: 'absolute', right: 14, bottom: 16, borderRadius: radii.pill, ...shadows.button },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
  },
  fabText: { fontFamily: fonts.display, fontSize: 18, lineHeight: 22, color: colors.onViolet },
  features: { flexDirection: 'row', gap: 10 },
  feature: { flex: 1, borderRadius: radii.card, padding: 14, gap: 4, minHeight: 128 },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 15 },
  last: { borderRadius: radii.card, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 12 },
  lastHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lastSeason: { fontSize: 22, marginTop: 2 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
