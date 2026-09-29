import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Chip, MonoLabel } from '@/components/labels';
import { Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { Card } from '@/components/stack';
import { Sunburst } from '@/components/sunburst';
import { AppText } from '@/components/text';
import { Wordmark } from '@/components/top-bar';
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
import { indexLabel, seasonCompassLabels, uiCopy } from '@/lib/ui-copy';
import { api } from '@/services/api';
import { useAppStore } from '@/store/app-store';
import { colors, GUTTER, spacing } from '@/theme';

export default function AnalyzingScreen() {
  const t = useT();
  const locale = useLocale();
  const { width } = useWindowDimensions();
  const photo = useAppStore((s) => s.photo);
  const quiz = useAppStore((s) => s.quiz);
  const setAnalysis = useAppStore((s) => s.setAnalysis);

  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof errorKeyFor> | null>(null);
  const [attempt, setAttempt] = useState(0);

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
  const percent = Math.round(analyzingProgress(elapsed, done) * 100);
  const size = Math.min(width - GUTTER * 2, 360);

  return (
    <Screen
      grid="accent"
      footer={
        errorKey ? (
          <>
            <Button label={t('common.retry')} onPress={retry} icon="refresh" />
            <Button label={t('camera.retake')} variant="secondary" onPress={() => router.replace('/camera')} />
          </>
        ) : null
      }
    >
      <View style={styles.top}>
        <Wordmark color={colors.ink} size={19} />
        <Chip label={uiCopy(locale).ai} tone="ink" />
      </View>
      <AppText variant="title" accessibilityRole="header" style={styles.title}>
        {t('analyzing.title')}
      </AppText>

      <View style={styles.burst}>
        <Sunburst
          size={size}
          photoUri={photo?.dataUrl}
          percent={percent}
          labels={seasonCompassLabels(locale)}
          tag={uiCopy(locale).analyzingTag}
          active={!errorKey}
        />
      </View>

      {errorKey ? (
        <Notice tone="error" message={t(errorKey)} />
      ) : (
        <Card style={styles.status}>
          <View accessibilityLiveRegion="polite" accessible accessibilityLabel={message}>
            <Reveal key={stepIndex} distance={6}>
              <AppText variant="label" color={colors.onInk} style={styles.current}>
                {message}
              </AppText>
            </Reveal>
          </View>
          <View style={styles.steps} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {ANALYZING_STEPS.map((key, i) => {
              const state = i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo';
              return (
                <View key={key} style={styles.stepRow}>
                  <AppText
                    variant="mono"
                    color={state === 'current' ? colors.accentSoft : colors.onInkSubtle}
                    style={styles.stepIndex}
                  >
                    {indexLabel(i)}
                  </AppText>
                  <AppText
                    variant="mono"
                    color={state === 'todo' ? colors.onInkSubtle : state === 'current' ? colors.onInk : colors.onInkMuted}
                    style={styles.stepText}
                    numberOfLines={1}
                  >
                    {t(key)}
                  </AppText>
                  {state === 'done' ? <Icon name="check" size={14} color={colors.accentSoft} /> : null}
                  {state === 'current' ? <View style={styles.liveDot} /> : null}
                </View>
              );
            })}
          </View>
          {isAnalysisSlow(elapsed) ? (
            <AppText variant="mono" color={colors.onInkMuted} style={styles.slow}>
              {t('analyzing.slow')}
            </AppText>
          ) : null}
        </Card>
      )}

      <MonoLabel caps={false} color={colors.inkMuted} style={styles.privacy}>
        {t('analyzing.privacy')}
      </MonoLabel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xs },
  title: { marginTop: spacing.sm },
  burst: { alignItems: 'center', paddingVertical: spacing.sm },
  status: { gap: spacing.md },
  current: { fontSize: 17 },
  steps: { gap: 6 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepIndex: { width: 22, fontSize: 12 },
  stepText: { flex: 1, fontSize: 12.5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accentSoft },
  slow: { fontSize: 12, lineHeight: 17 },
  privacy: { textAlign: 'center', marginTop: spacing.xs },
});
