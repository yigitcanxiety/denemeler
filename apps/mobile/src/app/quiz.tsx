import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { MonoLabel } from '@/components/labels';
import { Reveal } from '@/components/motion';
import { Screen } from '@/components/screen';
import { SegmentedProgress } from '@/components/segmented-progress';
import { Card } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useT } from '@/hooks/use-i18n';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { QUIZ_STEPS, firstUnansweredStep } from '@/lib/quiz';
import { indexLabel } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, motion, radii, spacing } from '@/theme';

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
    if (!isLast) advanceTimer.current = setTimeout(next, reduced ? 0 : 320);
  };

  const back = () => (index === 0 ? router.back() : setIndex((i) => i - 1));

  return (
    <Screen
      header={
        <TopBar
          onBack={back}
          backLabel={t('common.back')}
          chip={t('quiz.progress', { current: index + 1, total })}
          right={
            <Pressable onPress={() => router.push('/camera')} accessibilityRole="button" hitSlop={10} style={styles.skip}>
              <AppText variant="label" color={colors.onInkMuted} style={styles.skipText}>
                {t('common.skip')}
              </AppText>
            </Pressable>
          }
        />
      }
      footer={<Button label={isLast ? t('common.continue') : t('common.next')} onPress={next} disabled={!selected} icon="arrow" />}
    >
      <SegmentedProgress
        value={(index + (selected ? 1 : 0)) / total}
        segments={20}
        height={22}
        label={t('common.stepOf', { current: index + 1, total })}
      />

      <Reveal key={step.id} distance={14}>
        <Card style={styles.question}>
          <View style={styles.qHead}>
            <MonoLabel color={colors.accentSoft}>{`${indexLabel(index)} / ${indexLabel(total - 1)}`}</MonoLabel>
            {index === 0 ? <MonoLabel color={colors.onInkSubtle}>{t('quiz.title')}</MonoLabel> : null}
          </View>
          <AppText variant="title" color={colors.onInk} accessibilityRole="header">
            {t(step.questionKey)}
          </AppText>
          <AppText variant="body" color={colors.onInkMuted} style={styles.hint}>
            {t(step.hintKey)}
          </AppText>
          {index === 0 ? (
            <AppText variant="mono" color={colors.onInkSubtle} style={styles.subtitle}>
              {t('quiz.subtitle')}
            </AppText>
          ) : null}
        </Card>

        <View style={styles.options} accessibilityRole="radiogroup">
          {step.options.map((option, i) => (
            <OptionPill
              key={option.value}
              label={t(option.labelKey)}
              letter={String.fromCharCode(65 + i)}
              active={selected === option.value}
              onPress={() => choose(option.value)}
            />
          ))}
        </View>
      </Reveal>
    </Screen>
  );
}

function OptionPill({ label, letter, active, onPress }: { label: string; letter: string; active: boolean; onPress: () => void }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const on = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(active ? 1 : 0, { duration: reduced ? motion.reducedFade : motion.ui });
    if (active && !reduced) {
      scale.value = withSequence(withSpring(1.025, motion.spring), withSpring(1, motion.spring));
    }
  }, [active, reduced, on, scale]);

  const fill = useAnimatedStyle(() => ({ opacity: on.value }));
  const pressStyle = useAnimatedStyle(() => ({ transform: reduced ? [] : [{ scale: scale.value }] }));

  return (
    <Animated.View style={pressStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          if (!reduced) scale.set(withSpring(motion.pressScale, motion.spring));
        }}
        onPressOut={() => {
          if (!reduced) scale.set(withSpring(1, motion.spring));
        }}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityState={{ selected: active, checked: active }}
        style={styles.option}
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.optionFill, fill]} />
        <AppText variant="mono" color={active ? colors.accentSoft : colors.inkSubtle} style={styles.letter}>
          {letter}
        </AppText>
        <AppText variant="label" color={active ? colors.onInk : colors.ink} style={styles.optionLabel}>
          {label}
        </AppText>
        <View style={[styles.radio, active && styles.radioActive]}>
          {active ? <View style={styles.radioDot} /> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  skip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  skipText: { fontSize: 14 },
  question: { gap: spacing.md, paddingVertical: 24, marginTop: spacing.xs },
  qHead: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  hint: { fontSize: 15, lineHeight: 22 },
  subtitle: { fontSize: 12, lineHeight: 17 },
  options: { gap: 8, marginTop: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: 22,
    minHeight: 60,
    borderRadius: radii.pill,
    backgroundColor: colors.paperRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  optionFill: { backgroundColor: colors.ink, borderRadius: radii.pill },
  letter: { width: 14 },
  optionLabel: { flex: 1, fontSize: 16 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.accentSoft },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentSoft },
});
