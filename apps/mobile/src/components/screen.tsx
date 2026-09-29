import type { ReactNode, RefObject } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, GUTTER, spacing } from '@/theme';

import { HairlineGrid } from './hairline-grid';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Pinned area below the content (primary CTA / bottom nav). */
  footer?: ReactNode;
  header?: ReactNode;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
  /** Hairline construction grid behind the content (paper screens). */
  grid?: boolean | 'accent';
  /** Ref to the inner ScrollView (e.g. to scroll back to the top on tab change). */
  scrollRef?: RefObject<ScrollView | null>;
}

export function Screen({
  children,
  scroll = true,
  footer,
  header,
  edges = ['top', 'bottom'],
  contentStyle,
  background = colors.paper,
  grid = true,
  scrollRef,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      {grid ? <HairlineGrid accentCircle={grid === 'accent'} /> : null}
      {header ? <View style={styles.header}>{header}</View> : null}
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
      )}
      {footer ? <View style={[styles.footer, { backgroundColor: background }]}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  header: { paddingHorizontal: GUTTER, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  content: { paddingHorizontal: GUTTER, paddingBottom: spacing.xl, gap: spacing.md },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});
