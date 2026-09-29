import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Icon } from '@/components/icon';
import { MonoLabel } from '@/components/labels';
import { PressableScale, Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { Card, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Rule } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import type { LegalPage } from '@/lib/config';
import { indexLabel } from '@/lib/ui-copy';
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
      footer={
        <>
          {!canContinue ? (
            <AppText variant="monoSmall" align="center">
              {t('consent.requiredHint')}
            </AppText>
          ) : null}
          <Button label={t('consent.accept')} onPress={accept} disabled={!canContinue} />
          <Button label={t('consent.decline')} variant="ghost" compact onPress={() => setDeclined(true)} />
        </>
      }
    >
      <CardStack>
        <TopBar onBack={() => router.back()} backLabel={t('common.back')} chip="KVKK · GDPR" />
        <Card style={styles.intro}>
          <AppText variant="title" color={colors.onInk} accessibilityRole="header">
            {t('consent.title')}
          </AppText>
          <AppText variant="body" color={colors.onInkMuted}>
            {t('consent.intro')}
          </AppText>
        </Card>
        <Card style={styles.points}>
          {POINTS.map((key, i) => (
            <Reveal key={key} delay={120 + i * 90}>
              {i > 0 ? <Rule onInk style={styles.rule} /> : null}
              <View style={styles.point}>
                <AppText variant="mono" color={colors.accentSoft} style={styles.pointIndex}>
                  {indexLabel(i)}
                </AppText>
                <AppText variant="body" color={colors.onInk} style={styles.pointText}>
                  {t(key)}
                </AppText>
              </View>
            </Reveal>
          ))}
        </Card>
      </CardStack>

      <View style={styles.links}>
        {links.map((link) => (
          <PressableScale
            key={link.page}
            onPress={() => void openLegal(locale, link.page)}
            accessibilityRole="link"
            accessibilityLabel={link.label}
            style={styles.linkChip}
          >
            <MonoLabel caps={false} color={colors.ink} size={12}>
              {link.label}
            </MonoLabel>
            <Icon name="external" size={14} color={colors.accent} />
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
  intro: { gap: spacing.md },
  points: { paddingVertical: 8 },
  rule: { marginVertical: 2 },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', paddingVertical: 12 },
  pointIndex: { width: 22, marginTop: 2 },
  pointText: { flex: 1, fontSize: 15, lineHeight: 22 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  linkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  declined: { gap: spacing.sm },
});
