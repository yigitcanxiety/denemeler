import { Children, Fragment, isValidElement, useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, radii, STACK_GAP } from '@/theme';

type CardTone = 'ink' | 'light' | 'clear';

const CARD_BG: Record<CardTone, string> = {
  ink: colors.ink,
  light: colors.paperRaised,
  clear: 'transparent',
};

/** BRIK-style card. `ink` = dark stacked card (default), `light` = secondary info card. */
export function Card({
  children,
  tone = 'ink',
  style,
  padded = true,
}: {
  children?: ReactNode;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: CARD_BG[tone] },
        tone === 'light' && styles.lightBorder,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Vertical "neck": bridges the gap between two stacked cards so they read as one pinched shape.
 * The paper shows through as two slots entering from the outer edges, each ending in a round tip
 * (see the BRIK reference). Drawn with an SVG path; overlaps each card by 1 px to avoid seams.
 */
export function Neck({ color = colors.ink, gap = STACK_GAP, inset = 46 }: { color?: string; gap?: number; inset?: number }) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));
  const h = gap + 2;
  const r = gap / 2;
  const a = Math.min(inset, width / 2 - r - 1);
  const d =
    width > 0
      ? `M${a - r} 0 L${width - a + r} 0 L${width - a + r} 1 A${r} ${r} 0 0 0 ${width - a + r} ${1 + gap} ` +
        `L${width - a + r} ${h} L${a - r} ${h} L${a - r} ${1 + gap} A${r} ${r} 0 0 0 ${a - r} 1 Z`
      : '';
  return (
    <View
      style={[styles.neckV, { height: h }]}
      onLayout={onLayout}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {width > 0 ? (
        <Svg width={width} height={h}>
          <Path d={d} fill={color} />
        </Svg>
      ) : null}
    </View>
  );
}

/** Horizontal neck between two side-by-side cards (pinched at top and bottom). */
export function NeckX({ color = colors.ink, gap = STACK_GAP, inset = 30 }: { color?: string; gap?: number; inset?: number }) {
  const [height, setHeight] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setHeight(Math.round(e.nativeEvent.layout.height));
  const w = gap + 2;
  const r = gap / 2;
  const b = Math.min(inset, height / 2 - r - 1);
  const d =
    height > 0
      ? `M0 ${b - r} L0 ${height - b + r} L1 ${height - b + r} A${r} ${r} 0 0 1 ${1 + gap} ${height - b + r} ` +
        `L${w} ${height - b + r} L${w} ${b - r} L${1 + gap} ${b - r} A${r} ${r} 0 0 1 1 ${b - r} Z`
      : '';
  return (
    <View
      style={[styles.neckX, { width: w }]}
      onLayout={onLayout}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {height > 0 ? (
        <Svg width={w} height={height}>
          <Path d={d} fill={color} />
        </Svg>
      ) : null}
    </View>
  );
}

/** Stack of cards joined by necks. Pass `joined={false}` to separate with a plain gap instead. */
export function CardStack({
  children,
  joined = true,
  color = colors.ink,
  style,
}: {
  children: ReactNode;
  joined?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <View style={style}>
      {items.map((child, i) => (
        <Fragment key={child.key ?? i}>
          {i > 0 ? joined ? <Neck color={color} /> : <View style={{ height: STACK_GAP }} /> : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

/** Two cards side by side joined by a horizontal neck (BRIK "Best score / Reaction speed"). */
export function CardPair({ left, right, color = colors.ink }: { left: ReactNode; right: ReactNode; color?: string }) {
  return (
    <View style={styles.pair}>
      <View style={styles.pairItem}>{left}</View>
      <NeckX color={color} />
      <View style={styles.pairItem}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.card, overflow: 'hidden' },
  lightBorder: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  padded: { paddingHorizontal: 22, paddingVertical: 20 },
  neckV: { marginVertical: -1, zIndex: 1 },
  neckX: { marginHorizontal: -1, alignSelf: 'stretch', zIndex: 1 },
  pair: { flexDirection: 'row', alignItems: 'stretch' },
  pairItem: { flex: 1 },
});
