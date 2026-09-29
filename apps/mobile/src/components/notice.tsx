import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { Icon } from './icon';
import { AppText } from './text';

const TONES = {
  info: { bg: colors.mist, fg: colors.muted, icon: 'sparkle' },
  success: { bg: colors.mint, fg: colors.mintInk, icon: 'check' },
  warning: { bg: colors.butter, fg: colors.butterInk, icon: 'alert' },
  error: { bg: colors.roseSoft, fg: colors.roseInk, icon: 'alert' },
} as const;

/** Inline status message in a soft tinted well. */
export function Notice({ message, tone = 'info' }: { message: string; tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <View
      style={[styles.box, { backgroundColor: t.bg }]}
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
    >
      <Icon name={t.icon} size={16} color={t.fg} />
      <AppText variant="small" color={t.fg} style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, borderRadius: radii.md, padding: spacing.md },
  text: { flex: 1, fontSize: 13, lineHeight: 18 },
});
