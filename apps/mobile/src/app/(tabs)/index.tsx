import { mockAnalysisFor } from '@tonelle/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Assistant } from '@/components/assistant';
import { IconButton } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale, Reveal } from '@/components/motion';
import { CoverImage, PORTRAITS } from '@/components/portraits';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Eyebrow, FloatChip, Pill, SwatchRow, Wordmark } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useStartAnalysis, useStartSkinAnalysis } from '@/hooks/use-start-analysis';
import { resolveRecommendedLooks } from '@/lib/looks';
import { seasonText } from '@/lib/results';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, GUTTER, radii, spacing, TAB_CLEARANCE } from '@/theme';

export default function TodayScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const startAnalysis = useStartAnalysis();
  const startSkin = useStartSkinAnalysis();
  const { width } = useWindowDimensions();
  const analysis = useAppStore((s) => s.analysis);
  const skin = useAppStore((s) => s.skin);
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);

  // Chips over the editorial portrait show the user's own values once they have a result.
  const sample = analysis ?? mockAnalysisFor(locale);
  const season = seasonText(sample, locale);
  const heroW = Math.min(width, 560) - GUTTER * 2;
  const heroH = Math.round(heroW * 0.6);

  const openMakeup = () => {
    if (!analysis) return startAnalysis();
    if (!premium) return router.push('/teaser');
    const [first] = resolveRecommendedLooks(analysis, serverLookIds);
    router.push({ pathname: '/look/[id]', params: { id: first ?? 'natural_glow' } });
  };

  const openSkin = () => (skin && premium ? router.push('/skin') : startSkin());

  return (
    <Screen edges={['top']} contentStyle={styles.tabContent} overlay={<Assistant screen="home" />}>
      <View style={styles.top}>
        <Wordmark size={26} />
        <IconButton icon="menu" label={copy.menu} tone="violet" onPress={() => router.navigate('/profile')} />
      </View>

      <Reveal style={styles.intro}>
        <Eyebrow label={copy.discover} />
        <AppText variant="display" align="center" style={styles.title} accessibilityRole="header">
          {copy.heroTitle}
        </AppText>
      </Reveal>

      <Reveal delay={80}>
        <View style={[styles.hero, { height: heroH }]} accessible accessibilityLabel={analysis ? copy.heroImageLabel : `${copy.heroImageLabel} (${copy.sample})`}>
          <LinearGradient colors={['#FFFFFF', '#F3F0FF']} style={StyleSheet.absoluteFill} />
          <CoverImage source={PORTRAITS.hero} focusY={0.18} style={StyleSheet.absoluteFill} />

          {analysis ? null : <Pill tone="butter" label={copy.sample} style={styles.sample} />}

          <FloatChip style={styles.chipSeason}>
            <AppText style={styles.chipLabel}>{copy.chipSeason}</AppText>
            <AppText style={styles.chipValue}>{season.name}</AppText>
          </FloatChip>
        </View>
      </Reveal>

      <Reveal delay={160} style={styles.modes}>
        <ModeCard
          tone="violet"
          icon="palette"
          title={copy.modeColorTitle}
          body={copy.modeColorBody}
          onPress={startAnalysis}
        />
        <ModeCard tone="rose" icon="brush" title={copy.modeMakeupTitle} body={copy.modeMakeupBody} onPress={openMakeup} />
        <ModeCard tone="mint" icon="drop" title={copy.modeSkinTitle} body={copy.modeSkinBody} onPress={openSkin} />
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

const MODE_TONES = {
  violet: { bg: colors.violetSoft, fg: colors.violet },
  rose: { bg: colors.roseSoft, fg: colors.roseInk },
  mint: { bg: colors.mint, fg: colors.mintInk },
} as const;

/** Big full-width mode button: what the app does, one per analysis. */
function ModeCard({
  tone,
  icon,
  title,
  body,
  onPress,
}: {
  tone: keyof typeof MODE_TONES;
  icon: IconName;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const { bg, fg } = MODE_TONES[tone];
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      style={[styles.mode, { backgroundColor: bg }]}
    >
      <View style={styles.modeIcon}>
        <Icon name={icon} size={26} color={fg} />
      </View>
      <View style={styles.flex}>
        <AppText style={styles.modeTitle} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="small" color={colors.ink} style={styles.modeBody} numberOfLines={2}>
          {body}
        </AppText>
      </View>
      <Icon name="chevronRight" size={20} color={fg} strokeWidth={2} />
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
  sample: { position: 'absolute', right: 10, top: 10 },
  chipSeason: { left: 10, bottom: 12 },
  chipLabel: { fontFamily: fonts.medium, fontSize: 10.5, lineHeight: 13, color: colors.muted },
  chipValue: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, color: colors.ink, marginBottom: 2 },
  modes: { gap: 10 },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 76, borderRadius: radii.card, paddingVertical: 12, paddingHorizontal: 14 },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTitle: { fontFamily: fonts.semibold, fontSize: 17.5, lineHeight: 23, color: colors.ink },
  modeBody: { fontSize: 13, lineHeight: 18 },
  last: { borderRadius: radii.card, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 12 },
  lastHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lastSeason: { fontSize: 22, marginTop: 2 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
