import { LOCALES, type Locale } from '@tonelle/shared';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { Icon } from '@/components/icon';
import { Chip, MonoLabel } from '@/components/labels';
import { Notice } from '@/components/notice';
import { PillSegmented } from '@/components/pill-segmented';
import { Screen } from '@/components/screen';
import { Card, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Rule, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import type { LegalPage } from '@/lib/config';
import { indexLabel, uiCopy, upper } from '@/lib/ui-copy';
import { isDevPurchases, manageSubscriptions, restorePurchases, switchUser } from '@/purchases/purchases';
import { openLegal } from '@/services/legal';
import { useAppStore } from '@/store/app-store';
import { colors, spacing } from '@/theme';

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

  const deleteNow = () => {
    const newId = deleteAllData();
    void switchUser(newId);
    setMessage({ text: t('settings.deleteDataDone'), tone: 'success' });
    router.dismissTo('/');
  };

  const confirmDelete = () => {
    // react-native-web's Alert is a no-op; the browser preview uses the native confirm dialog.
    if (Platform.OS === 'web') {
      if (window.confirm(`${t('settings.deleteDataTitle')}\n\n${t('settings.deleteDataBody')}`)) deleteNow();
      return;
    }
    Alert.alert(t('settings.deleteDataTitle'), t('settings.deleteDataBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.deleteDataConfirm'),
        style: 'destructive',
        onPress: deleteNow,
      },
    ]);
  };

  return (
    <Screen>
      <CardStack>
        <TopBar onBack={() => router.back()} backLabel={t('common.back')} title={t('settings.title')} />
        <Card style={styles.gap}>
          <SectionTitle onInk index="01">
            {t('settings.language')}
          </SectionTitle>
          <PillSegmented<Locale>
            role="radiogroup"
            // Each language name is uppercased in its own locale ("English" must not become "ENGLİSH").
            options={LOCALES.map((code: Locale) => ({ key: code, label: upper(t(`language.${code}`), code) }))}
            value={locale}
            onChange={setLocale}
            style={styles.langTrack}
          />
        </Card>
        <Card style={styles.gap}>
          <View style={styles.row}>
            <SectionTitle onInk index="02">
              {t('settings.subscription')}
            </SectionTitle>
          </View>
          <View style={styles.row}>
            <AppText variant="body" color={premium ? colors.onInk : colors.onInkMuted} style={styles.flex}>
              {premium ? t('settings.premiumActive') : t('settings.premiumInactive')}
            </AppText>
            {premium ? <Chip label={uiCopy(locale).premium} tone="soft" centered /> : null}
          </View>
          <Button
            label={restoring ? t('paywall.restoring') : t('settings.restorePurchases')}
            variant="onInk"
            onPress={() => void restore()}
            loading={restoring}
            compact
          />
          {!isDevPurchases && premium ? (
            <Button
              label={t('settings.manageSubscription')}
              variant="soft"
              onPress={() => void manageSubscriptions()}
              compact
            />
          ) : null}
          {isDevPurchases ? (
            <>
              <DevBanner />
              {premium ? (
                <Button label="DEV: reset local premium" variant="onInk" onPress={() => setDevEntitlement(false)} compact />
              ) : null}
            </>
          ) : null}
        </Card>
      </CardStack>

      {message ? <Notice tone={message.tone} message={message.text} /> : null}

      <Card tone="light" style={styles.gap}>
        <SectionTitle index="03">{t('settings.privacySection')}</SectionTitle>
        <AppText variant="bodyMuted">{t('common.privacyBadge')}</AppText>
        <Button label={t('settings.deleteData')} variant="secondary" onPress={confirmDelete} compact />
      </Card>

      <Card tone="light" style={styles.gap}>
        <SectionTitle index="04">{t('settings.legalSection')}</SectionTitle>
        <View>
          {LEGAL.map((item, i) => (
            <View key={item.page}>
              {i > 0 ? <Rule /> : null}
              <Pressable
                onPress={() => void openLegal(locale, item.page)}
                accessibilityRole="link"
                style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
              >
                <AppText variant="mono" color={colors.inkSubtle} style={styles.linkIndex}>
                  {indexLabel(i)}
                </AppText>
                <AppText variant="body" style={styles.flex}>
                  {t(item.key)}
                </AppText>
                <Icon name="external" size={16} color={colors.accent} />
              </Pressable>
            </View>
          ))}
        </View>
        <MonoLabel caps={false}>{t('legal.aiDisclosure')}</MonoLabel>
      </Card>

      <View style={styles.about}>
        <MonoLabel caps={false} style={styles.center}>
          {t('settings.version', { version })}
        </MonoLabel>
        <MonoLabel caps={false} style={styles.center}>
          {t('settings.publisher')}
        </MonoLabel>
        <MonoLabel caps={false} style={styles.center}>
          {t('legal.copyright', { year: new Date().getFullYear() })}
        </MonoLabel>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  langTrack: { backgroundColor: colors.inkSoft },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 48 },
  linkIndex: { width: 22, fontSize: 12 },
  linkPressed: { opacity: 0.6 },
  about: { gap: 2, paddingVertical: spacing.lg },
});
