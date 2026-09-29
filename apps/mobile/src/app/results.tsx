import { LOOKS } from '@tonelle/shared';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Chip, MonoLabel } from '@/components/labels';
import { PressableScale, Reveal } from '@/components/motion';
import { BottomNav } from '@/components/pill-segmented';
import { Screen } from '@/components/screen';
import { SeasonCard } from '@/components/season-card';
import { Card, CardPair, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Rule, SectionTitle, SwatchBar } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { lookShades, lookSummary, resolveRecommendedLooks } from '@/lib/looks';
import { completeQuiz } from '@/lib/quiz';
import { traitChips, type TraitChip } from '@/lib/results';
import { indexLabel, uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, spacing } from '@/theme';

type Tab = 'results' | 'looks';

export default function ResultsScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);
  const quiz = useAppStore((s) => s.quiz);
  const [tab, setTab] = useState<Tab>('results');

  if (!analysis) return <Redirect href="/" />;
  if (!premium) return <Redirect href="/teaser" />;

  const copy = uiCopy(locale);
  const lookIds = resolveRecommendedLooks(analysis, serverLookIds, completeQuiz(quiz));
  const qualityIssues = analysis.qualityIssues;
  const chips = traitChips(analysis, t);
  const byId = (id: TraitChip['id']) => chips.find((c) => c.id === id)!;

  return (
    <Screen
      footer={
        <BottomNav<Tab>
          left={{ icon: 'share', label: t('share.title'), onPress: () => router.push('/share') }}
          right={{ icon: 'settings', label: t('settings.title'), onPress: () => router.push('/settings') }}
          options={[
            { key: 'results', label: copy.navResults },
            { key: 'looks', label: copy.navLooks },
          ]}
          value={tab}
          onChange={setTab}
        />
      }
    >
      <CardStack>
        <TopBar onBack={() => router.dismissTo('/')} backLabel={t('common.back')} chip={copy.premium} />
        {tab === 'results' ? (
          <SeasonCard analysis={analysis} locale={locale} />
        ) : (
          <Card style={styles.looksHead}>
            <MonoLabel color={colors.onInkMuted} slash>
              {copy.navLooks}
            </MonoLabel>
            <AppText variant="title" color={colors.onInk} accessibilityRole="header">
              {t('results.looksTitle')}
            </AppText>
          </Card>
        )}
      </CardStack>

      {tab === 'results' ? (
        <>
          <Reveal delay={200}>
            <CardStack joined={false}>
              <CardPair
                left={<Metric chip={byId('undertone')} index={0} />}
                right={<Metric chip={byId('contrast')} index={1} />}
              />
              <CardPair
                left={<Metric chip={byId('skinDepth')} index={2} />}
                right={<Metric chip={byId('faceShape')} index={3} />}
              />
            </CardStack>
          </Reveal>

          <Card tone="light" style={styles.eyeRow}>
            <View>
              <MonoLabel>{`${indexLabel(4)} · ${byId('eyeShape').label}`}</MonoLabel>
              <AppText variant="heading" style={styles.eyeValue}>
                {byId('eyeShape').value}
              </AppText>
            </View>
            <Chip label={copy.ai} tone="ink" />
          </Card>

          <Card tone="light" style={styles.gap}>
            <SectionTitle>{t('results.summaryTitle')}</SectionTitle>
            <AppText variant="body">{analysis.summary}</AppText>
          </Card>

          {qualityIssues.length ? (
            <View style={styles.quality}>
              {qualityIssues.map((issue) => (
                <AppText key={issue} variant="mono" color={colors.warning} style={styles.qualityText}>
                  {t(`camera.qualityIssues.${issue}`)}
                </AppText>
              ))}
            </View>
          ) : null}

          <CardStack>
            <Card style={styles.gap}>
              <SectionTitle onInk>{t('results.bestColors')}</SectionTitle>
              <SwatchBar colors={analysis.bestColors} height={64} showHex onInk />
            </Card>
            <Card style={styles.gap}>
              <MonoLabel color={colors.onInkMuted}>{t('results.avoidColors')}</MonoLabel>
              <SwatchBar colors={analysis.avoidColors} height={24} onInk />
            </Card>
            <Card style={styles.gap}>
              <SectionTitle onInk>{t('results.foundationTitle')}</SectionTitle>
              <AppText variant="mono" color={colors.onInkMuted}>
                {t('results.foundationUndertone', { label: analysis.foundation.undertoneLabel })}
              </AppText>
              <AppText variant="mono" color={colors.accentSoft}>
                {t('results.foundationRange', { range: analysis.foundation.shadeRange })}
              </AppText>
              <Rule onInk style={styles.rule} />
              <ShadeRow title={t('results.lipTitle')} colors={analysis.lip} />
              <ShadeRow title={t('results.blushTitle')} colors={analysis.blush} />
              <ShadeRow title={t('results.eyeshadowTitle')} colors={analysis.eyeshadow} />
            </Card>
          </CardStack>

          <Button label={t('results.newAnalysis')} variant="secondary" onPress={() => router.push('/camera')} icon="refresh" />
        </>
      ) : (
        <CardStack>
          {lookIds.map((id, i) => {
            const look = lookSummary(id, locale);
            const shades = lookShades(analysis, LOOKS[id]);
            return (
              <Reveal key={id} delay={100 + i * 80}>
                <PressableScale
                  onPress={() => router.push({ pathname: '/look/[id]', params: { id } })}
                  accessibilityRole="button"
                  accessibilityLabel={`${look.name}. ${t('results.seeLook')}`}
                  pressedScale={0.985}
                  style={styles.lookCard}
                >
                  <View style={styles.lookTags}>
                    <Chip label={copy.ai} tone="soft" />
                    {look.occasions.map((o) => (
                      <Chip key={o} label={t(`look.occasionTag.${o}`)} tone="onInk" />
                    ))}
                  </View>
                  <AppText variant="heading" color={colors.onInk} style={styles.lookName}>
                    {look.name}
                  </AppText>
                  <AppText variant="body" color={colors.onInkMuted} numberOfLines={2} style={styles.lookDesc}>
                    {look.description}
                  </AppText>
                  <SwatchBar
                    colors={[...shades.lip.slice(0, 2), ...shades.blush.slice(0, 2), ...shades.eyeshadow.slice(0, 2)]}
                    height={22}
                    onInk
                  />
                  <View style={styles.seeRow}>
                    <MonoLabel color={colors.accentSoft}>{t('results.seeLook')}</MonoLabel>
                    <Icon name="arrow" size={16} color={colors.accentSoft} />
                  </View>
                </PressableScale>
              </Reveal>
            );
          })}
        </CardStack>
      )}

      <MonoLabel caps={false} style={styles.center}>
        {t('results.savedOnDevice')}
      </MonoLabel>
      <AppText variant="monoSmall" align="center" style={styles.disclaimer}>
        {t('results.disclaimer')}
      </AppText>
    </Screen>
  );
}

function Metric({ chip, index }: { chip: TraitChip; index: number }) {
  return (
    <Card style={styles.metric} padded={false}>
      <AppText variant="label" color={colors.onInk}>
        {chip.label}
      </AppText>
      <AppText variant="monoSmall" color={colors.onInkSubtle}>
        {indexLabel(index)}
      </AppText>
      <View style={styles.flex} />
      <AppText
        variant="numeral"
        color={colors.accentSoft}
        style={styles.metricValue}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {chip.value}
      </AppText>
    </Card>
  );
}

function ShadeRow({ title, colors: hexes }: { title: string; colors: string[] }) {
  return (
    <View style={styles.shadeRow}>
      <MonoLabel color={colors.onInkMuted}>{title}</MonoLabel>
      <SwatchBar colors={hexes} height={30} onInk />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  gap: { gap: spacing.md },
  looksHead: { gap: spacing.sm },
  metric: { flex: 1, minHeight: 132, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16, gap: 2 },
  metricValue: { fontSize: 30, lineHeight: 34, letterSpacing: -1 },
  eyeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyeValue: { marginTop: 4 },
  quality: { gap: spacing.xs },
  qualityText: { fontSize: 12, lineHeight: 17 },
  rule: { marginVertical: spacing.xs },
  shadeRow: { gap: spacing.sm },
  lookCard: {
    backgroundColor: colors.ink,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: spacing.sm,
  },
  lookTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  lookName: { fontSize: 24, lineHeight: 28, marginTop: 4, fontFamily: fonts.medium },
  lookDesc: { fontSize: 14.5, lineHeight: 21 },
  seeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  disclaimer: { paddingHorizontal: spacing.md },
});
