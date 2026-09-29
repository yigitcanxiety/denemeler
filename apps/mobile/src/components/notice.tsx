import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './text';

/** Inline status message: light card with a coloured marker bar, mono text. */
export function Notice({ message, tone = 'info' }: { message: string; tone?: 'info' | 'error' | 'success' }) {
  const marker = tone === 'error' ? colors.danger : tone === 'success' ? colors.success : colors.inkSubtle;
  return (
    <View
      style={styles.box}
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.marker, { backgroundColor: marker }]} />
      <AppText variant="mono" color={tone === 'info' ? colors.inkMuted : colors.ink} style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.paperRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  marker: { width: 3, borderRadius: 2 },
  text: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});
