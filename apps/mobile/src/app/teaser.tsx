import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/button';
import { LockedResult } from '@/components/locked-result';
import { Screen } from '@/components/screen';
import { WeeklyUnlock } from '@/components/weekly-unlock';
import { useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useAppStore } from '@/store/app-store';

/** Locked result (DESIGN.md §3.5): the result exists but stays blurred until unlocked. */
export default function TeaserScreen() {
  const t = useT();
  const premium = usePremium();
  const analysis = useAppStore((s) => s.analysis);

  if (!analysis) return <Redirect href="/" />;
  if (premium) return <Redirect href="/results" />;

  return (
    <Screen
      header={
        <View style={styles.top}>
          <IconButton icon="close" label={t('common.close')} size={32} onPress={() => router.dismissTo('/')} />
        </View>
      }
      footer={<WeeklyUnlock />}
    >
      <LockedResult analysis={analysis} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
});
