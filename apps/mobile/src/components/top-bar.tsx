import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme';

import { IconButton } from './button';
import { Chip } from './labels';
import { AppText } from './text';

export interface TopBarProps {
  onBack?: () => void;
  backLabel?: string;
  onClose?: () => void;
  closeLabel?: string;
  /** Replaces the wordmark with a screen title. */
  title?: string;
  /** Small accent-soft chip on the right (e.g. "2/5", "PREMIUM"). */
  chip?: string;
  right?: ReactNode;
  /** `ink` = dark card (default); `clear` = transparent bar on paper. */
  tone?: 'ink' | 'clear';
}

/** BRIK top bar card: dark rounded card with the wordmark (or title) and a pale chip. */
export function TopBar({
  onBack,
  backLabel = 'Back',
  onClose,
  closeLabel = 'Close',
  title,
  chip,
  right,
  tone = 'ink',
}: TopBarProps) {
  const dark = tone === 'ink';
  return (
    <View style={[styles.bar, dark ? styles.dark : null]}>
      {onBack ? (
        <IconButton icon="back" label={backLabel} onPress={onBack} size={38} tone={dark ? 'glass' : 'light'} style={dark ? styles.btnDark : undefined} />
      ) : null}
      <View style={styles.center}>
        {title ? (
          <AppText variant="label" color={dark ? colors.onInk : colors.ink} numberOfLines={1} accessibilityRole="header">
            {title}
          </AppText>
        ) : (
          <Wordmark color={dark ? colors.onInk : colors.ink} />
        )}
      </View>
      {chip ? <Chip label={chip} tone={dark ? 'soft' : 'ink'} centered /> : null}
      {right}
      {onClose ? (
        <IconButton icon="close" label={closeLabel} onPress={onClose} size={38} tone={dark ? 'glass' : 'light'} style={dark ? styles.btnDark : undefined} />
      ) : null}
    </View>
  );
}

/** Small "Tonelle" logotype with an accent registration dot. */
export function Wordmark({ color = colors.onInk, size = 21 }: { color?: string; size?: number }) {
  return (
    <View style={styles.wordmark} accessible accessibilityLabel="Tonelle">
      <AppText
        variant="heading"
        color={color}
        style={{ fontSize: size, lineHeight: size * 1.1, letterSpacing: -size * 0.05 }}
      >
        Tonelle
      </AppText>
      <View style={[styles.dot, { width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: radii.card,
  },
  dark: { backgroundColor: colors.ink, paddingLeft: 12, paddingRight: 14 },
  btnDark: { backgroundColor: colors.inkSoft },
  center: { flex: 1, paddingLeft: 6 },
  wordmark: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: { backgroundColor: colors.accent, marginLeft: 2, marginTop: 3 },
});
