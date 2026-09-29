import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './motion';
import { AppText } from './text';

/**
 * - primary: full-width ink pill (the one CTA per screen)
 * - secondary: hairline outline pill on paper
 * - ghost: quiet text button
 * - soft: accent-soft pill, for actions inside dark cards
 * - onInk: hairline outline pill inside dark cards
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'onInk';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  compact?: boolean;
  icon?: IconName;
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.ink, fg: colors.onInk, border: colors.ink },
  secondary: { bg: 'transparent', fg: colors.ink, border: colors.lineStrong },
  ghost: { bg: 'transparent', fg: colors.inkMuted, border: 'transparent' },
  soft: { bg: colors.accentSoft, fg: colors.ink, border: colors.accentSoft },
  onInk: { bg: 'transparent', fg: colors.onInk, border: colors.inkLine },
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
        inactive && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={v.fg} style={styles.spinner} /> : null}
        <AppText variant="label" color={v.fg} align="center" style={[styles.label, compact && styles.labelCompact]}>
          {label}
        </AppText>
        {icon && !loading ? (
          <View style={styles.icon}>
            <Icon name={icon} size={18} color={v.fg} />
          </View>
        ) : null}
      </View>
    </PressableScale>
  );
}

/** Round ink icon button (BRIK nav flank / top bar). 48 px, ≥44 px tap target. */
export function IconButton({
  icon,
  label,
  onPress,
  tone = 'ink',
  size = 48,
  style,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tone?: 'ink' | 'light' | 'glass';
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = tone === 'ink' ? colors.ink : tone === 'light' ? colors.paperRaised : 'rgba(22,16,16,0.45)';
  const fg = tone === 'light' ? colors.ink : colors.onInk;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      pressedScale={0.92}
      style={[
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        tone === 'light' && styles.iconLight,
        style,
      ]}
    >
      <Icon name={icon} size={Math.round(size * 0.42)} color={fg} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { minHeight: 44, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontFamily: fonts.medium, fontSize: 16 },
  labelCompact: { fontSize: 14 },
  spinner: { marginRight: spacing.sm },
  icon: { marginLeft: spacing.sm },
  disabled: { opacity: 0.4 },
  iconButton: { alignItems: 'center', justifyContent: 'center' },
  iconLight: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});
