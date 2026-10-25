import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { useLocale, useT } from '@/hooks/use-i18n';
import { celebrate } from '@/lib/feedback';
import { legalLinesFor } from '@/lib/paywall';
import { purchaseMessageKey } from '@/lib/purchase-error';
import { uiCopy } from '@/lib/ui-copy';
import { loadPaywall, purchasePlan, restorePurchases, type Plan } from '@/purchases/purchases';
import { useAppStore } from '@/store/app-store';
import { colors, spacing } from '@/theme';

import { Button } from './button';
import { LegalLinks } from './legal-links';
import { Notice } from './notice';
import { AppText } from './text';

/**
 * "7 Gün Boyunca Kullan": buys the weekly plan straight from a locked screen (Glamour-style),
 * with its price, renewal terms and legal links right under the button (App Review 3.1.2).
 */
export function WeeklyUnlock() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const hasAnalysis = useAppStore((s) => s.analysis !== null);
  const hasPhoto = useAppStore((s) => s.photo !== null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [busy, setBusy] = useState<'purchase' | 'restore' | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: 'error' | 'info' } | null>(null);

  useEffect(() => {
    let active = true;
    loadPaywall(locale)
      .then(({ plans }) => active && setPlan(plans.find((p) => p.kind === 'weekly') ?? null))
      .catch((error) => active && setMessage({ text: t(purchaseMessageKey(error, 'errors.network')), tone: 'error' }));
    return () => {
      active = false;
    };
  }, [locale, t]);

  /** Same destination as the paywall: the report, the analysis of a waiting selfie, else home. */
  const done = (alertKey: 'paywall.purchaseSuccess' | 'paywall.restoreSuccess') => {
    celebrate('success');
    Alert.alert(t(alertKey));
    router.dismissTo(hasAnalysis ? '/results' : hasPhoto ? '/analyzing' : '/');
  };

  const buy = async () => {
    if (!plan || busy) return;
    setBusy('purchase');
    setMessage(null);
    try {
      if ((await purchasePlan(plan)) === 'success') done('paywall.purchaseSuccess');
      else setMessage({ text: t('paywall.purchaseCancelled'), tone: 'info' });
    } catch (error) {
      const key = purchaseMessageKey(error, 'paywall.purchaseFailed');
      setMessage({ text: t(key), tone: key === 'paywall.purchasePending' ? 'info' : 'error' });
    } finally {
      setBusy(null);
    }
  };

  const restore = async () => {
    if (busy) return;
    setBusy('restore');
    setMessage(null);
    try {
      if (await restorePurchases()) done('paywall.restoreSuccess');
      else setMessage({ text: t('paywall.restoreNone'), tone: 'info' });
    } catch (error) {
      setMessage({ text: t(purchaseMessageKey(error, 'errors.generic')), tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.root}>
      {message ? <Notice tone={message.tone} message={message.text} /> : null}
      <Button
        label={busy === 'purchase' ? t('paywall.processing') : `${copy.useFor7Days} ✦`}
        onPress={() => void buy()}
        loading={busy === 'purchase'}
        disabled={!plan || busy !== null}
      />
      {plan ? (
        <>
          <AppText variant="caption" align="center" color={colors.ink}>
            {copy.weeklyLine(plan.priceString)}
          </AppText>
          {legalLinesFor(plan, t, Platform.OS === 'android' ? 'android' : 'ios').map((line) => (
            <AppText key={line} variant="caption" align="center" style={styles.legal}>
              {line}
            </AppText>
          ))}
        </>
      ) : null}
      <Pressable onPress={() => router.push('/paywall')} accessibilityRole="link" hitSlop={8} style={styles.center}>
        <AppText variant="smallStrong" color={colors.violet}>
          {copy.allPlans}
        </AppText>
      </Pressable>
      <LegalLinks onRestore={() => void restore()} restoring={busy === 'restore'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  center: { alignSelf: 'center' },
  legal: { fontSize: 10.5, lineHeight: 14 },
});
