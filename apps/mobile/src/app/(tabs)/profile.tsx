import { LOCALES, type Locale } from '@tonelle/shared';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { DevBanner } from '@/components/dev-banner';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Card, Pill, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import type { LegalPage } from '@/lib/config';
import { playSound } from '@/lib/feedback';
import { purchaseMessageKey } from '@/lib/purchase-error';
import { disableReminders, enableReminders } from '@/lib/reminders';
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
  const chosenLocale = useAppStore((s) => s.locale);
  const copy = uiCopy(locale);
  const premium = usePremium();
  const setLocale = useAppStore((s) => s.setLocale);
  const deleteAllData = useAppStore((s) => s.deleteAllData);
  const setDevEntitlement = useAppStore((s) => s.setDevEntitlement);
  const tipsEnabled = useAppStore((s) => s.tipsEnabled);
  const setTipsEnabled = useAppStore((s) => s.setTipsEnabled);
  const resetTips = useAppStore((s) => s.resetTips);
  const soundsEnabled = useAppStore((s) => s.soundsEnabled);
  const setSoundsEnabled = useAppStore((s) => s.setSoundsEnabled);
  const remindersEnabled = useAppStore((s) => s.remindersEnabled);
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
    } catch (error) {
      setMessage({ text: t(purchaseMessageKey(error, 'errors.generic')), tone: 'error' });
    } finally {
      setRestoring(false);
    }
  };

  const deleteNow = () => {
    void disableReminders();
    const newId = deleteAllData();
    void switchUser(newId);
    setMessage({ text: t('settings.deleteDataDone'), tone: 'success' });
    router.navigate('/');
  };

  // Pre-filled support mail: app version and device help us reproduce a problem.
  const contact = () => {
    const body = `\n\n—\nTonelle ${version} · ${Platform.OS} ${String(Platform.Version)} · ${locale}`;
    void Linking.openURL(`mailto:support@tonelleapp.com?subject=${encodeURIComponent('Tonelle')}&body=${encodeURIComponent(body)}`).catch(() => undefined);
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

  const [langOpen, setLangOpen] = useState(false);
  const currentLanguage = chosenLocale === null ? t('language.auto') : t(`language.${chosenLocale}`);
  const chooseLocale = (code: Locale | null) => {
    setLocale(code);
    setLangOpen(false);
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
        <PressableScale
          onPress={() => setLangOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: langOpen }}
          accessibilityLabel={`${t('settings.language')}: ${currentLanguage}`}
          style={styles.langHeader}
        >
          <Icon name="globe" size={18} color={colors.violet} />
          <View style={styles.flex}>
            <AppText variant="label">{t('settings.language')}</AppText>
            <AppText variant="small" numberOfLines={1}>
              {currentLanguage}
            </AppText>
          </View>
          <Icon name={langOpen ? 'chevronDown' : 'chevronRight'} size={18} color={colors.muted} />
        </PressableScale>
        {langOpen ? (
          <View style={styles.list}>
            <LanguageRow label={t('language.auto')} selected={chosenLocale === null} onPress={() => chooseLocale(null)} />
            {LOCALES.map((code) => (
              <LanguageRow key={code} label={t(`language.${code}`)} selected={chosenLocale === code} onPress={() => chooseLocale(code)} />
            ))}
          </View>
        ) : null}
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
        <View style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: colors.violetSoft }]}>
            <Icon name="sparkle" size={16} color={colors.violet} />
          </View>
          <View style={styles.flex}>
            <AppText variant="label">{t('assistant.settingsTitle')}</AppText>
            <AppText variant="caption">{t('assistant.settingsBody')}</AppText>
          </View>
          <Switch
            value={tipsEnabled}
            onValueChange={setTipsEnabled}
            trackColor={{ true: colors.violet, false: colors.line }}
            accessibilityLabel={t('assistant.settingsTitle')}
          />
        </View>
        <ToggleRow
          icon="sound"
          title={t('settings.soundsTitle')}
          body={t('settings.soundsBody')}
          value={soundsEnabled}
          onChange={(on) => {
            setSoundsEnabled(on);
            if (on) playSound('tick');
          }}
        />
        {Platform.OS === 'web' ? null : (
          <ToggleRow
            icon="bell"
            title={t('settings.remindersTitle')}
            body={t('settings.remindersBody')}
            value={remindersEnabled}
            onChange={async (on) => {
              if (!on) return void disableReminders();
              if (!(await enableReminders(locale))) setMessage({ text: t('settings.remindersDenied'), tone: 'info' });
            }}
          />
        )}
        <Row
          icon="refresh"
          title={t('assistant.replayTitle')}
          body={t('assistant.replayBody')}
          onPress={() => {
            resetTips();
            setMessage({ text: t('assistant.replayDone'), tone: 'success' });
          }}
        />
        <Row icon="alert" title={t('settings.contact')} body="support@tonelleapp.com" onPress={contact} />
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
          {t('legal.copyright', { year: new Date().getFullYear() })}
        </AppText>
      </View>
    </Screen>
  );
}

/** One option of the language picker; native language names, check mark on the active choice. */
function LanguageRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={label}
      style={[styles.row, styles.langRow, selected && styles.langRowOn]}
    >
      <AppText variant="label" color={selected ? colors.ink : colors.muted} style={styles.flex}>
        {label}
      </AppText>
      {selected ? <Icon name="check" size={16} color={colors.violet} strokeWidth={2.2} /> : null}
    </PressableScale>
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
  langHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
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
  langRow: { minHeight: 48 },
  langRowOn: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  rowIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  about: { gap: 2, paddingVertical: spacing.md },
});

/** Settings row with a switch. */
function ToggleRow({
  icon,
  title,
  body,
  value,
  onChange,
}: {
  icon: IconName;
  title: string;
  body: string;
  value: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.violetSoft }]}>
        <Icon name={icon} size={16} color={colors.violet} />
      </View>
      <View style={styles.flex}>
        <AppText variant="label">{title}</AppText>
        <AppText variant="caption">{body}</AppText>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.violet, false: colors.line }} accessibilityLabel={title} />
    </View>
  );
}
