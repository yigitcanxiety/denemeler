import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { Chip, MonoLabel, NumberTag } from '@/components/labels';
import { PressableScale, Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { Neck } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useLocale, useT } from '@/hooks/use-i18n';
import {
  defaultPlanKey,
  exitDiscountPercent,
  legalLinesFor,
  planPriceLine,
} from '@/lib/paywall';
import { indexLabel, uiCopy } from '@/lib/ui-copy';
import {
  isDevPurchases,
  loadPaywall,
  purchasePlan,
  restorePurchases,
  type PaywallData,
  type Plan,
} from '@/purchases/purchases';
import { openLegal } from '@/services/legal';
import { colors, fonts, radii, spacing, typography } from '@/theme';

const FEATURES = [
  'paywall.featureSeason',
  'paywall.featurePalette',
  'paywall.featureShades',
  'paywall.featureLooks',
  'paywall.featureGuides',
] as const;

type Status = 'loading' | 'ready' | 'error';

export default function PaywallScreen() {
  const t = useT();
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<PaywallData>({ plans: [], exitOffer: null });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [busy, setBusy] = useState<'purchase' | 'restore' | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'error' | 'info' | 'success' } | null>(null);
  const [exitVisible, setExitVisible] = useState(false);
  const [exitShown, setExitShown] = useState(false);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadPaywall(locale)
      .then((result) => {
        if (!active) return;
        setData(result);
        setSelectedKey((key) => key ?? defaultPlanKey(result.plans));
        setStatus(result.plans.length ? 'ready' : 'error');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [locale, attempt]);

  const reload = () => {
    setStatus('loading');
    setAttempt((a) => a + 1);
  };

  const selected = useMemo(
    () => data.plans.find((p) => p.key === selectedKey) ?? data.plans[0] ?? null,
    [data.plans, selectedKey],
  );
  const regularYearly = data.plans.find((p) => p.kind === 'yearly');
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';

  const onSuccess = () => {
    setExitVisible(false);
    Alert.alert(t('paywall.purchaseSuccess'));
    router.replace('/results');
  };

  const buy = async (plan: Plan | null) => {
    if (!plan || busy) return;
    setBusy('purchase');
    setMessage(null);
    try {
      const outcome = await purchasePlan(plan);
      if (outcome === 'success') onSuccess();
      else setMessage({ text: t('paywall.purchaseCancelled'), tone: 'info' });
    } catch {
      setMessage({ text: t('paywall.purchaseFailed'), tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const restore = async () => {
    if (busy) return;
    setBusy('restore');
    setMessage(null);
    try {
      if (await restorePurchases()) {
        Alert.alert(t('paywall.restoreSuccess'));
        router.replace('/results');
      } else {
        setMessage({ text: t('paywall.restoreNone'), tone: 'info' });
      }
    } catch {
      setMessage({ text: t('errors.generic'), tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const close = () => {
    // Exit offer: shown once per paywall visit, only when an "exit_offer" offering exists.
    if (data.exitOffer && !exitShown && status === 'ready') {
      setExitShown(true);
      setExitVisible(true);
      return;
    }
    router.back();
  };

  // Android hardware back behaves like the close button (so the exit offer can show).
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (exitVisible) return false;
      close();
      return true;
    });
    return () => sub.remove();
  });

  const ctaLabel =
    busy === 'purchase'
      ? t('paywall.processing')
      : selected?.intro?.type === 'trial'
        ? t('paywall.ctaTrial')
        : t('paywall.ctaSubscribe');

  const copy = uiCopy(locale);

  return (
    <Screen
      footer={
        <>
          <Button
            label={ctaLabel}
            onPress={() => void buy(selected)}
            loading={busy === 'purchase'}
            disabled={!selected || status !== 'ready' || busy !== null}
          />
          <View style={styles.footerLinks}>
            <Pressable onPress={() => void restore()} accessibilityRole="button" hitSlop={8} disabled={busy !== null}>
              <AppText variant="monoSmall" color={colors.ink}>
                {busy === 'restore' ? t('paywall.restoring') : t('paywall.restore')}
              </AppText>
            </Pressable>
            <AppText variant="monoSmall">/</AppText>
            <Pressable onPress={() => void openLegal(locale, 'terms')} accessibilityRole="link" hitSlop={8}>
              <AppText variant="monoSmall" color={colors.ink}>
                {t('legal.terms')}
              </AppText>
            </Pressable>
            <AppText variant="monoSmall">/</AppText>
            <Pressable onPress={() => void openLegal(locale, 'privacy')} accessibilityRole="link" hitSlop={8}>
              <AppText variant="monoSmall" color={colors.ink}>
                {t('legal.privacy')}
              </AppText>
            </Pressable>
          </View>
        </>
      }
    >
      <TopBar onClose={close} closeLabel={t('common.close')} chip={copy.premium} />
      {isDevPurchases ? <DevBanner /> : null}

      <Reveal style={styles.intro}>
        <AppText variant="title" accessibilityRole="header" style={styles.title}>
          {t('paywall.title')}
        </AppText>
        <AppText variant="bodyMuted">{t('paywall.subtitle')}</AppText>
      </Reveal>

      <View style={styles.features}>
        {FEATURES.map((key, i) => (
          <View key={key} style={styles.featureRow}>
            <NumberTag label={indexLabel(i)} size={24} />
            <AppText variant="body" style={styles.flex}>
              {t(key)}
            </AppText>
          </View>
        ))}
      </View>

      {status === 'loading' ? (
        <ActivityIndicator color={colors.ink} style={styles.loader} accessibilityLabel={t('common.loading')} />
      ) : status === 'error' ? (
        <View style={styles.errorBox}>
          <Notice tone="error" message={t('errors.network')} />
          <Button label={t('common.retry')} variant="secondary" onPress={reload} />
        </View>
      ) : (
        <View accessibilityRole="radiogroup">
          {data.plans.map((plan, i) => {
            const active = plan.key === selected?.key;
            const highlight = plan.kind === 'yearly';
            return (
              <View key={plan.key}>
                {i > 0 ? <Neck /> : null}
                <Reveal delay={150 + i * 90}>
                  <PressableScale
                    onPress={() => setSelectedKey(plan.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active, checked: active }}
                    pressedScale={0.985}
                    style={[styles.plan, active && styles.planActive]}
                  >
                    <View style={styles.planHeader}>
                      <AppText variant="label" color={colors.onInk} style={styles.planName}>
                        {plan.kind === 'yearly' ? t('paywall.yearlyName') : t('paywall.weeklyName')}
                      </AppText>
                      {highlight ? <Chip label={t('paywall.bestValue')} tone="soft" centered /> : null}
                      <View style={styles.flex} />
                      <View style={[styles.radio, active && styles.radioActive]}>
                        {active ? <View style={styles.radioDot} /> : null}
                      </View>
                    </View>
                    <Text
                      style={[typography.numeral, styles.price, { color: active ? colors.onInk : colors.onInkMuted }]}
                      maxFontSizeMultiplier={1.2}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {plan.priceString}
                    </Text>
                    <AppText variant="mono" color={colors.onInkMuted} style={styles.priceLine}>
                      {planPriceLine(plan, t)}
                    </AppText>
                    {plan.pricePerWeekString ? (
                      <AppText variant="mono" color={colors.accentSoft} style={styles.priceLine}>
                        {t('paywall.yearlyEquivalent', { price: plan.pricePerWeekString })}
                      </AppText>
                    ) : null}
                  </PressableScale>
                </Reveal>
              </View>
            );
          })}
          <MonoLabel caps={false} style={styles.cancel}>
            {t('paywall.cancelAnytime')}
          </MonoLabel>
        </View>
      )}

      {message ? <Notice tone={message.tone} message={message.text} /> : null}

      {selected ? (
        <View style={styles.legal}>
          {legalLinesFor(selected, t, platform).map((line) => (
            <AppText key={line} variant="monoSmall" style={styles.legalText}>
              {line}
            </AppText>
          ))}
        </View>
      ) : null}

      <BottomSheet
        visible={exitVisible}
        onDismiss={() => {
          setExitVisible(false);
          router.back();
        }}
        dismissLabel={t('paywall.exitDismiss')}
      >
        {data.exitOffer ? (
          <>
            {isDevPurchases ? <Chip label="DEV" tone="soft" /> : null}
            <AppText variant="title" color={colors.onInk} accessibilityRole="header">
              {t('paywall.exitTitle')}
            </AppText>
            <Text style={[typography.numeral, { color: colors.accentSoft }]}>
              −{exitDiscountPercent(regularYearly, data.exitOffer)}%
            </Text>
            <AppText variant="body" color={colors.onInkMuted}>
              {t('paywall.exitBody', {
                percent: exitDiscountPercent(regularYearly, data.exitOffer),
                price: data.exitOffer.priceString,
              })}
            </AppText>
            <Button
              label={t('paywall.exitCta', { percent: exitDiscountPercent(regularYearly, data.exitOffer) })}
              variant="soft"
              onPress={() => void buy(data.exitOffer)}
              loading={busy === 'purchase'}
            />
            <Button
              label={t('paywall.exitDismiss')}
              variant="onInk"
              onPress={() => {
                setExitVisible(false);
                router.back();
              }}
            />
            {legalLinesFor(data.exitOffer, t, platform).map((line) => (
              <AppText key={line} variant="monoSmall" color={colors.onInkSubtle} style={styles.legalText}>
                {line}
              </AppText>
            ))}
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  intro: { gap: spacing.sm, marginTop: spacing.md },
  title: { fontSize: 34, lineHeight: 35 },
  features: { gap: 10, marginVertical: spacing.sm },
  featureRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  loader: { marginVertical: spacing.xxl },
  errorBox: { gap: spacing.md },
  plan: {
    backgroundColor: colors.ink,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.ink,
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 4,
  },
  planActive: { borderColor: colors.accentSoft },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  planName: { fontSize: 16 },
  price: { fontSize: 50, lineHeight: 56, marginTop: spacing.sm },
  priceLine: { fontSize: 12, lineHeight: 17 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.inkLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.accentSoft },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentSoft },
  cancel: { textAlign: 'center', marginTop: spacing.md },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  legal: { gap: spacing.sm },
  legalText: { fontSize: 11, lineHeight: 16, fontFamily: fonts.mono },
});
