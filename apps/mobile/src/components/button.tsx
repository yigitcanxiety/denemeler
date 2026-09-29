import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, shadows } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './motion';
import { AppText } from './text';

/**
 * - primary: violet pill with a soft violet shadow (one per screen)
 * - ghost: white pill with a violet-soft outline and violet label
 * - quiet: text-only (muted) for tertiary actions
 * - dark: ink pill (exit offer and other emphasised secondary actions)
 */
type Variant = 'primary' | 'ghost' | 'quiet' | 'dark';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  compact?: boolean;
  /** Leading icon. */
  icon?: IconName;
  /** Trailing icon. */
  trailingIcon?: IconName;
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.violet, fg: colors.onViolet, border: colors.violet },
  ghost: { bg: colors.paper, fg: colors.violet, border: colors.violetSoft },
  quiet: { bg: 'transparent', fg: colors.muted, border: 'transparent' },
  dark: { bg: colors.ink, fg: colors.paper, border: colors.ink },
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
  icon,
  trailingIcon,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.base,
        compact && styles.compact,
        { backgroundColor: v.bg, borderColor: v.border },
        variant === 'primary' && !disabled && shadows.button,
        disabled && !loading && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={v.fg} size="small" /> : icon ? <Icon name={icon} size={18} color={v.fg} /> : null}
        <AppText variant="label" color={v.fg} align="center" style={[styles.label, compact && styles.labelCompact]}>
          {label}
        </AppText>
        {trailingIcon && !loading ? <Icon name={trailingIcon} size={16} color={v.fg} /> : null}
      </View>
    </PressableScale>
  );
}

/** Round icon button (top bars). ≥44 px tap target via hitSlop. */
export function IconButton({
  icon,
  label,
  onPress,
  tone = 'mist',
  size = 38,
  style,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tone?: 'mist' | 'violet' | 'glass';
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = tone === 'violet' ? colors.violet : tone === 'glass' ? colors.floatBg : colors.mist;
  const fg = tone === 'violet' ? colors.onViolet : tone === 'glass' ? colors.ink : colors.violet;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      pressedScale={0.92}
      style={[styles.iconButton, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, style]}
    >
      <Icon name={icon} size={Math.round(size * 0.46)} color={fg} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { minHeight: 44, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 15 },
  labelCompact: { fontSize: 14 },
  disabled: { opacity: 0.45 },
  iconButton: { alignItems: 'center', justifyContent: 'center' },
});
