import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { readableTextOn } from '@/lib/results';
import { colors, fonts, radii, shadows, spacing } from '@/theme';

import { AppText } from './text';

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, value, tone = 'default' }: { label?: string; value: string; tone?: 'default' | 'accent' }) {
  return (
    <View
      style={[styles.chip, tone === 'accent' && styles.chipAccent]}
      accessible
      accessibilityLabel={label ? `${label}: ${value}` : value}
    >
      {label ? (
        <AppText variant="caption" color={colors.inkMuted}>
          {label}
        </AppText>
      ) : null}
      <AppText variant="label" color={tone === 'accent' ? colors.accent : colors.ink}>
        {value}
      </AppText>
    </View>
  );
}

export function Swatch({ hex, size = 44, showHex }: { hex: string; size?: number; showHex?: boolean }) {
  return (
    <View style={styles.swatchWrap} accessible accessibilityLabel={hex}>
      <View style={[styles.swatch, { width: size, height: size, borderRadius: size / 2, backgroundColor: hex }]}>
        {showHex && size >= 56 ? (
          <AppText variant="caption" color={readableTextOn(hex)} style={styles.swatchHex}>
            {hex.toUpperCase()}
          </AppText>
        ) : null}
      </View>
      {showHex && size < 56 ? (
        <AppText variant="caption" style={styles.swatchCaption}>
          {hex.toUpperCase()}
        </AppText>
      ) : null}
    </View>
  );
}

export function SwatchRow({ colors: hexes, size, showHex }: { colors: string[]; size?: number; showHex?: boolean }) {
  return (
    <View style={styles.swatchRow}>
      {hexes.map((hex, i) => (
        <Swatch key={`${hex}-${i}`} hex={hex} size={size} showHex={showHex} />
      ))}
    </View>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <AppText variant="heading" accessibilityRole="header">
      {children}
    </AppText>
  );
}

export function Badge({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'dev' | 'ink' }) {
  const bg = tone === 'dev' ? colors.warning : tone === 'ink' ? colors.surfaceInverse : colors.accent;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <AppText variant="caption" color={colors.accentContrast} style={styles.badgeText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.soft,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSunken,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAccent: { backgroundColor: colors.accentSoft, borderColor: colors.accentSoft },
  swatchWrap: { alignItems: 'center', gap: spacing.xs },
  swatch: {
    borderWidth: 1,
    borderColor: 'rgba(43,33,36,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchHex: { fontSize: 10 },
  swatchCaption: { fontSize: 10 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  track: { height: 6, borderRadius: radii.pill, backgroundColor: colors.surfaceSunken, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radii.pill, backgroundColor: colors.accent },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  badgeText: { fontFamily: fonts.bodySemiBold, letterSpacing: 0.6 },
});
