import type { FaceAnalysis } from '@tonelle/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { useLocale, useT } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, radii, shadows, spacing, typography } from '@/theme';

import { Button } from './button';
import { Icon, type IconName } from './icon';
import { PressableScale, Reveal } from './motion';
import { AppText } from './text';

/** Offsets of the stacked copies that fake a blur on every platform. */
const SMEAR: [number, number][] = [
  [-4, 0], [4, 0], [0, -3], [0, 3], [-3, -2], [3, 2], [-3, 2], [3, -2], [0, 0],
];

/**
 * Blurred season name. It never renders the user's real season (a neutral decoy word is
 * smeared instead), so nothing premium leaks through the "blur".
 */
function BlurredDecoy({ text }: { text: string }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <AppText style={[styles.decoy, styles.hidden]}>{text}</AppText>
      {SMEAR.map(([x, y], i) => (
        <AppText key={i} style={[styles.decoy, styles.smear, { transform: [{ translateX: x }, { translateY: y }] }]}>
          {text}
        </AppText>
      ))}
    </View>
  );
}

const LOCKED: { icon: IconName; key: 'lockedUndertone' | 'lockedContrast' | 'lockedFaceShape' | 'lockedSkinColor' }[] = [
  { icon: 'drop', key: 'lockedUndertone' },
  { icon: 'contrast', key: 'lockedContrast' },
  { icon: 'face', key: 'lockedFaceShape' },
  { icon: 'palette', key: 'lockedSkinColor' },
];

/**
 * The "result is ready but blurred" moment (DESIGN.md §3.5): avatar with a double ring, the
 * blurred season, a gradient unlock button and four locked trait cards.
 */
export function LockedResult({ analysis }: { analysis: FaceAnalysis }) {
  const t = useT();
  const copy = uiCopy(useLocale());
  const photo = useAppStore((s) => s.photo);
  const looksCount = useAppStore((s) => s.recommendedLookIds?.length ?? 3);
  const unlock = () => router.push('/paywall');

  return (
    <View style={styles.root}>
      <Reveal style={styles.center}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            {photo ? (
              <Image source={{ uri: photo.dataUrl }} style={styles.img} resizeMode="cover" accessibilityIgnoresInvertColors />
            ) : (
              <Icon name="face" size={40} color={colors.violet} />
            )}
          </View>
        </View>
        <AppText variant="small" align="center" style={styles.yourSeason}>
          {copy.yourSeasonIs}
        </AppText>
        <BlurredDecoy text={copy.decoySeason} />
      </Reveal>

      <Reveal delay={80} style={styles.center}>
        <PressableScale onPress={unlock} accessibilityRole="button" accessibilityLabel={copy.unlockResults} style={styles.lockWrap}>
          <LinearGradient colors={['#9B86FF', colors.violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.lock}>
            <Icon name="lock" size={16} color={colors.onViolet} strokeWidth={2} />
            <AppText style={styles.lockText}>{copy.unlockResults}</AppText>
          </LinearGradient>
        </PressableScale>
        <AppText variant="small" align="center">
          {t('teaser.subtitle', { count: looksCount })}
        </AppText>
      </Reveal>

      <Reveal delay={160} style={styles.grid}>
        {LOCKED.map((item) => (
          <View key={item.key} style={styles.cell} accessible accessibilityLabel={`${copy[item.key]}. ${copy.unlockResults}`}>
            <Icon name={item.icon} size={20} color={colors.violet} />
            <AppText variant="smallStrong" align="center">
              {copy[item.key]}
            </AppText>
            <View style={styles.bar} />
          </View>
        ))}
      </Reveal>

      {analysis.qualityIssues.length ? <QualityWarning issues={analysis.qualityIssues} /> : null}
    </View>
  );
}

/** Photo-quality problems from the API as warning chips with a retake CTA. */
export function QualityWarning({ issues }: { issues: FaceAnalysis['qualityIssues'] }) {
  const t = useT();
  const copy = uiCopy(useLocale());
  return (
    <View style={styles.quality} accessibilityRole="alert">
      <View style={styles.qualityHead}>
        <Icon name="alert" size={16} color={colors.butterInk} />
        <AppText variant="smallStrong" color={colors.butterInk}>
          {copy.photoCheck}
        </AppText>
      </View>
      {issues.map((issue) => (
        <AppText key={issue} variant="small" color={colors.butterInk}>
          {t(`camera.qualityIssues.${issue}`)}
        </AppText>
      ))}
      <Button label={t('camera.retake')} variant="ghost" compact icon="camera" onPress={() => router.push('/camera')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  center: { alignItems: 'center', gap: spacing.sm },
  avatarRing: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: 'hidden',
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { width: '100%', height: '100%' },
  yourSeason: { marginTop: spacing.xs },
  decoy: { ...typography.display, fontSize: 28, lineHeight: 34, textAlign: 'center', color: colors.ink },
  hidden: { opacity: 0 },
  smear: { position: 'absolute', left: 0, right: 0, top: 0, opacity: 0.12 },
  lockWrap: { borderRadius: 14, ...shadows.button },
  lock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 24,
    minHeight: 46,
  },
  lockText: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.onViolet },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
  },
  bar: { height: 8, width: '78%', borderRadius: 4, backgroundColor: colors.violetSoft },
  quality: { backgroundColor: colors.butter, borderRadius: radii.md, padding: 14, gap: 6 },
  qualityHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
