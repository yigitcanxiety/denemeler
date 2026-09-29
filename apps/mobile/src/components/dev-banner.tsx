import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './text';

/** Loud marker for local "dev purchases" mode (no RevenueCat keys configured). Not translated on purpose. */
export function DevBanner({ detail }: { detail?: string }) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <AppText variant="label" color={colors.accentContrast}>
        DEV PURCHASES
      </AppText>
      <AppText variant="caption" color={colors.accentContrast}>
        {detail ?? 'RevenueCat keys are not set. Purchases unlock locally and no payment is made.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 2,
  },
});
