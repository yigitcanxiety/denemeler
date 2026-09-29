import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useLocale } from '@/hooks/use-i18n';
import { matchTone, percentLabel, uiCopy, upper, type MatchTone } from '@/lib/ui-copy';
import { colors, fonts, radii, shadows, spacing } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './motion';
import { AppText } from './text';

/** Serif wordmark. */
export function Wordmark({ size = 24, color = colors.ink }: { size?: number; color?: string }) {
  return (
    <AppText
      variant="display"
      color={color}
      style={{ fontSize: size, lineHeight: size * 1.15, letterSpacing: -size * 0.02 }}
      accessibilityRole="header"
    >
      Tonelle
    </AppText>
  );
}

/** Uppercase eyebrow chip, e.g. "✦ KENDİNİ KEŞFET". */
export function Eyebrow({
  label,
  sparkle = true,
  tone = 'mist',
  style,
}: {
  label: string;
  sparkle?: boolean;
  tone?: 'mist' | 'glass';
  style?: StyleProp<ViewStyle>;
}) {
  const locale = useLocale();
  return (
    <View style={[styles.eyebrow, tone === 'glass' && styles.eyebrowGlass, style]}>
      {sparkle ? <Icon name="sparkle" size={10} color={colors.violet} /> : null}
      <AppText variant="eyebrow">{upper(label, locale)}</AppText>
    </View>
  );
}

const PILL_TONES = {
  mint: { bg: colors.mint, fg: colors.mintInk },
  butter: { bg: colors.butter, fg: colors.butterInk },
  rose: { bg: colors.roseSoft, fg: colors.roseInk },
  violet: { bg: colors.violetSoft, fg: colors.violet },
  ink: { bg: colors.ink, fg: colors.paper },
  glass: { bg: colors.floatBg, fg: colors.ink },
} as const;
export type PillTone = keyof typeof PILL_TONES;

/** Small rounded status pill. */
export function Pill({
  label,
  tone = 'violet',
  icon,
  style,
  size = 'sm',
}: {
  label: string;
  tone?: PillTone;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}) {
  const t = PILL_TONES[tone];
  return (
    <View style={[styles.pill, size === 'md' && styles.pillMd, { backgroundColor: t.bg }, style]}>
      {icon ? <Icon name={icon} size={size === 'md' ? 13 : 10} color={t.fg} strokeWidth={2.2} /> : null}
      {label ? (
        <AppText style={[styles.pillText, size === 'md' && styles.pillTextMd, { color: t.fg }]} numberOfLines={1}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const MATCH_PILL: Record<MatchTone, PillTone> = { high: 'mint', mid: 'butter', low: 'rose' };

/** "%95 uyum" badge: fit of a shade with the user's season (never a beauty score). */
export function MatchPill({ percent, style }: { percent: number; style?: StyleProp<ViewStyle> }) {
  const locale = useLocale();
  return (
    <Pill
      label={uiCopy(locale).match(percentLabel(percent, locale))}
      tone={MATCH_PILL[matchTone(percent)]}
      style={style}
    />
  );
}

/** Serif section heading. */
export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <AppText variant="section" accessibilityRole="header" style={styles.flex}>
        {children}
      </AppText>
      {right}
    </View>
  );
}

/** Back chevron + serif screen title (≥44 px tap target). */
export function BackTitle({ title, onBack, backLabel }: { title: string; onBack: () => void; backLabel: string }) {
  return (
    <PressableScale
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel={backLabel}
      style={styles.back}
      hitSlop={6}
    >
      <Icon name="back" size={20} color={colors.ink} strokeWidth={2} />
      <AppText variant="h2" style={styles.backTitle} numberOfLines={1} accessibilityRole="header">
        {title}
      </AppText>
    </PressableScale>
  );
}

type CardTone = 'plain' | 'mist' | 'violet' | 'rose';
const CARD_TONES: Record<CardTone, ViewStyle> = {
  plain: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  mist: { backgroundColor: colors.mist },
  violet: { backgroundColor: colors.violetSoft },
  rose: { backgroundColor: colors.roseSoft },
};

export function Card({
  children,
  tone = 'plain',
  style,
}: {
  children: ReactNode;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, CARD_TONES[tone], style]}>{children}</View>;
}

/** Row of equal-width rounded swatches. */
export function SwatchRow({
  colors: hexes,
  height = 26,
  radius = 8,
  gap = 5,
}: {
  colors: readonly string[];
  height?: number;
  radius?: number;
  gap?: number;
}) {
  return (
    <View style={[styles.swatchRow, { gap }]} accessible accessibilityLabel={hexes.join(', ')}>
      {hexes.map((hex, i) => (
        <View
          key={`${hex}-${i}`}
          style={[styles.swatch, { height, borderRadius: radius, backgroundColor: hex }]}
        />
      ))}
    </View>
  );
}

/** Circular progress ring (0..1). */
export function Ring({
  size,
  stroke,
  progress,
  color = colors.violet,
  track = colors.violetSoft,
}: {
  size: number;
  stroke: number;
  progress: number;
  color?: string;
  track?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <Svg width={size} height={size} accessibilityElementsHidden importantForAccessibility="no">
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={[circ * p, circ]}
        rotation={-90}
        originX={size / 2}
        originY={size / 2}
      />
    </Svg>
  );
}

/** "1/6" pill + segmented bar. */
export function StepBar({ current, total, style }: { current: number; total: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.stepBar, style]} accessible accessibilityLabel={`${current}/${total}`}>
      <View style={styles.stepPill}>
        <AppText style={styles.stepPillText}>{`${current}/${total}`}</AppText>
      </View>
      <View style={styles.stepBars}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.stepSeg, i < current && styles.stepSegOn]} />
        ))}
      </View>
    </View>
  );
}

/** Benefit / checklist row with a soft violet tick. */
export function CheckRow({ label }: { label: string }) {
  return (
    <View style={styles.checkRow}>
      <View style={styles.checkDot}>
        <Icon name="check" size={12} color={colors.violet} strokeWidth={2.4} />
      </View>
      <AppText variant="body" style={styles.checkText}>
        {label}
      </AppText>
    </View>
  );
}

/** Two-or-more option segmented control (language switch). */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <View style={styles.segTrack} accessibilityRole="radiogroup">
      {options.map((o) => {
        const active = o.key === value;
        return (
          <PressableScale
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active, checked: active }}
            accessibilityLabel={o.label}
            style={[styles.segItem, active && styles.segItemOn]}
          >
            <AppText variant="label" color={active ? colors.ink : colors.muted} style={styles.segText}>
              {o.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

/** White floating data chip over photos (Aura). Position it with `style`. */
export function FloatChip({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.float, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  eyebrowGlass: { backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'transparent', alignSelf: 'flex-start' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    minHeight: 17,
    borderRadius: radii.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  pillMd: { paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  pillText: { fontFamily: fonts.bold, fontSize: 10.5, lineHeight: 13 },
  pillTextMd: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 17 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, alignSelf: 'flex-start', paddingRight: 8 },
  backTitle: { fontSize: 23, lineHeight: 27, flexShrink: 1 },
  card: { borderRadius: radii.card, padding: 14 },
  swatchRow: { flexDirection: 'row' },
  swatch: { flex: 1 },
  stepBar: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  stepPill: { backgroundColor: colors.violet, borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 2 },
  stepPillText: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 15, color: colors.onViolet },
  stepBars: { flexDirection: 'row', gap: 4, flex: 1 },
  stepSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  stepSegOn: { backgroundColor: colors.violet },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { flex: 1, fontSize: 14.5, lineHeight: 20 },
  segTrack: { flexDirection: 'row', backgroundColor: colors.mist, borderRadius: radii.pill, padding: 4, gap: 4 },
  segItem: { flex: 1, minHeight: 40, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  segItemOn: { backgroundColor: colors.paper, ...shadows.float, shadowOpacity: 0.08 },
  segText: { fontSize: 14 },
  float: {
    position: 'absolute',
    backgroundColor: colors.floatBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
    ...shadows.float,
  },
});
