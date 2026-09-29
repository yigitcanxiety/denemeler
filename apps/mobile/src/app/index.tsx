import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/button';
import { Connector } from '@/components/connector';
import { FitWordmark } from '@/components/fit-wordmark';
import { HeatFace } from '@/components/heat-face';
import { Icon } from '@/components/icon';
import { Chip, MonoLabel, NumberTag } from '@/components/labels';
import { PressableScale, Reveal } from '@/components/motion';
import { Screen } from '@/components/screen';
import { Card, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { Wordmark } from '@/components/top-bar';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { indexLabel, uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, GUTTER, radii, spacing } from '@/theme';

const SLIDES = [
  { title: 'onboarding.slide1Title', body: 'onboarding.slide1Body' },
  { title: 'onboarding.slide2Title', body: 'onboarding.slide2Body' },
  { title: 'onboarding.slide3Title', body: 'onboarding.slide3Body' },
] as const;

export default function WelcomeScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const { width } = useWindowDimensions();
  const hasAnalysis = useAppStore((s) => s.analysis !== null);
  const consented = useAppStore((s) => s.consentAt !== null);

  const start = () => router.push(consented ? '/quiz' : '/consent');
  const faceW = Math.min(width * 0.56, 240);
  const connectorW = (width - faceW) / 2 - GUTTER + 12;

  return (
    <Screen
      grid="accent"
      header={
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Wordmark color={colors.ink} size={19} />
          </View>
          <PressableScale
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel={t('settings.title')}
            style={styles.menuBox}
          >
            <Icon name="settings" size={16} color={colors.ink} />
            <AppText variant="label" style={styles.menuText}>
              {t('settings.title')}
            </AppText>
          </PressableScale>
        </View>
      }
      footer={
        <>
          <Button label={t('onboarding.getStarted')} onPress={start} icon="arrow" />
          {hasAnalysis ? (
            <Button
              label={t('results.title')}
              variant="secondary"
              onPress={() => router.push(premium ? '/results' : '/teaser')}
            />
          ) : (
            <Button label={t('onboarding.alreadySubscribed')} variant="ghost" compact onPress={() => router.push('/settings')} />
          )}
        </>
      }
    >
      <FitWordmark lines={['TONELLE']} accessibilityLabel={t('common.appName')} style={styles.wordmark} />

      <Reveal delay={350} style={styles.subline}>
        <MonoLabel slash caps={false} color={colors.ink} size={12.5}>
          {t('common.tagline')}
        </MonoLabel>
        <Chip label={uiCopy(locale).free} tone="ink" />
      </Reveal>

      <View style={styles.hero}>
        <View style={[styles.connector, styles.connectorLeft]}>
          <Connector side="left" width={connectorW} delay={700} />
        </View>
        <HeatFace width={faceW} scanning scanLabel={uiCopy(locale).analyzingTag} />
        <View style={[styles.connector, styles.connectorRight]}>
          <Connector side="right" width={connectorW} delay={820} />
        </View>
      </View>

      <Reveal delay={500} style={styles.intro}>
        <AppText variant="title" accessibilityRole="header">
          {t('onboarding.welcomeTitle')}
        </AppText>
        <AppText variant="bodyMuted">{t('onboarding.welcomeSubtitle')}</AppText>
        <View style={styles.pills}>
          <Chip label={t('onboarding.takesAMinute')} tone="outline" caps={false} />
          <Chip label={t('common.privacyBadge')} tone="outline" caps={false} />
        </View>
      </Reveal>

      <Reveal delay={650}>
        <CardStack>
          {SLIDES.map((slide, index) => (
            <Card key={slide.title} style={styles.slide}>
              <NumberTag label={indexLabel(index)} tone="light" />
              <View style={styles.slideText}>
                <AppText variant="label" color={colors.onInk} style={styles.slideTitle}>
                  {t(slide.title)}
                </AppText>
                <AppText variant="body" color={colors.onInkMuted} style={styles.slideBody}>
                  {t(slide.body)}
                </AppText>
              </View>
            </Card>
          ))}
        </CardStack>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoBox: {
    backgroundColor: colors.paperRaised,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  menuBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    backgroundColor: colors.paperRaised,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  menuText: { fontSize: 14 },
  wordmark: { marginTop: spacing.sm },
  subline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: -4 },
  hero: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, marginHorizontal: -GUTTER },
  connector: { position: 'absolute', top: '52%' },
  connectorLeft: { left: 0 },
  connectorRight: { right: 0 },
  intro: { gap: spacing.md },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slide: { flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' },
  slideText: { flex: 1, gap: 4 },
  slideTitle: { fontSize: 17 },
  slideBody: { fontSize: 14.5, lineHeight: 21 },
});
