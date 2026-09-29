import type { BottomTabBarProps } from 'expo-router/tabs';
import { StyleSheet, View } from 'react-native';

import { useLocale } from '@/hooks/use-i18n';
import { useStartAnalysis } from '@/hooks/use-start-analysis';
import { uiCopy } from '@/lib/ui-copy';
import { colors, fonts, shadows } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './motion';
import { AppText } from './text';

const TABS: Record<string, { icon: IconName; label: 'tabToday' | 'tabResults' | 'tabProfile' }> = {
  index: { icon: 'sun', label: 'tabToday' },
  results: { icon: 'grid', label: 'tabResults' },
  profile: { icon: 'user', label: 'tabProfile' },
};

/**
 * Bugün · Sonuçlar · (centre scan button) · Profil. The scan button sits at the exact centre and
 * starts a new analysis; Profil is centred in the right half.
 */
export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  const copy = uiCopy(useLocale());
  const startAnalysis = useStartAnalysis();

  const item = (routeIndex: number) => {
    const route = state.routes[routeIndex];
    const meta = route ? TABS[route.name] : undefined;
    if (!route || !meta) return null;
    const focused = state.index === routeIndex;
    const label = copy[meta.label];
    return (
      <PressableScale
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={label}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        }}
        style={styles.item}
      >
        <Icon name={meta.icon} size={21} color={focused ? colors.ink : colors.muted} strokeWidth={focused ? 2 : 1.75} />
        <AppText style={[styles.label, focused && styles.labelOn]} numberOfLines={1}>
          {label}
        </AppText>
      </PressableScale>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.half}>
        {item(0)}
        {item(1)}
      </View>
      <View style={styles.center}>
        <PressableScale
          onPress={startAnalysis}
          accessibilityRole="button"
          accessibilityLabel={copy.tabScan}
          pressedScale={0.94}
          style={styles.scan}
        >
          <Icon name="scan" size={24} color={colors.violet} strokeWidth={2} />
        </PressableScale>
      </View>
      <View style={styles.half}>{item(2)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  half: { flex: 1, flexDirection: 'row' },
  center: { width: 76, alignItems: 'center', justifyContent: 'flex-end' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3, minHeight: 44 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.muted },
  labelOn: { fontFamily: fonts.semibold, color: colors.ink },
  scan: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -30,
    marginBottom: 2,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.violetSoft,
    ...shadows.button,
    shadowOpacity: 0.35,
  },
});
