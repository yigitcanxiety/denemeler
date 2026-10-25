import { LOOKS, type LookId } from '@tonelle/shared';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { PressableScale, Reveal } from '@/components/motion';
import { CoverImage, LOOK_IMAGES } from '@/components/portraits';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { BackTitle, Ring } from '@/components/ui';
import { WeeklyUnlock } from '@/components/weekly-unlock';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { haptic } from '@/lib/feedback';
import { isLookId, lookSummary } from '@/lib/looks';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, GUTTER, radii, spacing } from '@/theme';

/** How long the "preparing your look" build-up runs before the lock shows. */
const PREP_MS = 5200;

/**
 * Makeup try-on for people without Premium (2026-10-25, Glamour-style): no render is made.
 * A short build-up runs over their heavily blurred selfie, then "7 Gün Boyunca Kullan" unlocks it.
 */
export default function MakeupLockScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const photo = useAppStore((s) => s.photo);
  const lookId: LookId = isLookId(id) ? id : 'soft_glam';
  // Keyed: the build-up restarts for every look and every new selfie.
  return <MakeupLock key={`${lookId}:${photo?.dataUrl.length ?? 0}`} lookId={lookId} />;
}

function MakeupLock({ lookId }: { lookId: LookId }) {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const photo = useAppStore((s) => s.photo);
  const { width } = useWindowDimensions();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!photo) return;
    const started = Date.now();
    const timer = setInterval(() => {
      const ms = Date.now() - started;
      setElapsed(ms);
      if (ms >= PREP_MS) {
        clearInterval(timer);
        haptic.success();
      }
    }, 120);
    return () => clearInterval(timer);
  }, [photo]);

  if (premium) return <Redirect href="/" />;

  const ready = elapsed >= PREP_MS;
  const steps = [copy.makeupPrep1, copy.makeupPrep2, copy.makeupPrep3];
  const step = Math.min(steps.length - 1, Math.floor((elapsed / PREP_MS) * steps.length));
  const frameW = Math.min(width - GUTTER * 2, 520);
  const frameH = Math.round(frameW * 1.08);

  return (
    <Screen
      header={<BackTitle title={copy.tryOnTitle} onBack={() => router.back()} backLabel={t('common.back')} />}
      footer={photo && ready ? <WeeklyUnlock /> : null}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.chips}>
        {(Object.keys(LOOKS) as LookId[]).map((look) => {
          const active = look === lookId;
          return (
            <PressableScale
              key={look}
              onPress={() => router.setParams({ id: look })}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipOn]}
            >
              <AppText style={[styles.chipText, active && styles.chipTextOn]}>{lookSummary(look, locale).name}</AppText>
            </PressableScale>
          );
        })}
      </ScrollView>

      {photo ? (
        <View style={[styles.frame, { height: frameH }]}>
          {/* As blurred as it gets: the face is only a hint until the look is unlocked. */}
          <Image source={{ uri: photo.dataUrl }} style={StyleSheet.absoluteFill} blurRadius={60} resizeMode="cover" />
          <View style={styles.veil} />
          <View style={styles.thumbWrap}>
            <CoverImage source={LOOK_IMAGES[lookId]} focusY={0.2} style={styles.thumb} />
            <AppText variant="caption" color={colors.ink} style={styles.thumbLabel} numberOfLines={1}>
              {lookSummary(lookId, locale).name}
            </AppText>
          </View>
          {ready ? (
            <Reveal style={styles.lockCard}>
              <View style={styles.lockIcon}>
                <Icon name="lock" size={22} color={colors.onViolet} strokeWidth={2} />
              </View>
              <AppText variant="h2" align="center">
                {copy.makeupLockTitle}
              </AppText>
              <AppText variant="small" align="center" color={colors.ink}>
                {copy.makeupLockBody}
              </AppText>
            </Reveal>
          ) : (
            <View style={styles.prep} accessibilityRole="progressbar" accessibilityLabel={steps[step]}>
              <Ring size={92} stroke={6} progress={Math.min(1, elapsed / PREP_MS)} />
              <AppText style={styles.prepText} align="center">
                {`${steps[step]}…`}
              </AppText>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.frame, styles.noPhoto, { height: frameH }]}>
          <CoverImage source={LOOK_IMAGES[lookId]} focusY={0.2} style={StyleSheet.absoluteFill} />
          <View style={styles.noPhotoCard}>
            <Icon name="camera" size={22} color={colors.violet} />
            <AppText variant="small" color={colors.ink} align="center">
              {copy.needPhoto}
            </AppText>
            <Button
              label={copy.addSelfie}
              compact
              icon="camera"
              onPress={() => router.push({ pathname: '/camera', params: { returnTo: 'look' } })}
            />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -GUTTER, flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: GUTTER },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  chipTextOn: { color: colors.paper },
  frame: { borderRadius: radii.xl, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mist },
  veil: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.28)' },
  thumbWrap: { position: 'absolute', top: 14, left: 14, alignItems: 'center', gap: 4 },
  thumb: { width: 58, height: 58, borderRadius: 29, borderWidth: 3, borderColor: colors.paper, overflow: 'hidden' },
  thumbLabel: { backgroundColor: colors.floatBg, borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 2, maxWidth: 110 },
  prep: { alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg },
  prepText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  lockCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.floatBg,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: 8,
    alignItems: 'center',
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  noPhoto: { justifyContent: 'flex-end', padding: 14 },
  noPhotoCard: { backgroundColor: colors.floatBg, borderRadius: radii.card, padding: 16, gap: 10, alignItems: 'center', alignSelf: 'stretch' },
});
