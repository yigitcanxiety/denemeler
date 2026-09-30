import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Button, IconButton } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { PressableScale, Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { CheckRow, Pill } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import {
  defaultPlanKey,
  exitDiscountPercent,
  legalLinesFor,
  planPriceLine,
  yearlySavingsPercent,
} from '@/lib/paywall';
import { percentLabel, uiCopy } from '@/lib/ui-copy';
import {
  isDevPurchases,
  loadPaywall,
  purchasePlan,
  restorePurchases,
  type PaywallData,
  type Plan,
} from '@/purchases/purchases';
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
  const copy = uiCopy(locale);
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
  const savings = yearlySavingsPercent(data.plans);
  // The browser preview has no store; pick the store copy from the device it is viewed on.
  const platform =
    Platform.OS === 'ios' ||
    (Platform.OS === 'web' && typeof navigator !== 'undefined' && /iPhone|iPad|Macintosh/.test(navigator.userAgent))
      ? 'ios'
      : 'android';

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
        : selected?.kind === 'report'
          ? t('paywall.ctaReport')
          : t('paywall.ctaSubscribe');

  const exitPercent = data.exitOffer ? exitDiscountPercent(regularYearly, data.exitOffer) : 0;

  return (
    <Screen
      header={
        <View style={styles.top}>
          <IconButton icon="close" label={t('common.close')} size={34} onPress={close} />
          <Pressable onPress={() => void restore()} accessibilityRole="button" hitSlop={10} disabled={busy !== null}>
            <AppText variant="smallStrong" color={colors.muted}>
              {busy === 'restore' ? t('paywall.restoring') : copy.restoreShort}
            </AppText>
          </Pressable>
        </View>
      }
      footer={
        <>
          <Button
            label={ctaLabel}
            onPress={() => void buy(selected)}
            loading={busy === 'purchase'}
            disabled={!selected || status !== 'ready' || busy !== null}
          />
          <AppText variant="caption" align="center">
            {selected?.intro?.type === 'trial' ? copy.trialFine : t('paywall.cancelAnytime')}
          </AppText>
        </>
      }
    >
      {isDevPurchases ? <DevBanner /> : null}

      <Reveal style={styles.intro}>
        <AppText variant="display" accessibilityRole="header">
          {copy.paywallTitle}
        </AppText>
        <View style={styles.features}>
          {FEATURES.map((key) => (
            <CheckRow key={key} label={t(key)} />
          ))}
        </View>
      </Reveal>

      {status === 'loading' ? (
        <ActivityIndicator color={colors.violet} style={styles.loader} accessibilityLabel={t('common.loading')} />
      ) : status === 'error' ? (
        <View style={styles.errorBox}>
          <Notice tone="error" message={t('errors.network')} />
          <Button label={t('common.retry')} variant="ghost" onPress={reload} />
        </View>
      ) : (
        <View style={styles.plans} accessibilityRole="radiogroup">
          {data.plans.map((plan, i) => (
            <Reveal key={plan.key} delay={80 + i * 60}>
              <PlanCard
                plan={plan}
                active={plan.key === selected?.key}
                badge={plan.kind === 'yearly' && savings ? `${t('paywall.bestValue')} · ${percentLabel(savings, locale)}` : null}
                onPress={() => setSelectedKey(plan.key)}
              />
            </Reveal>
          ))}
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
            {isDevPurchases ? <Pill tone="butter" label={copy.dev} /> : null}
            <AppText variant="h2" accessibilityRole="header">
              {t('paywall.exitTitle')}
            </AppText>
            <View style={styles.exitRow}>
              <AppText style={styles.exitPercent}>{`−${percentLabel(exitPercent, locale)}`}</AppText>
              <Pill tone="violet" label={t('paywall.yearlyName')} size="md" />
            </View>
            <AppText variant="bodyMuted">
              {t('paywall.exitBody', { percent: exitPercent, price: data.exitOffer.priceString })}
            </AppText>
            <Button
              label={t('paywall.exitCta', { percent: exitPercent })}
              onPress={() => void buy(data.exitOffer)}
              loading={busy === 'purchase'}
            />
            <Button
              label={t('paywall.exitDismiss')}
              variant="quiet"
              compact
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

function PlanCard({
  plan,
  active,
  badge,
  onPress,
}: {
  plan: Plan;
  active: boolean;
  badge: string | null;
  onPress: () => void;
}) {
  const t = useT();
  const copy = uiCopy(useLocale());
  const name =
    plan.kind === 'yearly' ? t('paywall.yearlyName') : plan.kind === 'weekly' ? t('paywall.weeklyName') : t('paywall.reportName');
  const sub =
    plan.kind === 'report'
      ? copy.noSubscription
      : plan.kind === 'weekly' && plan.intro?.type === 'discount'
        ? copy.firstWeek(plan.intro.priceString)
        : planPriceLine(plan, t);
  // Yearly shows its weekly equivalent as the big number (DESIGN.md §3.6).
  const big = plan.kind === 'yearly' && plan.pricePerWeekString ? plan.pricePerWeekString : plan.priceString;
  const unit = plan.kind === 'report' ? copy.once : plan.kind === 'yearly' && !plan.pricePerWeekString ? t('paywall.periodYear') : copy.perWeekShort;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active, checked: active }}
      accessibilityLabel={`${name}. ${sub}. ${big} ${unit}`}
      style={[styles.plan, active && styles.planActive]}
    >
      {badge ? <Pill tone={active ? 'ink' : 'violet'} label={badge} style={styles.badge} /> : null}
      <View style={[styles.radio, active && styles.radioActive]} />
      <View style={styles.planText}>
        <AppText variant="label">{name}</AppText>
        <AppText variant="caption" numberOfLines={2}>
          {sub}
        </AppText>
      </View>
      <View style={styles.price}>
        <AppText style={styles.priceBig} numberOfLines={1} adjustsFontSizeToFit>
          {big}
        </AppText>
        <AppText variant="caption">{unit}</AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  intro: { gap: spacing.md },
  features: { gap: 9 },
  loader: { marginVertical: spacing.xxl },
  errorBox: { gap: spacing.md },
  plans: { gap: 14, marginTop: 4 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  planActive: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  badge: { position: 'absolute', top: -10, right: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper },
  radioActive: { borderWidth: 6, borderColor: colors.violet },
  planText: { flex: 1, gap: 2 },
  price: { alignItems: 'flex-end', maxWidth: '45%' },
  priceBig: { ...typography.number, fontSize: 24, lineHeight: 28 },
  legal: { gap: spacing.sm },
  legalText: { fontFamily: fonts.body, fontSize: 10.5, lineHeight: 15 },
  exitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  exitPercent: { ...typography.number, fontSize: 52, lineHeight: 58, color: colors.violet },
});
