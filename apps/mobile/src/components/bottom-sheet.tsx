import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { colors, radii, spacing } from '@/theme';

export function BottomSheet({
  visible,
  onDismiss,
  onDismissed,
  children,
  dismissLabel,
}: {
  visible: boolean;
  /** The user asked to close the sheet (backdrop, back button). */
  onDismiss: () => void;
  /** The sheet has finished closing (iOS only; Android never calls it). */
  onDismissed?: () => void;
  children: React.ReactNode;
  dismissLabel: string;
}) {
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? 'fade' : 'slide'}
      onRequestClose={onDismiss}
      onDismiss={onDismissed}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onDismiss} accessibilityRole="button" accessibilityLabel={dismissLabel} />
        <View style={[styles.sheet, { paddingBottom: spacing.xl + insets.bottom, marginLeft: insets.left, marginRight: insets.right }]} accessibilityViewIsModal>
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.line,
    marginBottom: spacing.sm,
  },
});
