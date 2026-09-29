import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/theme';

import { AppText } from './text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  compact?: boolean;
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string; pressed: string }> = {
  primary: { bg: colors.accent, fg: colors.accentContrast, border: colors.accent, pressed: colors.accentHover },
  secondary: { bg: colors.surfaceRaised, fg: colors.ink, border: colors.borderStrong, pressed: colors.surfaceSunken },
  ghost: { bg: 'transparent', fg: colors.accent, border: 'transparent', pressed: colors.accentSoft },
  inverse: { bg: colors.surfaceInverse, fg: colors.inkInverse, border: colors.surfaceInverse, pressed: '#3d3034' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  accessibilityHint,
  compact,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        { backgroundColor: pressed ? v.pressed : v.bg, borderColor: v.border },
        variant === 'primary' && !inactive && shadows.soft,
        inactive && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={v.fg} style={styles.spinner} /> : null}
        <AppText variant="label" color={v.fg} align="center">
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { minHeight: 44, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  spinner: { marginRight: spacing.sm },
  disabled: { opacity: 0.5 },
});
