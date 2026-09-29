import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useAppStore } from '@/store/app-store';
import { colors, palette, radii, spacing } from '@/theme';

const SLIDES = [
  { title: 'onboarding.slide1Title', body: 'onboarding.slide1Body', swatch: palette.blush[300] },
  { title: 'onboarding.slide2Title', body: 'onboarding.slide2Body', swatch: palette.nude[400] },
  { title: 'onboarding.slide3Title', body: 'onboarding.slide3Body', swatch: palette.blush[500] },
] as const;

export default function WelcomeScreen() {
  const t = useT();
  const premium = usePremium();
  const hasAnalysis = useAppStore((s) => s.analysis !== null);
  const consented = useAppStore((s) => s.consentAt !== null);

  const start = () => router.push(consented ? '/quiz' : '/consent');

  return (
    <Screen
      header={
        <View style={styles.header}>
          <AppText variant="heading" color={colors.accent}>
            {t('common.appName')}
          </AppText>
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel={t('settings.title')}
            hitSlop={10}
          >
            <AppText variant="label" color={colors.inkMuted}>
              {t('settings.title')}
            </AppText>
          </Pressable>
        </View>
      }
      footer={
        <>
          <Button label={t('onboarding.getStarted')} onPress={start} />
          {hasAnalysis ? (
            <Button
              label={t('results.title')}
              variant="secondary"
              onPress={() => router.push(premium ? '/results' : '/teaser')}
            />
          ) : (
            <Button
              label={t('onboarding.alreadySubscribed')}
              variant="ghost"
              onPress={() => router.push('/settings')}
            />
          )}
        </>
      }
    >
      <LinearGradient
        colors={[palette.blush[100], palette.nude[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroOrbs} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {[palette.nude[300], palette.blush[300], palette.nude[500], palette.blush[500], palette.nude[700]].map(
            (c) => (
              <View key={c} style={[styles.orb, { backgroundColor: c }]} />
            ),
          )}
        </View>
        <AppText variant="overline">{t('common.tagline')}</AppText>
        <AppText variant="display" accessibilityRole="header">
          {t('onboarding.welcomeTitle')}
        </AppText>
        <AppText variant="bodyMuted">{t('onboarding.welcomeSubtitle')}</AppText>
        <View style={styles.pills}>
          <View style={styles.pill}>
            <AppText variant="caption" color={colors.ink}>
              {t('onboarding.takesAMinute')}
            </AppText>
          </View>
          <View style={styles.pill}>
            <AppText variant="caption" color={colors.ink}>
              {t('common.privacyBadge')}
            </AppText>
          </View>
        </View>
      </LinearGradient>

      {SLIDES.map((slide, index) => (
        <View key={slide.title} style={styles.slide}>
          <View style={[styles.slideIndex, { backgroundColor: slide.swatch }]}>
            <AppText variant="label" color={colors.accentContrast}>
              {index + 1}
            </AppText>
          </View>
          <View style={styles.slideText}>
            <AppText variant="label">{t(slide.title)}</AppText>
            <AppText variant="bodyMuted">{t(slide.body)}</AppText>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  hero: {
    borderRadius: radii.card,
    padding: spacing.xl,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  heroOrbs: { flexDirection: 'row', marginBottom: spacing.sm },
  orb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: -8,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  slide: { flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' },
  slideIndex: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  slideText: { flex: 1, gap: 2 },
});
