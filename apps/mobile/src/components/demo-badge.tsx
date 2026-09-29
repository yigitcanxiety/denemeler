import { StyleSheet, View } from 'react-native';

import { useLocale } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { colors, GUTTER } from '@/theme';

import { AppText } from './text';

/** Strip above every screen of the offline web preview, so nobody mistakes mock results for real ones. */
export function DemoBadge() {
  const copy = uiCopy(useLocale());
  return (
    <View style={styles.strip} accessibilityRole="alert" accessibilityLabel={`${copy.demoBadge}. ${copy.demoDetail}`}>
      <View style={styles.tag}>
        <AppText variant="monoLabel" color={colors.accentContrast} style={styles.tagText}>
          {copy.demoBadge}
        </AppText>
      </View>
      <AppText variant="monoSmall" color={colors.onInkMuted} numberOfLines={1} style={styles.detail}>
        {copy.demoDetail}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: GUTTER + 4,
    paddingVertical: 5,
    backgroundColor: colors.night,
  },
  tag: { backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  tagText: { fontSize: 10, lineHeight: 14 },
  detail: { flex: 1, fontSize: 10.5 },
});
