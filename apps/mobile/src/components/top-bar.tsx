import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './text';

export interface TopBarProps {
  onBack?: () => void;
  backLabel?: string;
  onClose?: () => void;
  closeLabel?: string;
  title?: string;
  right?: React.ReactNode;
}

/** Minimal navigation bar with text/glyph buttons (no icon font dependency). */
export function TopBar({ onBack, backLabel = 'Back', onClose, closeLabel = 'Close', title, right }: TopBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            hitSlop={12}
            style={styles.iconButton}
          >
            <AppText variant="title" color={colors.ink} style={styles.glyph}>
              ‹
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        {title ? (
          <AppText variant="label" align="center" numberOfLines={1}>
            {title}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>
        {right}
        {onClose ? (
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            hitSlop={12}
            style={styles.iconButton}
          >
            <AppText variant="heading" color={colors.inkMuted}>
              ✕
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  side: { minWidth: 72, flexDirection: 'row', alignItems: 'center' },
  right: { justifyContent: 'flex-end' },
  center: { flex: 1, alignItems: 'center' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontSize: 34, lineHeight: 38, marginTop: -4 },
});
