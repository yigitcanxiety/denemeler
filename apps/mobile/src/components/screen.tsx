import type { ComponentRef, ReactNode, RefObject } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { colors, GUTTER, spacing } from '@/theme';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Pinned area below the content (primary CTA and fine print). */
  footer?: ReactNode;
  /** Pinned area above the content (top bar). */
  header?: ReactNode;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
  /** Absolute overlay above the content (helper character). */
  overlay?: ReactNode;
  /** Ref to the inner ScrollView (e.g. to scroll back to the top). */
  scrollRef?: RefObject<ComponentRef<typeof ScrollView> | null>;
}

/**
 * White app surface with a 16 px gutter, an optional pinned header and footer.
 * Side insets always apply: iPhone Duo's inner display keeps a status-bar rail on one edge.
 * Insets come from the root provider: the native SafeAreaView measured 0 inside the sliding
 * full-screen paywall modal, which put the close button under the status bar.
 */
export function Screen({
  children,
  scroll = true,
  footer,
  header,
  edges = ['top', 'bottom'],
  contentStyle,
  background = colors.paper,
  overlay,
  scrollRef,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
  };
  return (
    <View style={[styles.root, pad, { backgroundColor: background }]}>
      <View style={[styles.fill, { paddingLeft: insets.left, paddingRight: insets.right }]}>
        {header ? <View style={styles.header}>{header}</View> : null}
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            style={styles.fill}
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
      </View>
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  header: { paddingHorizontal: GUTTER, paddingTop: spacing.sm, paddingBottom: spacing.xs },
  content: { paddingHorizontal: GUTTER, paddingTop: spacing.sm, paddingBottom: spacing.xl, gap: spacing.lg },
  footer: { paddingHorizontal: GUTTER, paddingTop: spacing.sm, paddingBottom: spacing.md, gap: spacing.sm },
});
