import type { BottomTabBarProps } from 'expo-router/tabs';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useLocale, useT } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { colors, fonts, shadows } from '@/theme';

import { BottomSheet } from './bottom-sheet';
import { Icon, type IconName } from './icon';
import { ModeCards } from './mode-cards';
import { PressableScale } from './motion';
import { AppText } from './text';

const TABS: Record<string, { icon: IconName; label: 'tabToday' | 'tabResults' | 'tabProfile' }> = {
  index: { icon: 'sun', label: 'tabToday' },
  results: { icon: 'grid', label: 'tabResults' },
  profile: { icon: 'user', label: 'tabProfile' },
};

/**
 * Bugün · Sonuçlar · (centre scan button) · Profil. The scan button sits at the exact centre and
 * asks which mode to start (colour analysis or makeup try-on); Profil is centred in the right half.
 */
export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const copy = uiCopy(useLocale());
  const t = useT();
  const [picking, setPicking] = useState(false);

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
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
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
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 10), paddingLeft: insets.left, paddingRight: insets.right },
      ]}
    >
      <View style={styles.half}>
        {item(0)}
        {item(1)}
      </View>
      <View style={styles.center}>
        <PressableScale
          onPress={() => setPicking(true)}
          accessibilityRole="button"
          accessibilityLabel={copy.tabScan}
          pressedScale={0.94}
          style={styles.scan}
        >
          <Icon name="scan" size={24} color={colors.onViolet} strokeWidth={2} />
        </PressableScale>
      </View>
      <View style={styles.half}>{item(2)}</View>
      <BottomSheet visible={picking} onDismiss={() => setPicking(false)} dismissLabel={t('common.close')}>
        <AppText variant="h2">{copy.pickMode}</AppText>
        <ModeCards onPick={() => setPicking(false)} />
      </BottomSheet>
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
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
    shadowOpacity: 0.35,
  },
});
