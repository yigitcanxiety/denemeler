import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './text';

/** Loud marker for local "dev purchases" mode (no RevenueCat keys configured). Not translated on purpose. */
export function DevBanner({ detail }: { detail?: string }) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <AppText variant="eyebrow" color={colors.butterInk}>
        DEV PURCHASES
      </AppText>
      <AppText variant="small" color={colors.butterInk} style={styles.detail}>
        {detail ?? 'RevenueCat keys are not set. Purchases unlock locally and no payment is made.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.butter, borderRadius: radii.md, padding: spacing.md, gap: 2 },
  detail: { fontSize: 11.5, lineHeight: 16 },
});
