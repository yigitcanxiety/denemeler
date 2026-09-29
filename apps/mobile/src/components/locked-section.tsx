import { BlurTargetView, BlurView } from 'expo-blur';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './text';

/**
 * Blurred teaser block. Children should be decoy/preview content only — the real results are
 * never rendered underneath, so nothing leaks where blur is weak (e.g. older Android).
 */
export function LockedSection({ title, children }: { title: string; children: React.ReactNode }) {
  const target = useRef<View | null>(null);
  return (
    <View style={styles.wrap} accessible accessibilityLabel={title} accessibilityHint="Locked">
      <BlurTargetView ref={target} style={styles.content}>
        {children}
      </BlurTargetView>
      <BlurView
        blurTarget={target}
        intensity={28}
        tint="light"
        blurMethod="dimezisBlurViewSdk31Plus"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.label} pointerEvents="none">
        <View style={styles.lock}>
          <View style={styles.lockShackle} />
          <View style={styles.lockBody} />
        </View>
        <AppText variant="label">{title}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  content: { padding: spacing.xl, gap: spacing.md },
  lock: { alignItems: 'center' },
  lockShackle: {
    width: 14,
    height: 10,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.accent,
  },
  lockBody: { width: 20, height: 14, borderRadius: 4, backgroundColor: colors.accent },
  label: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(253,249,246,0.35)',
  },
});
