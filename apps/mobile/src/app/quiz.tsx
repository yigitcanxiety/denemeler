import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { ProgressBar } from '@/components/ui';
import { useT } from '@/hooks/use-i18n';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { QUIZ_STEPS, firstUnansweredStep } from '@/lib/quiz';
import { useAppStore } from '@/store/app-store';
import { colors, radii, shadows, spacing } from '@/theme';

export default function QuizScreen() {
  const t = useT();
  const reduced = useReducedMotion();
  const answers = useAppStore((s) => s.quiz);
  const setQuizAnswer = useAppStore((s) => s.setQuizAnswer);
  const [index, setIndex] = useState(() => Math.min(firstUnansweredStep(answers), QUIZ_STEPS.length - 1));
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const step = QUIZ_STEPS[index] ?? QUIZ_STEPS[0]!;
  const selected = answers[step.id];
  const total = QUIZ_STEPS.length;
  const isLast = index === total - 1;

  const next = () => {
    if (isLast) router.push('/camera');
    else setIndex((i) => Math.min(i + 1, total - 1));
  };

  const choose = (value: string) => {
    // Values come from the shared enums for this step, so the cast is safe.
    setQuizAnswer(step.id, value as never);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (!isLast) advanceTimer.current = setTimeout(next, reduced ? 0 : 260);
  };

  const back = () => (index === 0 ? router.back() : setIndex((i) => i - 1));

  return (
    <Screen
      header={
        <TopBar
          onBack={back}
          backLabel={t('common.back')}
          title={t('quiz.progress', { current: index + 1, total })}
          right={
            <Pressable onPress={() => router.push('/camera')} accessibilityRole="button" hitSlop={10}>
              <AppText variant="label" color={colors.inkMuted}>
                {t('common.skip')}
              </AppText>
            </Pressable>
          }
        />
      }
      footer={<Button label={isLast ? t('common.continue') : t('common.next')} onPress={next} disabled={!selected} />}
    >
      <ProgressBar value={(index + (selected ? 1 : 0)) / total} label={t('common.stepOf', { current: index + 1, total })} />
      {index === 0 ? (
        <View style={styles.intro}>
          <AppText variant="overline">{t('quiz.title')}</AppText>
          <AppText variant="bodyMuted">{t('quiz.subtitle')}</AppText>
        </View>
      ) : null}
      <AppText variant="title" accessibilityRole="header">
        {t(step.questionKey)}
      </AppText>
      <AppText variant="bodyMuted">{t(step.hintKey)}</AppText>
      <View style={styles.options} accessibilityRole="radiogroup">
        {step.options.map((option) => {
          const active = selected === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => choose(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active, checked: active }}
              style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.optionPressed]}
            >
              <AppText variant="label" color={active ? colors.accent : colors.ink}>
                {t(option.labelKey)}
              </AppText>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.xs },
  options: { gap: spacing.md, marginTop: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    minHeight: 60,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  optionActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft, ...shadows.soft },
  optionPressed: { backgroundColor: colors.surfaceSunken },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
});
