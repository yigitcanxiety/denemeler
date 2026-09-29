import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { ProgressBar } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { getIsPremium } from '@/hooks/use-premium';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
  ANALYZING_MIN_MS,
  ANALYZING_STEPS,
  analyzingProgress,
  analyzingStepIndex,
  isAnalysisSlow,
} from '@/lib/analyzing';
import { errorKeyFor, isApiClientError } from '@/lib/api';
import { completeQuiz } from '@/lib/quiz';
import { api } from '@/services/api';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing } from '@/theme';

const PHOTO_HEIGHT = 360;

export default function AnalyzingScreen() {
  const t = useT();
  const locale = useLocale();
  const reduced = useReducedMotion();
  const photo = useAppStore((s) => s.photo);
  const quiz = useAppStore((s) => s.quiz);
  const setAnalysis = useAppStore((s) => s.setAnalysis);

  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof errorKeyFor> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [scan] = useState(() => new Animated.Value(0));

  // Scan line sweeping over the photo (disabled with reduce motion).
  useEffect(() => {
    if (reduced || errorKey) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scan, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, errorKey, scan]);

  // Elapsed clock driving the rotating messages and progress.
  useEffect(() => {
    if (errorKey || done) return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Date.now() - started), 250);
    return () => clearInterval(timer);
  }, [errorKey, done, attempt]);

  // The analysis request.
  useEffect(() => {
    if (!photo) {
      router.replace('/camera');
      return;
    }
    const controller = new AbortController();
    const started = Date.now();

    (async () => {
      try {
        const response = await api.analyze(
          { image: photo.dataUrl, locale, quiz: completeQuiz(quiz) },
          { signal: controller.signal },
        );
        const remaining = ANALYZING_MIN_MS - (Date.now() - started);
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
        if (controller.signal.aborted) return;
        setAnalysis(response);
        setDone(true);
        router.replace(getIsPremium() ? '/results' : '/teaser');
      } catch (error) {
        if (controller.signal.aborted) return;
        if (isApiClientError(error) && error.code === 'no_face') {
          // 422 no_face → back to the camera, which explains what went wrong.
          AccessibilityInfo.announceForAccessibility(t('errors.no_face'));
          useAppStore.getState().setPhoto(null);
          router.replace({ pathname: '/camera', params: { error: 'no_face' } });
          return;
        }
        setErrorKey(errorKeyFor(error));
      }
    })();

    return () => controller.abort();
    // `attempt` re-runs the request on retry; other values are read at request time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = () => {
    setErrorKey(null);
    setDone(false);
    setElapsed(0);
    setAttempt((a) => a + 1);
  };

  const stepIndex = analyzingStepIndex(elapsed);
  const message = t(ANALYZING_STEPS[stepIndex] ?? ANALYZING_STEPS[0]);
  const translateY = scan.interpolate({ inputRange: [0, 1], outputRange: [0, PHOTO_HEIGHT - 4] });

  return (
    <Screen
      footer={
        errorKey ? (
          <>
            <Button label={t('common.retry')} onPress={retry} />
            <Button label={t('camera.retake')} variant="secondary" onPress={() => router.replace('/camera')} />
          </>
        ) : null
      }
    >
      <AppText variant="title" align="center" accessibilityRole="header" style={styles.title}>
        {t('analyzing.title')}
      </AppText>

      <View style={styles.photoFrame}>
        {photo ? (
          <Image source={{ uri: photo.dataUrl }} style={styles.photo} resizeMode="cover" accessibilityIgnoresInvertColors />
        ) : null}
        <View style={styles.tint} />
        {!reduced && !errorKey ? (
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} pointerEvents="none" />
        ) : null}
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>

      {errorKey ? (
        <Notice tone="error" message={t(errorKey)} />
      ) : (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <ProgressBar value={analyzingProgress(elapsed, done)} label={message} />
          <AppText variant="label" align="center">
            {message}
          </AppText>
          <View style={styles.dots}>
            {ANALYZING_STEPS.map((key, i) => (
              <View key={key} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
            ))}
          </View>
          {isAnalysisSlow(elapsed) ? (
            <AppText variant="caption" align="center">
              {t('analyzing.slow')}
            </AppText>
          ) : null}
        </View>
      )}

      <AppText variant="caption" align="center">
        {t('analyzing.privacy')}
      </AppText>
    </Screen>
  );
}

const CORNER = 26;

const styles = StyleSheet.create({
  title: { marginTop: spacing.xl },
  photoFrame: {
    height: PHOTO_HEIGHT,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
  },
  photo: { width: '100%', height: '100%' },
  tint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(184,92,100,0.10)' },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accentSoft,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: colors.inkInverse },
  tl: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 10 },
  tr: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 10 },
  bl: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 10 },
  br: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },
  status: { gap: spacing.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent },
});
