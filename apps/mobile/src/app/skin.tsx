import { SKIN_CONCERNS, SKIN_LEVELS, type SkinAnalysis } from '@tonelle/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { Reveal } from '@/components/motion';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { BackTitle, Card, Eyebrow, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { useStartAnalysis, useStartSkinAnalysis } from '@/hooks/use-start-analysis';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, radii, seasonGradient, spacing } from '@/theme';

/** Skin-care analysis result: skin type, concern levels, morning/evening routine, ingredients. */
export default function SkinScreen() {
  const skin = useAppStore((s) => s.skin);
  if (!skin) return <Redirect href="/" />;
  return <SkinResult skin={skin} />;
}

function SkinResult({ skin }: { skin: SkinAnalysis }) {
  const t = useT();
  const copy = uiCopy(useLocale());
  const startSkin = useStartSkinAnalysis();
  const startColor = useStartAnalysis();
  const routine: { icon: IconName; title: string; steps: string[] }[] = [
    { icon: 'sun', title: copy.skinMorning, steps: skin.routine.morning },
    { icon: 'moon', title: copy.skinEvening, steps: skin.routine.evening },
  ];

  return (
    <Screen
      header={
        <BackTitle
          title={copy.skinTitle}
          backLabel={t('common.back')}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      }
    >
      <Reveal>
        <LinearGradient colors={[...seasonGradient.autumn]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Eyebrow label={copy.skinTypeTitle} tone="glass" sparkle={false} />
          <AppText variant="display" style={styles.heroType} accessibilityRole="header">
            {t(`quiz.skinType.options.${skin.skinType}`)}
          </AppText>
          <AppText variant="small" color={colors.ink} style={styles.heroSummary}>
            {skin.summary}
          </AppText>
        </LinearGradient>
      </Reveal>

      <Reveal delay={60}>
        <Card style={styles.gap}>
          <SectionTitle>{copy.skinConcernsTitle}</SectionTitle>
          {SKIN_CONCERNS.map((concern) => {
            const level = skin.concerns[concern];
            const filled = SKIN_LEVELS.indexOf(level) + 1;
            return (
              <View
                key={concern}
                style={styles.concern}
                accessible
                accessibilityLabel={`${copy.skinConcerns[concern]}: ${copy.skinLevels[level]}`}
              >
                <AppText style={styles.concernName}>{copy.skinConcerns[concern]}</AppText>
                <View style={styles.bars}>
                  {SKIN_LEVELS.map((l, n) => (
                    <View key={l} style={[styles.bar, n < filled && styles.barOn]} />
                  ))}
                </View>
                <AppText variant="smallStrong" color={colors.violet} style={styles.levelText} numberOfLines={1}>
                  {copy.skinLevels[level]}
                </AppText>
              </View>
            );
          })}
        </Card>
      </Reveal>

      <Reveal delay={120}>
        <Card style={styles.gap}>
          <SectionTitle>{copy.skinRoutineTitle}</SectionTitle>
          {routine.map(({ icon, title, steps }) => (
            <View key={title} style={styles.routine}>
              <View style={styles.routineHead}>
                <Icon name={icon} size={16} color={colors.violet} />
                <AppText variant="label" accessibilityRole="header">
                  {title}
                </AppText>
              </View>
              {steps.map((step, n) => (
                <View key={step} style={styles.step}>
                  <View style={styles.stepNum}>
                    <AppText style={styles.stepNumText}>{n + 1}</AppText>
                  </View>
                  <AppText variant="body" style={styles.stepText}>
                    {step}
                  </AppText>
                </View>
              ))}
            </View>
          ))}
        </Card>
      </Reveal>

      <Reveal delay={180}>
        <Card style={styles.gap}>
          <SectionTitle>{copy.skinIngredientsTitle}</SectionTitle>
          <View style={styles.pills}>
            {skin.ingredients.map((name) => (
              <View key={name} style={styles.ingredient}>
                <AppText variant="small" color={colors.ink}>
                  {name}
                </AppText>
              </View>
            ))}
          </View>
          <AppText variant="small" style={styles.disclaimer}>
            {copy.skinDisclaimer}
          </AppText>
        </Card>
      </Reveal>

      <Button label={copy.skinStartOver} variant="ghost" icon="refresh" onPress={startSkin} />
      <Button label={copy.skinFullAnalysis} variant="ghost" icon="palette" onPress={startColor} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radii.xl, padding: 16, gap: 10 },
  heroType: { fontSize: 34, lineHeight: 38 },
  heroSummary: { opacity: 0.85, fontSize: 14, lineHeight: 20 },
  gap: { gap: spacing.md },
  concern: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  concernName: { flex: 1, fontSize: 14.5 },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { width: 24, height: 8, borderRadius: 4, backgroundColor: colors.mist },
  barOn: { backgroundColor: colors.violet },
  levelText: { width: 56, textAlign: 'right' },
  routine: { gap: 10 },
  routineHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: fonts.bold, fontSize: 11.5, lineHeight: 15, color: colors.violet },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ingredient: { backgroundColor: colors.mist, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 },
  disclaimer: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.md },
});
