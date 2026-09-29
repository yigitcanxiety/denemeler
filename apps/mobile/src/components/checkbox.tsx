import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { Icon } from './icon';
import { PressableScale } from './motion';
import { AppText } from './text';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/** Explicit, unchecked-by-default consent checkbox (light card, ink square when ticked). */
export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      pressedScale={0.985}
      style={[styles.row, checked && styles.rowChecked]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Icon name="check" size={16} color={colors.accentSoft} strokeWidth={2.2} /> : null}
      </View>
      <AppText variant="body" style={styles.label}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.card,
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowChecked: { borderColor: colors.ink },
  box: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: { backgroundColor: colors.ink, borderColor: colors.ink },
  label: { flex: 1, fontSize: 14.5, lineHeight: 21 },
});
