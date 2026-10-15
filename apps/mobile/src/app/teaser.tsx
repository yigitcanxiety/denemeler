import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, IconButton } from '@/components/button';
import { LegalLinks } from '@/components/legal-links';
import { LockedResult } from '@/components/locked-result';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { StepBar } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { uiCopy } from '@/lib/ui-copy';
import { restorePurchases } from '@/purchases/purchases';
import { useAppStore } from '@/store/app-store';

/** Locked result (DESIGN.md §3.5): the result exists but stays blurred until unlocked. */
export default function TeaserScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!analysis) return <Redirect href="/" />;
  if (premium) return <Redirect href="/results" />;

  const restore = async () => {
    setRestoring(true);
    setMessage(null);
    try {
      if (await restorePurchases()) router.replace('/results');
      else setMessage(t('paywall.restoreNone'));
    } catch {
      setMessage(t('errors.generic'));
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Screen
      header={
        <View style={styles.top}>
          <StepBar current={1} total={6} />
          <IconButton icon="close" label={t('common.close')} size={32} onPress={() => router.dismissTo('/')} />
        </View>
      }
      footer={
        <>
          {/* Prices and trial terms appear only on the paywall, from the store (3.1.2). */}
          <Button label={`${copy.unlockResults} ✦`} onPress={() => router.push('/paywall')} />
          <LegalLinks onRestore={() => void restore()} restoring={restoring} />
        </>
      }
    >
      <LockedResult analysis={analysis} />
      {message ? <Notice message={message} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
