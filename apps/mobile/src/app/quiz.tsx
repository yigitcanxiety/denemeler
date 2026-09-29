import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { PressableScale, Reveal } from '@/components/motion';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { BackTitle, StepBar } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { QUIZ_STEPS, firstUnansweredStep } from '@/lib/quiz';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing } from '@/theme';

/**
 * Makeup preferences (opened from Profil). Optional: the answers only refine look
 * recommendations and are sent with the next analysis.
 */
export default function QuizScreen() {
  const t = useT();
  const copy = uiCopy(useLocale());
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
    if (isLast) router.back();
    else setIndex((i) => Math.min(i + 1, total - 1));
  };

  const choose = (value: string) => {
    // Values come from the shared enums for this step, so the cast is safe.
    setQuizAnswer(step.id, value as never);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (!isLast) advanceTimer.current = setTimeout(next, reduced ? 0 : 300);
  };

  const back = () => (index === 0 ? router.back() : setIndex((i) => i - 1));

  return (
    <Screen
      header={<BackTitle title={copy.preferences} onBack={back} backLabel={t('common.back')} />}
      footer={<Button label={isLast ? t('common.done') : t('common.next')} onPress={next} disabled={!selected} />}
    >
      <StepBar current={index + 1} total={total} />

      <Reveal key={step.id} style={styles.question}>
        <AppText variant="h2" accessibilityRole="header">
          {t(step.questionKey)}
        </AppText>
        <AppText variant="bodyMuted">{t(step.hintKey)}</AppText>
      </Reveal>

      <View style={styles.options} accessibilityRole="radiogroup">
        {step.options.map((option) => {
          const active = selected === option.value;
          const label = t(option.labelKey);
          return (
            <PressableScale
              key={option.value}
              onPress={() => choose(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={label}
              accessibilityState={{ selected: active, checked: active }}
              style={[styles.option, active && styles.optionOn]}
            >
              <AppText variant="label" style={styles.flex}>
                {label}
              </AppText>
              <View style={[styles.radio, active && styles.radioOn]} />
            </PressableScale>
          );
        })}
      </View>

      <AppText variant="caption" align="center">
        {t('quiz.subtitle')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  question: { gap: spacing.sm },
  options: { gap: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  optionOn: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper },
  radioOn: { borderWidth: 6, borderColor: colors.violet },
});
