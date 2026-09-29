import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useLocale } from '@/hooks/use-i18n';
import { upper } from '@/lib/ui-copy';
import { colors, fonts, radii } from '@/theme';

import { AppText } from './text';

/**
 * Monospace annotation ("/AI that…"). `slash` prefixes the Neurotrace-style "/" marker;
 * `caps` uppercases locale-aware (Turkish İ/I).
 */
export function MonoLabel({
  children,
  color = colors.inkMuted,
  slash,
  caps = true,
  size = 11,
  style,
  numberOfLines,
}: {
  children: string;
  color?: string;
  slash?: boolean;
  caps?: boolean;
  size?: number;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const locale = useLocale();
  const text = caps ? upper(children, locale) : children;
  return (
    <AppText
      variant="monoLabel"
      color={color}
      numberOfLines={numberOfLines}
      style={[{ fontSize: size, lineHeight: Math.round(size * 1.35) }, style]}
    >
      {slash ? `/${text}` : text}
    </AppText>
  );
}

/** 28×28 black square with a mono two-digit index ("01"). */
export function NumberTag({ label, tone = 'ink', size = 28 }: { label: string; tone?: 'ink' | 'light' | 'accent'; size?: number }) {
  const bg = tone === 'ink' ? colors.ink : tone === 'accent' ? colors.accent : colors.accentSoft;
  const fg = tone === 'light' ? colors.ink : colors.accentContrast;
  return (
    <View
      style={[styles.tag, { width: size, height: size, backgroundColor: bg }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <AppText variant="mono" color={fg} style={styles.tagText}>
        {label}
      </AppText>
    </View>
  );
}

export type ChipTone = 'soft' | 'ink' | 'accent' | 'outline' | 'onInk';

/**
 * Small uppercase chip (BRIK "71 LEVEL" / "3H 41M LEFT"). `soft` = accent-soft (use on dark
 * cards), `ink` = dark on paper, `accent` = lipstick tag (tiny markers only), `onInk` = hairline on dark.
 */
export function Chip({
  label,
  tone = 'soft',
  style,
  caps = true,
}: {
  label: string;
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
  caps?: boolean;
}) {
  const locale = useLocale();
  const t = CHIP_TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg, borderColor: t.border }, style]}>
      <AppText variant="monoLabel" color={t.fg} style={styles.chipText} numberOfLines={1}>
        {caps ? upper(label, locale) : label}
      </AppText>
    </View>
  );
}

const CHIP_TONES: Record<ChipTone, { bg: string; fg: string; border: string }> = {
  soft: { bg: colors.accentSoft, fg: colors.ink, border: colors.accentSoft },
  ink: { bg: colors.ink, fg: colors.onInk, border: colors.ink },
  accent: { bg: colors.accent, fg: colors.accentContrast, border: colors.accent },
  outline: { bg: 'transparent', fg: colors.ink, border: colors.lineStrong },
  onInk: { bg: 'transparent', fg: colors.onInk, border: colors.inkLine },
};

const styles = StyleSheet.create({
  tag: { alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  tagText: { fontSize: 11, lineHeight: 14, fontFamily: fonts.monoMedium },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm - 2,
    borderWidth: 1,
  },
  chipText: { fontSize: 10.5, lineHeight: 13, letterSpacing: 0.6 },
});
