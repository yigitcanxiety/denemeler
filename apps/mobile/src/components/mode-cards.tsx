import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useLocale } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { useStartAnalysis } from '@/hooks/use-start-analysis';
import { resolveRecommendedLooks } from '@/lib/looks';
import { uiCopy } from '@/lib/ui-copy';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, radii } from '@/theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './motion';
import { AppText } from './text';

/** The two things the app does, as big buttons: colour analysis and makeup try-on (home + scan sheet). */
export function ModeCards({ onPick }: { onPick?: () => void }) {
  const copy = uiCopy(useLocale());
  const premium = usePremium();
  const startAnalysis = useStartAnalysis();
  const analysis = useAppStore((s) => s.analysis);
  const serverLookIds = useAppStore((s) => s.recommendedLookIds);

  const openMakeup = () => {
    const [first] = analysis ? resolveRecommendedLooks(analysis, serverLookIds) : [];
    // Without Premium no render is made: the blurred build-up screen sells the weekly plan.
    if (!premium) return router.push({ pathname: '/makeup-lock', params: first ? { id: first } : {} });
    if (!analysis) return startAnalysis();
    router.push({ pathname: '/look/[id]', params: { id: first ?? 'natural_glow' } });
  };
  const pick = (open: () => void) => () => {
    onPick?.();
    open();
  };

  return (
    <View style={styles.modes}>
      <ModeCard
        tone="violet"
        icon="palette"
        title={copy.featureColorTitle}
        body={copy.featureColorBody}
        onPress={pick(startAnalysis)}
      />
      <ModeCard
        tone="rose"
        icon="brush"
        title={copy.featureMakeupTitle}
        body={copy.featureMakeupBody}
        onPress={pick(openMakeup)}
      />
    </View>
  );
}

const MODE_TONES = {
  violet: { bg: colors.violetSoft, fg: colors.violet },
  rose: { bg: colors.roseSoft, fg: colors.roseInk },
} as const;

function ModeCard({
  tone,
  icon,
  title,
  body,
  onPress,
}: {
  tone: keyof typeof MODE_TONES;
  icon: IconName;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const { bg, fg } = MODE_TONES[tone];
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      style={[styles.mode, { backgroundColor: bg }]}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={28} color={fg} />
      </View>
      <View style={styles.flex}>
        <AppText style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="small" color={colors.ink} style={styles.body} numberOfLines={2}>
          {body}
        </AppText>
      </View>
      <Icon name="chevronRight" size={20} color={fg} strokeWidth={2} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  modes: { gap: 12 },
  flex: { flex: 1 },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 88, borderRadius: radii.card, paddingVertical: 14, paddingHorizontal: 16 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 25, color: colors.ink },
  body: { fontSize: 13.5, lineHeight: 19 },
});
