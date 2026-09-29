import { LOCALES, type Locale } from '@tonelle/shared';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Card, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import type { LegalPage } from '@/lib/config';
import { isDevPurchases, manageSubscriptions, restorePurchases, switchUser } from '@/purchases/purchases';
import { openLegal } from '@/services/legal';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing } from '@/theme';

const LEGAL: { page: LegalPage; key: 'legal.privacy' | 'legal.kvkk' | 'legal.consent' | 'legal.terms' }[] = [
  { page: 'privacy', key: 'legal.privacy' },
  { page: 'kvkk', key: 'legal.kvkk' },
  { page: 'consent', key: 'legal.consent' },
  { page: 'terms', key: 'legal.terms' },
];

export default function SettingsScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const setLocale = useAppStore((s) => s.setLocale);
  const deleteAllData = useAppStore((s) => s.deleteAllData);
  const setDevEntitlement = useAppStore((s) => s.setDevEntitlement);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'info' | 'success' | 'error' } | null>(null);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const restore = async () => {
    setRestoring(true);
    setMessage(null);
    try {
      const active = await restorePurchases();
      setMessage(
        active ? { text: t('paywall.restoreSuccess'), tone: 'success' } : { text: t('paywall.restoreNone'), tone: 'info' },
      );
    } catch {
      setMessage({ text: t('errors.generic'), tone: 'error' });
    } finally {
      setRestoring(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(t('settings.deleteDataTitle'), t('settings.deleteDataBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.deleteDataConfirm'),
        style: 'destructive',
        onPress: () => {
          const newId = deleteAllData();
          void switchUser(newId);
          setMessage({ text: t('settings.deleteDataDone'), tone: 'success' });
          router.dismissTo('/');
        },
      },
    ]);
  };

  return (
    <Screen header={<TopBar onBack={() => router.back()} backLabel={t('common.back')} title={t('settings.title')} />}>
      <Card>
        <SectionTitle>{t('settings.language')}</SectionTitle>
        <View style={styles.segment} accessibilityRole="radiogroup">
          {LOCALES.map((code: Locale) => {
            const active = code === locale;
            return (
              <Pressable
                key={code}
                onPress={() => setLocale(code)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active, checked: active }}
                style={[styles.segmentItem, active && styles.segmentActive]}
              >
                <AppText variant="label" color={active ? colors.accentContrast : colors.ink} align="center">
                  {t(`language.${code}`)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <SectionTitle>{t('settings.subscription')}</SectionTitle>
        <AppText variant="body" color={premium ? colors.success : colors.inkMuted}>
          {premium ? t('settings.premiumActive') : t('settings.premiumInactive')}
        </AppText>
        <Button
          label={restoring ? t('paywall.restoring') : t('settings.restorePurchases')}
          variant="secondary"
          onPress={() => void restore()}
          loading={restoring}
          compact
        />
        {!isDevPurchases && premium ? (
          <Button
            label={t('settings.manageSubscription')}
            variant="ghost"
            onPress={() => void manageSubscriptions()}
            compact
          />
        ) : null}
        {isDevPurchases ? (
          <>
            <DevBanner />
            {premium ? (
              <Button label="DEV: reset local premium" variant="ghost" onPress={() => setDevEntitlement(false)} compact />
            ) : null}
          </>
        ) : null}
      </Card>

      {message ? <Notice tone={message.tone} message={message.text} /> : null}

      <Card>
        <SectionTitle>{t('settings.privacySection')}</SectionTitle>
        <AppText variant="bodyMuted">{t('common.privacyBadge')}</AppText>
        <Button label={t('settings.deleteData')} variant="secondary" onPress={confirmDelete} compact />
      </Card>

      <Card>
        <SectionTitle>{t('settings.legalSection')}</SectionTitle>
        {LEGAL.map((item) => (
          <Pressable
            key={item.page}
            onPress={() => void openLegal(locale, item.page)}
            accessibilityRole="link"
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
          >
            <AppText variant="body">{t(item.key)}</AppText>
            <AppText variant="body" color={colors.inkSubtle}>
              ↗
            </AppText>
          </Pressable>
        ))}
        <AppText variant="caption">{t('legal.aiDisclosure')}</AppText>
      </Card>

      <View style={styles.about}>
        <AppText variant="caption" align="center">
          {t('settings.version', { version })}
        </AppText>
        <AppText variant="caption" align="center">
          {t('settings.publisher')}
        </AppText>
        <AppText variant="caption" align="center">
          {t('legal.copyright', { year: new Date().getFullYear() })}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSunken,
    borderRadius: radii.pill,
    padding: 4,
  },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: radii.pill },
  segmentActive: { backgroundColor: colors.accent },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkPressed: { opacity: 0.6 },
  about: { gap: 2, paddingVertical: spacing.lg },
});
