import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { ScanPortrait } from '@/components/scan-portrait';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Eyebrow } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { getIsPremium } from '@/hooks/use-premium';
import {
  ANALYZING_MIN_MS,
  ANALYZING_STEPS,
  analyzingProgress,
  analyzingStepIndex,
  isAnalysisSlow,
} from '@/lib/analyzing';
import { errorKeyFor, isApiClientError } from '@/lib/api';
import { completeQuiz } from '@/lib/quiz';
import { percentLabel, uiCopy } from '@/lib/ui-copy';
import { api } from '@/services/api';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, spacing, typography } from '@/theme';

export default function AnalyzingScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const { width } = useWindowDimensions();
  const photo = useAppStore((s) => s.photo);
  const quiz = useAppStore((s) => s.quiz);
  const setAnalysis = useAppStore((s) => s.setAnalysis);

  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof errorKeyFor> | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Elapsed clock driving the checklist and the progress ring.
  useEffect(() => {
    if (errorKey || done) return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Date.now() - started), 200);
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
        // Let the ring reach 100% before moving on.
        await new Promise((r) => setTimeout(r, 450));
        if (controller.signal.aborted) return;
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

  const stepIndex = done ? ANALYZING_STEPS.length : analyzingStepIndex(elapsed);
  const progress = analyzingProgress(elapsed, done);
  const size = Math.min(width - 96, 260);
  const current = ANALYZING_STEPS[Math.min(stepIndex, ANALYZING_STEPS.length - 1)] ?? ANALYZING_STEPS[0];

  return (
    <Screen
      footer={
        errorKey ? (
          <>
            <Button label={t('common.retry')} onPress={retry} icon="refresh" />
            <Button label={t('camera.retake')} variant="ghost" onPress={() => router.replace('/camera')} />
          </>
        ) : null
      }
    >
      <View style={styles.head}>
        <Eyebrow label={copy.scanChip} />
        <AppText variant="h2" align="center" accessibilityRole="header">
          {copy.scanTitle}
        </AppText>
      </View>

      <View style={styles.center}>
        <ScanPortrait size={size} source={photo ? { uri: photo.dataUrl } : null} progress={progress} active={!errorKey} />
      </View>

      <AppText
        style={styles.pct}
        align="center"
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      >
        {percentLabel(progress * 100, locale)}
      </AppText>

      {errorKey ? (
        <Notice tone="error" message={t(errorKey)} />
      ) : (
        <View style={styles.steps} accessibilityLiveRegion="polite" accessible accessibilityLabel={t(current)}>
          {ANALYZING_STEPS.map((key, i) => {
            const state = i < stepIndex ? 'done' : i === stepIndex ? 'now' : 'todo';
            return (
              <Reveal key={key} delay={i * 50} style={styles.stepRow}>
                <View style={[styles.stepDot, state === 'done' && styles.stepDotDone]}>
                  {state === 'done' ? <Icon name="check" size={11} color={colors.onViolet} strokeWidth={2.6} /> : null}
                  {state === 'now' ? <View style={styles.nowDot} /> : null}
                </View>
                <AppText
                  variant="small"
                  color={state === 'done' ? colors.ink : state === 'now' ? colors.violet : colors.muted}
                  style={[styles.stepText, state === 'now' && styles.stepNow]}
                  numberOfLines={1}
                >
                  {state === 'now' ? `${t(key)}…` : t(key)}
                </AppText>
              </Reveal>
            );
          })}
          {isAnalysisSlow(elapsed) ? (
            <AppText variant="small" style={styles.slow}>
              {t('analyzing.slow')}
            </AppText>
          ) : null}
        </View>
      )}

      <View style={styles.privacy}>
        <Icon name="shield" size={14} color={colors.muted} />
        <AppText variant="caption" style={styles.flex}>
          {t('analyzing.privacy')}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flexShrink: 1 },
  head: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  center: { alignItems: 'center' },
  pct: { ...typography.number, fontSize: 48, lineHeight: 52, marginTop: -4 },
  steps: { gap: 9, paddingHorizontal: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: colors.violet, borderColor: colors.violet },
  nowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.violet },
  stepText: { flex: 1, fontSize: 13.5 },
  stepNow: { fontFamily: fonts.semibold },
  slow: { marginTop: 4 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: spacing.md },
});
