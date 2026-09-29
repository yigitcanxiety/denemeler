import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Badge } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import {
  defaultPlanKey,
  exitDiscountPercent,
  legalLinesFor,
  planPriceLine,
} from '@/lib/paywall';
import {
  isDevPurchases,
  loadPaywall,
  purchasePlan,
  restorePurchases,
  type PaywallData,
  type Plan,
} from '@/purchases/purchases';
import { openLegal } from '@/services/legal';
import { colors, radii, shadows, spacing } from '@/theme';

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

  return (
    <Screen
      header={<TopBar onClose={close} closeLabel={t('common.close')} />}
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
              <AppText variant="caption" color={colors.inkMuted}>
                {busy === 'restore' ? t('paywall.restoring') : t('paywall.restore')}
              </AppText>
            </Pressable>
            <AppText variant="caption">·</AppText>
            <Pressable onPress={() => void openLegal(locale, 'terms')} accessibilityRole="link" hitSlop={8}>
              <AppText variant="caption" color={colors.inkMuted}>
                {t('legal.terms')}
              </AppText>
            </Pressable>
            <AppText variant="caption">·</AppText>
            <Pressable onPress={() => void openLegal(locale, 'privacy')} accessibilityRole="link" hitSlop={8}>
              <AppText variant="caption" color={colors.inkMuted}>
                {t('legal.privacy')}
              </AppText>
            </Pressable>
          </View>
        </>
      }
    >
      {isDevPurchases ? <DevBanner /> : null}
      <AppText variant="title" accessibilityRole="header">
        {t('paywall.title')}
      </AppText>
      <AppText variant="bodyMuted">{t('paywall.subtitle')}</AppText>

      <View style={styles.features}>
        {FEATURES.map((key) => (
          <View key={key} style={styles.featureRow}>
            <View style={styles.check}>
              <AppText variant="caption" color={colors.accentContrast}>
                ✓
              </AppText>
            </View>
            <AppText variant="body" style={styles.flex}>
              {t(key)}
            </AppText>
          </View>
        ))}
      </View>

      {status === 'loading' ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} accessibilityLabel={t('common.loading')} />
      ) : status === 'error' ? (
        <View style={styles.errorBox}>
          <Notice tone="error" message={t('errors.network')} />
          <Button label={t('common.retry')} variant="secondary" onPress={reload} />
        </View>
      ) : (
        <View style={styles.plans} accessibilityRole="radiogroup">
          {data.plans.map((plan) => {
            const active = plan.key === selected?.key;
            const highlight = plan.kind === 'yearly';
            return (
              <Pressable
                key={plan.key}
                onPress={() => setSelectedKey(plan.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active, checked: active }}
                style={[styles.plan, active && styles.planActive, highlight && active && shadows.card]}
              >
                <View style={styles.planHeader}>
                  <AppText variant="label">
                    {plan.kind === 'yearly' ? t('paywall.yearlyName') : t('paywall.weeklyName')}
                  </AppText>
                  {highlight ? <Badge label={t('paywall.bestValue')} /> : null}
                </View>
                <AppText variant="body">{planPriceLine(plan, t)}</AppText>
                {plan.pricePerWeekString ? (
                  <AppText variant="caption" color={colors.accent}>
                    {t('paywall.yearlyEquivalent', { price: plan.pricePerWeekString })}
                  </AppText>
                ) : null}
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
          <AppText variant="caption" align="center">
            {t('paywall.cancelAnytime')}
          </AppText>
        </View>
      )}

      {message ? <Notice tone={message.tone} message={message.text} /> : null}

      {selected ? (
        <View style={styles.legal}>
          {legalLinesFor(selected, t, platform).map((line) => (
            <AppText key={line} variant="caption" style={styles.legalText}>
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
            {isDevPurchases ? <Badge label="DEV" tone="dev" /> : null}
            <AppText variant="title" accessibilityRole="header">
              {t('paywall.exitTitle')}
            </AppText>
            <AppText variant="body">
              {t('paywall.exitBody', {
                percent: exitDiscountPercent(regularYearly, data.exitOffer),
                price: data.exitOffer.priceString,
              })}
            </AppText>
            <Button
              label={t('paywall.exitCta', { percent: exitDiscountPercent(regularYearly, data.exitOffer) })}
              onPress={() => void buy(data.exitOffer)}
              loading={busy === 'purchase'}
            />
            <Button
              label={t('paywall.exitDismiss')}
              variant="ghost"
              onPress={() => {
                setExitVisible(false);
                router.back();
              }}
            />
            {legalLinesFor(data.exitOffer, t, platform).map((line) => (
              <AppText key={line} variant="caption" style={styles.legalText}>
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
  features: { gap: spacing.sm },
  featureRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: { marginVertical: spacing.xxl },
  errorBox: { gap: spacing.md },
  plans: { gap: spacing.md },
  plan: {
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    paddingRight: spacing.xxxl,
    gap: 4,
  },
  planActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  radio: {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  legal: { gap: spacing.sm },
  legalText: { fontSize: 11, lineHeight: 16 },
});
