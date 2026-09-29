import { Fragment } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useLocale, useT } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { openLegal } from '@/services/legal';
import { colors } from '@/theme';

import { AppText } from './text';

/** "Gizlilik · Geri yükle · Kullanım şartları" fine-print links. */
export function LegalLinks({ onRestore, restoring }: { onRestore?: () => void; restoring?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const items = [
    { key: 'privacy', label: t('legal.privacy'), role: 'link' as const, onPress: () => void openLegal(locale, 'privacy') },
    ...(onRestore
      ? [
          {
            key: 'restore',
            label: restoring ? t('paywall.restoring') : uiCopy(locale).restoreShort,
            role: 'button' as const,
            onPress: onRestore,
          },
        ]
      : []),
    { key: 'terms', label: t('legal.terms'), role: 'link' as const, onPress: () => void openLegal(locale, 'terms') },
  ];
  return (
    <View style={styles.row}>
      {items.map((item, i) => (
        <Fragment key={item.key}>
          {i > 0 ? <AppText variant="caption">·</AppText> : null}
          <Pressable onPress={item.onPress} accessibilityRole={item.role} hitSlop={10} disabled={restoring && item.key === 'restore'}>
            <AppText variant="caption" color={colors.muted} style={styles.link}>
              {item.label}
            </AppText>
          </Pressable>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  link: { textDecorationLine: 'underline' },
});
