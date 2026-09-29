import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './text';

export function Notice({ message, tone = 'info' }: { message: string; tone?: 'info' | 'error' | 'success' }) {
  const color = tone === 'error' ? colors.danger : tone === 'success' ? colors.success : colors.inkMuted;
  return (
    <View
      style={[styles.box, { borderColor: color }]}
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
    >
      <AppText variant="bodyMuted" color={tone === 'info' ? colors.inkMuted : color}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceRaised,
  },
});
