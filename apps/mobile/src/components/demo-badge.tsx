import { StyleSheet, View } from 'react-native';

import { useLocale } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { colors, fonts, GUTTER } from '@/theme';

import { AppText } from './text';

/** Strip above every screen of the offline web preview, so nobody mistakes mock results for real ones. */
export function DemoBadge() {
  const copy = uiCopy(useLocale());
  return (
    <View style={styles.strip} accessibilityRole="alert" accessibilityLabel={`${copy.demoBadge}. ${copy.demoDetail}`}>
      <View style={styles.tag}>
        <AppText style={styles.tagText}>{copy.demoBadge}</AppText>
      </View>
      <AppText variant="caption" color={colors.paper} numberOfLines={1} style={styles.detail}>
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
    paddingHorizontal: GUTTER,
    paddingVertical: 5,
    backgroundColor: colors.ink,
  },
  tag: { backgroundColor: colors.violet, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 1 },
  tagText: { fontFamily: fonts.bold, fontSize: 9.5, lineHeight: 13, letterSpacing: 0.6, color: colors.onViolet },
  detail: { flex: 1, fontSize: 10.5, opacity: 0.8 },
});
