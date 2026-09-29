import { LOOKS } from '@tonelle/shared';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { HeatFace } from '@/components/heat-face';
import { Chip, MonoLabel, NumberTag } from '@/components/labels';
import { Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { PillSegmented } from '@/components/pill-segmented';
import { Screen } from '@/components/screen';
import { Card, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Rule, SectionTitle, SwatchBar } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { errorKeyFor } from '@/lib/api';
import { isLookId, localizedSteps, lookShades, lookSummary } from '@/lib/looks';
import { indexLabel, uiCopy } from '@/lib/ui-copy';
import { api } from '@/services/api';
import { useAppStore } from '@/store/app-store';
import { colors, heat, radii, spacing } from '@/theme';

const IMAGE_HEIGHT = 440;

export default function LookDetailScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysis = useAppStore((s) => s.analysis);
  const photo = useAppStore((s) => s.photo);
  const anonId = useAppStore((s) => s.anonId);
  const rendered = useAppStore((s) => (isLookId(id) ? s.renders[id] : undefined));
  const setRender = useAppStore((s) => s.setRender);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof errorKeyFor> | null>(null);
  const [showBefore, setShowBefore] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!isLookId(id) || !analysis) return <Redirect href="/" />;
  if (!premium) return <Redirect href="/teaser" />;

  const look = LOOKS[id];
  const summary = lookSummary(id, locale);
  const steps = localizedSteps(look, locale);
  const shades = lookShades(analysis, look);
  const copy = uiCopy(locale);
  const facePalette = [
    shades.lip[0] ?? heat[0],
    shades.lip[1] ?? shades.lip[0] ?? heat[1],
    shades.blush[0] ?? heat[2],
    shades.eyeshadow[0] ?? heat[3],
    heat[4],
  ];

  const render = async () => {
    if (!photo) {
      router.push({ pathname: '/camera', params: { returnTo: 'look' } });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setErrorKey(null);
    try {
      const response = await api.renderLook(
        { image: photo.dataUrl, lookId: id, analysis, appUserId: anonId ?? undefined, locale },
        { signal: controller.signal },
      );
      setRender(id, response.image);
      setShowBefore(false);
    } catch (error) {
      if (!controller.signal.aborted) setErrorKey(errorKeyFor(error));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <Screen>
      <CardStack>
        <TopBar onBack={() => router.back()} backLabel={t('common.back')} title={summary.name} />
        <Card padded={false} style={styles.imageFrame}>
          {loading ? (
            <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={t('look.rendering')}>
              <HeatFace width={200} palette={facePalette} stroke={colors.onInk} scanning scanLabel={copy.analyzingTag} />
              <AppText variant="label" color={colors.onInk} align="center">
                {t('look.rendering')}
              </AppText>
              <MonoLabel caps={false} color={colors.onInkMuted}>
                {t('look.renderingHint')}
              </MonoLabel>
            </View>
          ) : rendered ? (
            <>
              <Image
                source={{ uri: showBefore && photo ? photo.dataUrl : rendered }}
                style={styles.image}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                accessible
                accessibilityLabel={`${summary.name}. ${t('common.aiGeneratedNote')}`}
              />
              {!showBefore ? (
                <View style={styles.aiLabel}>
                  <Chip label={t('common.aiGenerated')} tone="soft" />
                </View>
              ) : null}
              {photo ? (
                <View style={styles.toggle}>
                  <PillSegmented
                    options={[
                      { key: 'before', label: t('look.before') },
                      { key: 'after', label: t('look.after') },
                    ]}
                    value={showBefore ? 'before' : 'after'}
                    onChange={(k) => setShowBefore(k === 'before')}
                    height={46}
                  />
                </View>
              ) : null}
            </>
          ) : (
            <View style={styles.center}>
              <HeatFace width={210} palette={facePalette} stroke={colors.onInk} />
              <AppText variant="body" color={colors.onInkMuted} align="center" style={styles.placeholderText}>
                {summary.description}
              </AppText>
            </View>
          )}
        </Card>
      </CardStack>

      {rendered && !loading ? (
        <MonoLabel caps={false} style={styles.centerText}>
          {t('common.aiGeneratedNote')}
        </MonoLabel>
      ) : null}

      {errorKey ? <Notice tone="error" message={t(errorKey)} /> : null}

      <Button
        label={photo ? t('look.tryOn') : `${t('look.tryOn')} · ${t('camera.title')}`}
        onPress={() => void render()}
        loading={loading}
        variant={rendered ? 'secondary' : 'primary'}
        icon="spark"
      />
      {!photo ? (
        <MonoLabel caps={false} style={styles.centerText}>
          {t('common.privacyBadge')}
        </MonoLabel>
      ) : null}
      {rendered ? (
        <Button
          label={t('look.shareLook')}
          onPress={() => router.push({ pathname: '/share', params: { lookId: id } })}
          icon="share"
        />
      ) : null}

      <View style={styles.meta}>
        {summary.occasions.map((o) => (
          <Chip key={o} label={t(`look.occasionTag.${o}`)} tone="outline" />
        ))}
        <Chip label={t(`look.intensity.${summary.intensity}`)} tone="ink" />
        <Chip label={t(`look.level.${summary.level}`)} tone="ink" />
      </View>

      <Card style={styles.shades}>
        <SectionTitle onInk>{t('look.shadesTitle')}</SectionTitle>
        <MonoLabel color={colors.onInkMuted}>{t('results.lipTitle')}</MonoLabel>
        <SwatchBar colors={shades.lip} height={30} onInk showHex />
        <MonoLabel color={colors.onInkMuted}>{t('results.blushTitle')}</MonoLabel>
        <SwatchBar colors={shades.blush} height={30} onInk showHex />
        <MonoLabel color={colors.onInkMuted}>{t('results.eyeshadowTitle')}</MonoLabel>
        <SwatchBar colors={shades.eyeshadow} height={30} onInk showHex />
      </Card>

      <SectionTitle>{t('look.stepsTitle')}</SectionTitle>
      <View>
        {steps.map((step, i) => (
          <Reveal key={step.number} delay={80 * i}>
            {i > 0 ? <Rule style={styles.rule} /> : null}
            <View style={styles.step}>
              <NumberTag label={indexLabel(step.number - 1)} />
              <View style={styles.stepText}>
                <MonoLabel>{t('look.stepLabel', { number: step.number })}</MonoLabel>
                <AppText variant="label" style={styles.stepTitle}>
                  {step.title}
                </AppText>
                <AppText variant="bodyMuted">{step.body}</AppText>
              </View>
            </View>
          </Reveal>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageFrame: { height: IMAGE_HEIGHT },
  image: { width: '100%', height: '100%' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  centerText: { textAlign: 'center' },
  placeholderText: { fontSize: 15, lineHeight: 22 },
  aiLabel: { position: 'absolute', top: spacing.lg, left: spacing.lg },
  toggle: { position: 'absolute', bottom: spacing.lg, left: spacing.xxxl, right: spacing.xxxl },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  shades: { gap: spacing.sm, borderRadius: radii.card },
  rule: { marginVertical: spacing.md },
  step: { flexDirection: 'row', gap: spacing.md },
  stepText: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 17 },
});
