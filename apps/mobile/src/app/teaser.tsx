import { SEASONS } from '@tonelle/shared';
import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FitWordmark } from '@/components/fit-wordmark';
import { GlassSphere } from '@/components/glass-sphere';
import { MonoLabel, NumberTag } from '@/components/labels';
import { LockedSection } from '@/components/locked-section';
import { Reveal } from '@/components/motion';
import { Screen } from '@/components/screen';
import { Card, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { seasonText } from '@/lib/results';
import { indexLabel, uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, radii, seasonHeat, spacing } from '@/theme';

/** Neutral decoy swatches rendered under the blur — never the user's real palette. */
const DECOY = ['#D9B39C', '#EAAEB1', '#C4957B', '#DC8A8F', '#E8CFBF', '#F4CFD0', '#A7775E'];

const INCLUDES = [
  'teaser.includesSeason',
  'teaser.includesPalette',
  'teaser.includesShades',
  'teaser.includesLooks',
  'teaser.includesSteps',
] as const;

export default function TeaserScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);
  const looksCount = useAppStore((s) => s.recommendedLookIds?.length ?? 3);

  if (!analysis) return <Redirect href="/" />;
  if (premium) return <Redirect href="/results" />;

  const season = seasonText(analysis, locale);
  const family = SEASONS[analysis.season].family;
  const copy = uiCopy(locale);

  return (
    <Screen
      grid="accent"
      footer={
        <>
          <Button label={t('teaser.unlock')} onPress={() => router.push('/paywall')} icon="arrow" />
          <MonoLabel caps={false} style={styles.center}>
            {t('common.privacyBadge')}
          </MonoLabel>
        </>
      }
    >
      <TopBar onBack={() => router.dismissTo('/')} backLabel={t('common.back')} chip={copy.free} />

      <View style={styles.hero}>
        <MonoLabel slash color={colors.ink}>
          {t('teaser.title')}
        </MonoLabel>
        <MonoLabel color={colors.inkMuted}>{t('teaser.seasonLocked')}</MonoLabel>
        <FitWordmark lines={season.name.split(' ')} maxSize={120} delay={200} />
        <Reveal delay={500}>
          <AppText variant="bodyMuted">{t('teaser.subtitle', { count: looksCount })}</AppText>
        </Reveal>
      </View>

      <Reveal delay={600}>
        <View style={styles.night}>
          <GlassSphere size={200} palettes={[seasonHeat[family]]} />
          <MonoLabel color={colors.onInkMuted} style={styles.center}>
            {copy.season[family]}
          </MonoLabel>
        </View>
      </Reveal>

      <LockedSection title={t('teaser.paletteLocked')} chip={copy.locked}>
        <View style={styles.decoyBar}>
          {DECOY.map((c, i) => (
            <View key={`${c}-${i}`} style={[styles.decoySeg, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.decoyLine} />
        <View style={[styles.decoyLine, styles.decoyShort]} />
      </LockedSection>

      <LockedSection title={t('teaser.looksLocked')} chip={copy.locked}>
        <View style={styles.decoyLooks}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.decoyLook} />
          ))}
        </View>
      </LockedSection>

      <CardStack>
        <Card style={styles.includesHead}>
          <AppText variant="heading" color={colors.onInk}>
            {t('teaser.includesTitle')}
          </AppText>
        </Card>
        <Card style={styles.includes}>
          {INCLUDES.map((key, i) => (
            <View key={key} style={styles.includeRow}>
              <NumberTag label={indexLabel(i)} tone="light" size={24} />
              <AppText variant="body" color={colors.onInk} style={styles.flex}>
                {t(key)}
              </AppText>
            </View>
          ))}
        </Card>
      </CardStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  hero: { gap: spacing.sm, marginTop: spacing.md },
  night: {
    backgroundColor: colors.night,
    borderRadius: radii.card,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  decoyBar: { flexDirection: 'row', gap: 3, height: 48 },
  decoySeg: { flex: 1, borderRadius: 3 },
  decoyLine: { height: 10, borderRadius: 5, backgroundColor: colors.paperSunken },
  decoyShort: { width: '60%' },
  decoyLooks: { flexDirection: 'row', gap: spacing.md },
  decoyLook: { flex: 1, height: 120, borderRadius: radii.md, backgroundColor: colors.ink },
  includesHead: { paddingVertical: 18 },
  includes: { gap: spacing.md },
  includeRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
});
