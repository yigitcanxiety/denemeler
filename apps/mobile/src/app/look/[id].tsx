import { LOOKS } from '@tonelle/shared';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Badge, Card, SectionTitle, SwatchRow } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { errorKeyFor } from '@/lib/api';
import { isLookId, localizedSteps, lookShades, lookSummary } from '@/lib/looks';
import { api } from '@/services/api';
import { useAppStore } from '@/store/app-store';
import { colors, palette, radii, spacing } from '@/theme';

const IMAGE_HEIGHT = 420;

export default function LookDetailScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysis = useAppStore((s) => s.analysis);
  const photo = useAppStore((s) => s.photo);
  const anonId = useAppStore((s) => s.anonId);
  const rendered = useAppStore((s) => (isLookId(id) ? s.renders[id] : undefined));
  const setRender = useAppStore((s) => s.setRender);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof errorKeyFor> | null>(null);
  const [showBefore, setShowBefore] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!isLookId(id) || !analysis) return <Redirect href="/" />;
  if (!premium) return <Redirect href="/teaser" />;

  const look = LOOKS[id];
  const summary = lookSummary(id, locale);
  const steps = localizedSteps(look, locale);
  const shades = lookShades(analysis, look);

  const render = async () => {
    if (!photo) {
      router.push({ pathname: '/camera', params: { returnTo: 'look' } });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setErrorKey(null);
    try {
      const response = await api.renderLook(
        { image: photo.dataUrl, lookId: id, analysis, appUserId: anonId ?? undefined, locale },
        { signal: controller.signal },
      );
      setRender(id, response.image);
      setShowBefore(false);
    } catch (error) {
      if (!controller.signal.aborted) setErrorKey(errorKeyFor(error));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <Screen header={<TopBar onBack={() => router.back()} backLabel={t('common.back')} title={summary.name} />}>
      <View style={styles.imageFrame}>
        {loading ? (
          <Skeleton label={t('look.rendering')} hint={t('look.renderingHint')} />
        ) : rendered ? (
          <>
            <Image
              source={{ uri: showBefore && photo ? photo.dataUrl : rendered }}
              style={styles.image}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              accessible
              accessibilityLabel={`${summary.name}. ${t('common.aiGeneratedNote')}`}
            />
            {!showBefore ? (
              <View style={styles.aiLabel}>
                <Badge label={t('common.aiGenerated')} tone="ink" />
              </View>
            ) : null}
            {photo ? (
              <View style={styles.toggle} accessibilityRole="tablist">
                {(['before', 'after'] as const).map((side) => {
                  const active = side === 'before' ? showBefore : !showBefore;
                  return (
                    <Pressable
                      key={side}
                      onPress={() => setShowBefore(side === 'before')}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: active }}
                      style={[styles.toggleItem, active && styles.toggleActive]}
                    >
                      <AppText variant="caption" color={active ? colors.accentContrast : colors.ink}>
                        {t(side === 'before' ? 'look.before' : 'look.after')}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.placeholder}>
            <SwatchRow colors={[...shades.lip, ...shades.blush].slice(0, 4)} size={40} />
            <AppText variant="bodyMuted" align="center">
              {summary.description}
            </AppText>
          </View>
        )}
      </View>

      {rendered && !loading ? (
        <AppText variant="caption" align="center">
          {t('common.aiGeneratedNote')}
        </AppText>
      ) : null}

      {errorKey ? <Notice tone="error" message={t(errorKey)} /> : null}

      <Button
        label={photo ? t('look.tryOn') : `${t('look.tryOn')} · ${t('camera.title')}`}
        onPress={() => void render()}
        loading={loading}
        variant={rendered ? 'secondary' : 'primary'}
      />
      {!photo ? (
        <AppText variant="caption" align="center">
          {t('common.privacyBadge')}
        </AppText>
      ) : null}
      {rendered ? (
        <Button
          label={t('look.shareLook')}
          variant="inverse"
          onPress={() => router.push({ pathname: '/share', params: { lookId: id } })}
        />
      ) : null}

      <View style={styles.meta}>
        {summary.occasions.map((o) => (
          <Badge key={o} label={t(`look.occasionTag.${o}`)} />
        ))}
        <Badge label={t(`look.intensity.${summary.intensity}`)} tone="ink" />
        <Badge label={t(`look.level.${summary.level}`)} tone="ink" />
      </View>

      <Card>
        <SectionTitle>{t('look.shadesTitle')}</SectionTitle>
        <AppText variant="label">{t('results.lipTitle')}</AppText>
        <SwatchRow colors={shades.lip} size={36} />
        <AppText variant="label">{t('results.blushTitle')}</AppText>
        <SwatchRow colors={shades.blush} size={36} />
        <AppText variant="label">{t('results.eyeshadowTitle')}</AppText>
        <SwatchRow colors={shades.eyeshadow} size={36} />
      </Card>

      <SectionTitle>{t('look.stepsTitle')}</SectionTitle>
      {steps.map((step) => (
        <View key={step.number} style={styles.step}>
          <View style={styles.stepNumber}>
            <AppText variant="label" color={colors.accent}>
              {step.number}
            </AppText>
          </View>
          <View style={styles.stepText}>
            <AppText variant="caption" color={colors.inkMuted}>
              {t('look.stepLabel', { number: step.number })}
            </AppText>
            <AppText variant="label">{step.title}</AppText>
            <AppText variant="bodyMuted">{step.body}</AppText>
          </View>
        </View>
      ))}
    </Screen>
  );
}

/** Pulsing placeholder while the look renders (static with reduce motion). */
function Skeleton({ label, hint }: { label: string; hint: string }) {
  const reduced = useReducedMotion();
  const [pulse] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, pulse]);
  return (
    <View style={styles.skeletonWrap} accessibilityRole="progressbar" accessibilityLabel={label}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.skeleton, { opacity: pulse }]} />
      <AppText variant="label" align="center">
        {label}
      </AppText>
      <AppText variant="caption" align="center">
        {hint}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  imageFrame: {
    height: IMAGE_HEIGHT,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
  },
  image: { width: '100%', height: '100%' },
  aiLabel: { position: 'absolute', top: spacing.md, left: spacing.md },
  toggle: {
    position: 'absolute',
    bottom: spacing.md,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(253,249,246,0.9)',
    borderRadius: radii.pill,
    padding: 3,
  },
  toggleItem: { paddingHorizontal: spacing.lg, paddingVertical: 6, borderRadius: radii.pill },
  toggleActive: { backgroundColor: colors.accent },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    backgroundColor: palette.blush[50],
  },
  skeletonWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.xl },
  skeleton: { backgroundColor: palette.blush[100] },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  step: { flexDirection: 'row', gap: spacing.md },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { flex: 1, gap: 2 },
});
