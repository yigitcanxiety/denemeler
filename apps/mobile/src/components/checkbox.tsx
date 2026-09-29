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

/** Explicit, unchecked-by-default consent checkbox (bordered card, violet square when ticked). */
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
        {checked ? <Icon name="check" size={15} color={colors.onViolet} strokeWidth={2.4} /> : null}
      </View>
      <AppText variant="small" color={colors.ink} style={styles.label}>
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
    padding: 14,
    borderRadius: radii.card,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  rowChecked: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  box: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: { backgroundColor: colors.violet, borderColor: colors.violet },
  label: { flex: 1, fontSize: 13.5, lineHeight: 19.5 },
});
