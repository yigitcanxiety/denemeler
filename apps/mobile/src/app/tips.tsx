import { router } from 'expo-router';
import { StyleSheet, View, type ImageSourcePropType, type ViewStyle } from 'react-native';

import { Button } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { Reveal } from '@/components/motion';
import { CoverImage, PORTRAITS } from '@/components/portraits';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { BackTitle, Card, Pill, SectionTitle } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { colors, radii, spacing } from '@/theme';

const TIPS: { key: 'camera.hintLight' | 'camera.hintNoMakeup' | 'camera.hintGlasses' | 'camera.hintNoFilter'; icon: IconName }[] = [
  { key: 'camera.hintLight', icon: 'sun' },
  { key: 'camera.hintNoMakeup', icon: 'drop' },
  { key: 'camera.hintGlasses', icon: 'face' },
  { key: 'camera.hintNoFilter', icon: 'sliders' },
];

type Flaw = 'dark' | 'filter' | 'angle';

/** Selfie tips (DESIGN.md §3.2): how to shoot, with ideal vs. avoid examples. */
export default function TipsScreen() {
  const t = useT();
  const copy = uiCopy(useLocale());
  const ideal = [PORTRAITS.hero, PORTRAITS.two, PORTRAITS.three];
  const avoid: { source: ImageSourcePropType; flaw: Flaw; label: string }[] = [
    { source: PORTRAITS.two, flaw: 'dark', label: copy.avoidDark },
    { source: PORTRAITS.hero, flaw: 'filter', label: copy.avoidFilter },
    { source: PORTRAITS.three, flaw: 'angle', label: copy.avoidAngle },
  ];

  return (
    <Screen
      header={<BackTitle title={copy.tipsTitle} onBack={() => router.back()} backLabel={t('common.back')} />}
      footer={<Button label={copy.tipsCta} icon="camera" onPress={() => router.push('/camera')} />}
    >
      <Reveal>
        <Card tone="mist" style={styles.tips}>
          <AppText variant="label">{copy.tipsWell}</AppText>
          {TIPS.map((tip) => (
            <View key={tip.key} style={styles.tipRow}>
              <Icon name={tip.icon} size={15} color={colors.violet} />
              <AppText variant="small" color={colors.ink} style={styles.tipText}>
                {t(tip.key)}
              </AppText>
            </View>
          ))}
        </Card>
      </Reveal>

      <Reveal delay={80} style={styles.group}>
        <SectionTitle>{copy.idealTitle}</SectionTitle>
        <View style={styles.thumbs}>
          {ideal.map((source, i) => (
            <View key={i} style={[styles.thumb, styles.good]} accessible accessibilityLabel={copy.idealTitle}>
              <CoverImage source={source} focusY={0.2} style={StyleSheet.absoluteFill} />
              <Pill tone="mint" icon="check" label="" style={styles.tag} />
            </View>
          ))}
        </View>
      </Reveal>

      <Reveal delay={160} style={styles.group}>
        <SectionTitle>{copy.avoidTitle}</SectionTitle>
        <View style={styles.thumbs}>
          {avoid.map((item) => (
            <View key={item.flaw} style={[styles.thumb, styles.bad]} accessible accessibilityLabel={item.label}>
              <CoverImage
                source={item.source}
                focusY={0.2}
                blurRadius={1}
                style={[StyleSheet.absoluteFill, FLAW_IMAGE[item.flaw]]}
              />
              <View style={[StyleSheet.absoluteFill, FLAW_VEIL[item.flaw]]} />
              <Pill tone="rose" label={item.label} style={styles.tag} />
            </View>
          ))}
        </View>
      </Reveal>

      <View style={styles.privacy}>
        <Icon name="shield" size={14} color={colors.muted} />
        <AppText variant="small">{t('common.privacyBadge')}</AppText>
      </View>
    </Screen>
  );
}

/** Dimmed "avoid" examples reuse the same portraits with simple RN filters. */
const FLAW_IMAGE: Record<Flaw, ViewStyle> = {
  dark: {},
  filter: {},
  angle: { transform: [{ rotate: '-14deg' }, { scale: 1.3 }] },
};
const FLAW_VEIL: Record<Flaw, ViewStyle> = {
  dark: { backgroundColor: 'rgba(23,20,31,0.55)' },
  filter: { backgroundColor: 'rgba(228,113,138,0.38)' },
  angle: { backgroundColor: 'rgba(23,20,31,0.28)' },
};

const styles = StyleSheet.create({
  tips: { gap: 8, padding: 16 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18 },
  group: { gap: spacing.sm + 2 },
  thumbs: { flexDirection: 'row', gap: 8 },
  thumb: { flex: 1, aspectRatio: 3 / 4, borderRadius: radii.sm, overflow: 'hidden', borderWidth: 2.5, backgroundColor: colors.mist },
  good: { borderColor: colors.good },
  bad: { borderColor: colors.bad },
  tag: { position: 'absolute', left: 5, bottom: 5 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
