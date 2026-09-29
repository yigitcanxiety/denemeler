import { BlurTargetView, BlurView } from 'expo-blur';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { Icon } from './icon';
import { Chip } from './labels';
import { AppText } from './text';

/**
 * Frosted teaser card. Children should be decoy/preview content only — the real results are
 * never rendered underneath, so nothing leaks where blur is weak (e.g. older Android).
 */
export function LockedSection({ title, chip, children }: { title: string; chip?: string; children: React.ReactNode }) {
  const target = useRef<View | null>(null);
  return (
    <View style={styles.wrap} accessible accessibilityLabel={title} accessibilityHint="Locked">
      <BlurTargetView ref={target} style={styles.content}>
        {children}
      </BlurTargetView>
      <BlurView
        blurTarget={target}
        intensity={32}
        tint="light"
        blurMethod="dimezisBlurViewSdk31Plus"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.label} pointerEvents="none">
        <View style={styles.lock}>
          <Icon name="lock" size={18} color={colors.accentSoft} />
        </View>
        <AppText variant="label" align="center">
          {title}
        </AppText>
        {chip ? <Chip label={chip} tone="outline" style={styles.chip} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperRaised,
  },
  content: { padding: spacing.xl, gap: spacing.md },
  lock: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  chip: { alignSelf: 'center' },
  label: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
    backgroundColor: 'rgba(239,233,227,0.42)',
  },
});
