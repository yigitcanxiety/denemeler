import { LOCALES, type Locale } from '@tonelle/shared';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Card, Pill, Segmented, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import type { LegalPage } from '@/lib/config';
import { uiCopy } from '@/lib/ui-copy';
import { isDevPurchases, manageSubscriptions, restorePurchases, switchUser } from '@/purchases/purchases';
import { openLegal } from '@/services/legal';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, TAB_CLEARANCE } from '@/theme';

const LEGAL: { page: LegalPage; key: 'legal.privacy' | 'legal.kvkk' | 'legal.consent' | 'legal.terms' }[] = [
  { page: 'privacy', key: 'legal.privacy' },
  { page: 'kvkk', key: 'legal.kvkk' },
  { page: 'consent', key: 'legal.consent' },
  { page: 'terms', key: 'legal.terms' },
];

/** Profil tab: language, subscription, preferences, privacy (delete data) and legal. */
export default function ProfileScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
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
    router.navigate('/');
  };

  const confirmDelete = () => {
    // react-native-web's Alert is a no-op; the browser preview uses the native confirm dialog.
    if (Platform.OS === 'web') {
      if (window.confirm(`${t('settings.deleteDataTitle')}\n\n${t('settings.deleteDataBody')}`)) deleteNow();
      return;
    }
    Alert.alert(t('settings.deleteDataTitle'), t('settings.deleteDataBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.deleteDataConfirm'), style: 'destructive', onPress: deleteNow },
    ]);
  };

  return (
    <Screen edges={['top']} contentStyle={styles.tabContent}>
      <View style={styles.top}>
        <AppText variant="h2" accessibilityRole="header">
          {copy.profileTitle}
        </AppText>
        {premium ? <Pill tone="violet" icon="sparkle" label="Premium" size="md" /> : null}
      </View>

      <Card style={styles.gap}>
        <SectionTitle>{t('settings.language')}</SectionTitle>
        <Segmented<Locale>
          options={LOCALES.map((code: Locale) => ({ key: code, label: t(`language.${code}`) }))}
          value={locale}
          onChange={setLocale}
        />
      </Card>

      <Card style={styles.gap}>
        <SectionTitle
          right={<Pill tone={premium ? 'mint' : 'violet'} label={premium ? t('settings.premiumActive') : t('settings.premiumInactive')} />}
        >
          {t('settings.subscription')}
        </SectionTitle>
        {premium ? null : <Button label={copy.unlockResults} icon="sparkle" onPress={() => router.push('/paywall')} />}
        <Button
          label={restoring ? t('paywall.restoring') : t('settings.restorePurchases')}
          variant="ghost"
          onPress={() => void restore()}
          loading={restoring}
          compact
        />
        {!isDevPurchases && premium ? (
          <Button label={t('settings.manageSubscription')} variant="ghost" onPress={() => void manageSubscriptions()} compact />
        ) : null}
        {isDevPurchases ? (
          <>
            <DevBanner />
            {premium ? (
              <Button label="DEV: reset local premium" variant="quiet" onPress={() => setDevEntitlement(false)} compact />
            ) : null}
          </>
        ) : null}
      </Card>

      {message ? <Notice tone={message.tone} message={message.text} /> : null}

      <View style={styles.list}>
        <Row icon="sliders" title={copy.preferences} body={copy.preferencesBody} onPress={() => router.push('/quiz')} />
        <Row icon="trash" title={t('settings.deleteData')} onPress={confirmDelete} danger />
      </View>

      <View style={styles.gapSm}>
        <SectionTitle>{t('settings.legalSection')}</SectionTitle>
        <View style={styles.list}>
          {LEGAL.map((item) => (
            <Row key={item.page} icon="external" title={t(item.key)} onPress={() => void openLegal(locale, item.page)} link />
          ))}
        </View>
        <AppText variant="caption">{t('legal.aiDisclosure')}</AppText>
      </View>

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

function Row({
  icon,
  title,
  body,
  onPress,
  danger,
  link,
}: {
  icon: IconName;
  title: string;
  body?: string;
  onPress: () => void;
  danger?: boolean;
  link?: boolean;
}) {
  const tint = danger ? colors.roseInk : colors.violet;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole={link ? 'link' : 'button'}
      accessibilityLabel={body ? `${title}. ${body}` : title}
      style={styles.row}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? colors.roseSoft : colors.violetSoft }]}>
        <Icon name={icon} size={16} color={tint} />
      </View>
      <View style={styles.flex}>
        <AppText variant="label" color={danger ? colors.roseInk : colors.ink}>
          {title}
        </AppText>
        {body ? <AppText variant="caption">{body}</AppText> : null}
      </View>
      <Icon name="chevronRight" size={16} color={colors.muted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tabContent: { paddingBottom: TAB_CLEARANCE },
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, paddingTop: spacing.xs },
  gap: { gap: spacing.md },
  gapSm: { gap: 10 },
  list: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 58,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  about: { gap: 2, paddingVertical: spacing.md },
});
