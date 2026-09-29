import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useLocale, useT } from '@/hooks/use-i18n';
import type { LegalPage } from '@/lib/config';
import { openLegal } from '@/services/legal';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing } from '@/theme';

const POINTS = ['consent.pointProcessing', 'consent.pointNoStorage', 'consent.pointOnDevice', 'consent.pointNoScoring'] as const;

export default function ConsentScreen() {
  const t = useT();
  const locale = useLocale();
  const acceptConsent = useAppStore((s) => s.acceptConsent);
  // Both boxes start unchecked: consent must be an explicit, affirmative act (KVKK md. 6 / GDPR art. 9(2)(a)).
  const [faceConsent, setFaceConsent] = useState(false);
  const [ageTerms, setAgeTerms] = useState(false);
  const [declined, setDeclined] = useState(false);
  const canContinue = faceConsent && ageTerms;

  const links: { page: LegalPage; label: string }[] = [
    { page: 'consent', label: t('consent.readConsent') },
    { page: 'kvkk', label: t('consent.readKvkk') },
    { page: 'privacy', label: t('consent.readPrivacy') },
    { page: 'terms', label: t('legal.terms') },
  ];

  const accept = () => {
    if (!canContinue) return;
    acceptConsent();
    router.replace('/quiz');
  };

  return (
    <Screen
      header={<TopBar onBack={() => router.back()} backLabel={t('common.back')} />}
      footer={
        <>
          {!canContinue ? (
            <AppText variant="caption" align="center">
              {t('consent.requiredHint')}
            </AppText>
          ) : null}
          <Button label={t('consent.accept')} onPress={accept} disabled={!canContinue} />
          <Button label={t('consent.decline')} variant="ghost" onPress={() => setDeclined(true)} />
        </>
      }
    >
      <AppText variant="title" accessibilityRole="header">
        {t('consent.title')}
      </AppText>
      <AppText variant="bodyMuted">{t('consent.intro')}</AppText>

      <View style={styles.points}>
        {POINTS.map((key) => (
          <View key={key} style={styles.point}>
            <View style={styles.dot} />
            <AppText variant="body" style={styles.pointText}>
              {t(key)}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.links}>
        {links.map((link) => (
          <Pressable
            key={link.page}
            onPress={() => void openLegal(locale, link.page)}
            accessibilityRole="link"
            accessibilityLabel={link.label}
            style={styles.linkChip}
          >
            <AppText variant="caption" color={colors.accent}>
              {link.label} ↗
            </AppText>
          </Pressable>
        ))}
      </View>

      <Checkbox checked={faceConsent} onChange={setFaceConsent} label={t('consent.explicitConsentCheckbox')} />
      <Checkbox checked={ageTerms} onChange={setAgeTerms} label={t('consent.termsCheckbox')} />

      {declined ? (
        <View style={styles.declined}>
          <AppText variant="label">{t('consent.declinedTitle')}</AppText>
          <Notice message={t('consent.declinedBody')} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  points: { gap: spacing.md },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 8 },
  pointText: { flex: 1, fontSize: 15, lineHeight: 22 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  linkChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
  },
  declined: { gap: spacing.sm },
});
