import { LOOKS, type LookId } from '@tonelle/shared';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { BeforeAfter } from '@/components/before-after';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { PressableScale, Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { CoverImage, PORTRAITS } from '@/components/portraits';
import { Screen } from '@/components/screen';
import { ShadeCard } from '@/components/shade-card';
import { AppText } from '@/components/text';
import { BackTitle, Pill, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { errorKeyFor } from '@/lib/api';
import { isLookId, localizedSteps, lookShades, lookSummary, resolveRecommendedLooks } from '@/lib/looks';
import { completeQuiz } from '@/lib/quiz';
import { topShades } from '@/lib/results';
import { uiCopy } from '@/lib/ui-copy';
import { api } from '@/services/api';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, GUTTER, radii } from '@/theme';

/** Makeup try-on (DESIGN.md §3.8). Premium only: locked users are sent to the paywall. */
export default function TryOnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Keyed by look: switching looks resets the screen state and cancels an in-flight render.
  return <TryOn key={id} id={id} />;
}

function TryOn({ id }: { id: string | undefined }) {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const { width } = useWindowDimensions();
  const analysis = useAppStore((s) => s.analysis);
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);
  const quiz = useAppStore((s) => s.quiz);
  const photo = useAppStore((s) => s.photo);
  const anonId = useAppStore((s) => s.anonId);
  const rendered = useAppStore((s) => (isLookId(id) ? s.renders[id] : undefined));
  const setRender = useAppStore((s) => s.setRender);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof errorKeyFor> | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!isLookId(id) || !analysis) return <Redirect href="/" />;
  if (!premium) return <Redirect href="/paywall" />;

  const look = LOOKS[id];
  const summary = lookSummary(id, locale);
  const steps = localizedSteps(look, locale);
  const shades = topShades(analysis, lookShades(analysis, look));
  const recommended = resolveRecommendedLooks(analysis, serverLookIds, completeQuiz(quiz));
  const order: LookId[] = [...recommended, ...(Object.keys(LOOKS) as LookId[]).filter((l) => !recommended.includes(l))];
  const frameH = Math.round(Math.min(width - GUTTER * 2, 520) * 1.08);

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
    } catch (error) {
      if (!controller.signal.aborted) setErrorKey(errorKeyFor(error));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <Screen header={<BackTitle title={copy.tryOnTitle} onBack={() => router.back()} backLabel={t('common.back')} />}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bleed}
        contentContainerStyle={styles.chips}
        accessibilityRole="tablist"
      >
        {order.map((lookId) => {
          const active = lookId === id;
          return (
            <PressableScale
              key={lookId}
              onPress={() => router.setParams({ id: lookId })}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipOn]}
            >
              <AppText style={[styles.chipText, active && styles.chipTextOn]}>{lookSummary(lookId, locale).name}</AppText>
            </PressableScale>
          );
        })}
      </ScrollView>

      {photo ? (
        <BeforeAfter
          before={photo.dataUrl}
          after={rendered ?? null}
          height={frameH}
          loading={loading}
          labels={{ before: t('look.before'), after: t('look.after'), ai: t('common.aiGenerated'), slider: copy.sliderLabel }}
        />
      ) : (
        <View style={[styles.noPhoto, { height: frameH }]}>
          <CoverImage source={PORTRAITS.three} focusY={0.2} style={StyleSheet.absoluteFill} />
          <View style={styles.noPhotoVeil} />
          <View style={styles.noPhotoCard}>
            <Icon name="camera" size={22} color={colors.violet} />
            <AppText variant="small" color={colors.ink} align="center">
              {copy.needPhoto}
            </AppText>
            <Button label={copy.addSelfie} compact icon="camera" onPress={() => void render()} />
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.renderingRow} accessibilityRole="progressbar" accessibilityLabel={t('look.rendering')}>
          <AppText variant="smallStrong" color={colors.violet}>
            {t('look.rendering')}
          </AppText>
          <AppText variant="caption">{t('look.renderingHint')}</AppText>
        </View>
      ) : null}
      {errorKey ? <Notice tone="error" message={t(errorKey)} /> : null}

      {photo && !rendered ? (
        <Button label={t('look.tryOn')} icon="sparkle" onPress={() => void render()} loading={loading} />
      ) : null}
      {rendered && !loading ? (
        <>
          <Button
            label={t('look.shareLook')}
            icon="share"
            variant="ghost"
            onPress={() => router.push({ pathname: '/share', params: { lookId: id } })}
          />
          <AppText variant="caption" align="center">
            {t('common.aiGeneratedNote')}
          </AppText>
        </>
      ) : null}

      <Reveal style={styles.gapSm}>
        <AppText variant="h2">{summary.name}</AppText>
        <AppText variant="bodyMuted">{summary.description}</AppText>
        <View style={styles.tags}>
          {summary.occasions.map((o) => (
            <Pill key={o} tone="rose" label={t(`look.occasionTag.${o}`)} />
          ))}
          <Pill tone="violet" label={t(`look.intensity.${summary.intensity}`)} />
          <Pill tone="violet" label={t(`look.level.${summary.level}`)} />
        </View>
      </Reveal>

      <View style={styles.gapSm}>
        <SectionTitle>{copy.shadesForLook}</SectionTitle>
        <View style={styles.shades}>
          {shades.map((shade) => (
            <ShadeCard key={shade.kind} shade={shade} locale={locale} style={styles.flex} />
          ))}
        </View>
      </View>

      <View style={styles.gapSm}>
        <SectionTitle>{t('look.stepsTitle')}</SectionTitle>
        <View style={styles.steps}>
          {steps.map((step, i) => {
            const open = openStep === i;
            return (
              <View key={step.number} style={[styles.step, i > 0 && styles.stepBorder]}>
                <PressableScale
                  onPress={() => setOpenStep(open ? null : i)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  accessibilityLabel={`${t('look.stepLabel', { number: step.number })}: ${step.title}`}
                  style={styles.stepHead}
                >
                  <View style={[styles.stepNum, open && styles.stepNumOn]}>
                    <AppText style={[styles.stepNumText, open && styles.stepNumTextOn]}>{step.number}</AppText>
                  </View>
                  <AppText variant="label" style={styles.flex}>
                    {step.title}
                  </AppText>
                  <View style={open ? styles.chevronOpen : undefined}>
                    <Icon name="chevronDown" size={18} color={colors.muted} />
                  </View>
                </PressableScale>
                {open ? (
                  <Reveal distance={4}>
                    <AppText variant="small" color={colors.ink} style={styles.stepBody}>
                      {step.body}
                    </AppText>
                  </Reveal>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bleed: { marginHorizontal: -GUTTER, flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: GUTTER },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  chipTextOn: { color: colors.paper },
  noPhoto: { borderRadius: radii.xl, overflow: 'hidden', justifyContent: 'flex-end', padding: 14 },
  noPhotoVeil: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.25)' },
  noPhotoCard: {
    backgroundColor: colors.floatBg,
    borderRadius: radii.card,
    padding: 16,
    gap: 10,
    alignItems: 'center',
  },
  renderingRow: { alignItems: 'center', gap: 2, marginTop: -4 },
  gapSm: { gap: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  shades: { flexDirection: 'row', gap: 8 },
  steps: { borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, overflow: 'hidden' },
  step: { paddingHorizontal: 14 },
  stepBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  stepHead: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumOn: { backgroundColor: colors.violet },
  stepNumText: { fontFamily: fonts.bold, fontSize: 12, color: colors.muted },
  stepNumTextOn: { color: colors.onViolet },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  stepBody: { paddingLeft: 38, paddingBottom: 14, lineHeight: 19 },
});
