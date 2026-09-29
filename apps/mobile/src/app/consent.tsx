import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale, Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { BackTitle, Card } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import type { LegalPage } from '@/lib/config';
import { openLegal } from '@/services/legal';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing } from '@/theme';

const POINTS: { key: 'consent.pointProcessing' | 'consent.pointNoStorage' | 'consent.pointOnDevice' | 'consent.pointNoScoring'; icon: IconName }[] = [
  { key: 'consent.pointProcessing', icon: 'sparkle' },
  { key: 'consent.pointNoStorage', icon: 'shield' },
  { key: 'consent.pointOnDevice', icon: 'lock' },
  { key: 'consent.pointNoScoring', icon: 'check' },
];

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
    router.replace('/tips');
  };

  return (
    <Screen
      header={<BackTitle title={t('consent.title')} onBack={() => router.back()} backLabel={t('common.back')} />}
      footer={
        <>
          {!canContinue ? (
            <AppText variant="small" align="center">
              {t('consent.requiredHint')}
            </AppText>
          ) : null}
          <Button label={t('consent.accept')} onPress={accept} disabled={!canContinue} />
          <Button label={t('consent.decline')} variant="quiet" compact onPress={() => setDeclined(true)} />
        </>
      }
    >
      <AppText variant="bodyMuted">{t('consent.intro')}</AppText>

      <Card tone="mist" style={styles.points}>
        {POINTS.map((point, i) => (
          <Reveal key={point.key} delay={i * 60} style={styles.point}>
            <View style={styles.pointIcon}>
              <Icon name={point.icon} size={15} color={colors.violet} />
            </View>
            <AppText variant="small" color={colors.ink} style={styles.pointText}>
              {t(point.key)}
            </AppText>
          </Reveal>
        ))}
      </Card>

      <View style={styles.links}>
        {links.map((link) => (
          <PressableScale
            key={link.page}
            onPress={() => void openLegal(locale, link.page)}
            accessibilityRole="link"
            accessibilityLabel={link.label}
            hitSlop={4}
            style={styles.linkChip}
          >
            <AppText variant="smallStrong" color={colors.violet}>
              {link.label}
            </AppText>
            <Icon name="external" size={13} color={colors.violet} />
          </PressableScale>
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
  points: { gap: 12, padding: 16 },
  point: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  pointIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: { flex: 1, fontSize: 13.5, lineHeight: 19.5 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  linkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.violetSoft,
  },
  declined: { gap: spacing.sm },
});
