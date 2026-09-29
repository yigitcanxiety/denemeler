import { Redirect, router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Button } from '@/components/button';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Badge } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { env } from '@/lib/env';
import { isLookId, lookSummary } from '@/lib/looks';
import { seasonText } from '@/lib/results';
import { deleteTempFile } from '@/services/photo';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, palette, radii, spacing } from '@/theme';

export default function ShareScreen() {
  const t = useT();
  const locale = useLocale();
  const premium = usePremium();
  const { lookId } = useLocalSearchParams<{ lookId?: string }>();
  const analysis = useAppStore((s) => s.analysis);
  const render = useAppStore((s) => (isLookId(lookId) ? s.renders[lookId] : undefined));
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  if (!analysis || !premium) return <Redirect href="/" />;

  const season = seasonText(analysis, locale);
  const siteHost = env.siteUrl.replace(/^https?:\/\//, '');
  // Story format 9:16, sized to fit the screen; captured at 1080×1920.
  const cardWidth = Math.min(width - spacing.xl * 2, 340);
  const cardHeight = (cardWidth * 16) / 9;
  const scale = cardWidth / 360;

  const share = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    setError(null);
    let uri: string | null = null;
    try {
      uri = await captureRef(cardRef, { format: 'png', quality: 1, width: 1080, height: 1920, result: 'tmpfile' });
      if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing unavailable');
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        UTI: 'public.png',
        dialogTitle: t('share.caption', { season: season.name, url: siteHost }),
      });
    } catch {
      setError(t('errors.generic'));
    } finally {
      deleteTempFile(uri);
      setBusy(false);
    }
  };

  return (
    <Screen
      header={<TopBar onClose={() => router.back()} closeLabel={t('common.close')} title={t('share.title')} />}
      footer={<Button label={busy ? t('share.generating') : t('share.shareButton')} onPress={() => void share()} loading={busy} />}
    >
      <AppText variant="bodyMuted" align="center">
        {t('share.subtitle')}
      </AppText>

      <View style={styles.cardShadow}>
        <View ref={cardRef} collapsable={false} style={{ width: cardWidth, height: cardHeight }}>
          <LinearGradient
            colors={[palette.blush[100], palette.nude[100], palette.nude[200]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={[styles.card, { padding: 28 * scale, gap: 14 * scale }]}
          >
            <AppText variant="overline" style={{ fontSize: 12 * scale }}>
              {t('common.appName')}
            </AppText>
            <AppText
              style={[styles.headline, { fontSize: 34 * scale, lineHeight: 40 * scale }]}
              accessibilityRole="header"
            >
              {t('share.cardHeadline', { season: season.name })}
            </AppText>

            {render ? (
              <View style={[styles.renderWrap, { borderRadius: 20 * scale }]}>
                <Image source={{ uri: render }} style={styles.render} resizeMode="cover" accessibilityIgnoresInvertColors />
                <View style={styles.renderBadge}>
                  <Badge label={t('common.aiGenerated')} tone="ink" />
                </View>
                {isLookId(lookId) ? (
                  <View style={styles.lookName}>
                    <AppText variant="caption" color={colors.inkInverse}>
                      {lookSummary(lookId, locale).name}
                    </AppText>
                  </View>
                ) : null}
              </View>
            ) : (
              <AppText variant="bodyMuted" style={{ fontSize: 15 * scale, lineHeight: 22 * scale }} numberOfLines={6}>
                {season.description}
              </AppText>
            )}

            <View style={styles.flex} />
            <AppText variant="label" style={{ fontSize: 14 * scale }}>
              {t('share.cardPaletteLabel')}
            </AppText>
            <View style={[styles.palette, { gap: 8 * scale }]}>
              {analysis.bestColors.slice(0, 8).map((hex, i) => (
                <View
                  key={`${hex}-${i}`}
                  style={{ width: 30 * scale, height: 30 * scale, borderRadius: 15 * scale, backgroundColor: hex }}
                />
              ))}
            </View>
            <AppText variant="caption" color={colors.inkMuted} style={{ fontSize: 12 * scale }}>
              {t('share.cardFooter')}
            </AppText>
          </LinearGradient>
        </View>
      </View>

      {error ? <Notice tone="error" message={error} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cardShadow: {
    alignSelf: 'center',
    borderRadius: radii.card,
    shadowColor: '#5c3a32',
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  card: { flex: 1, borderRadius: radii.card, overflow: 'hidden' },
  headline: { fontFamily: fonts.display, color: colors.ink },
  renderWrap: { flex: 3, overflow: 'hidden', backgroundColor: colors.surfaceSunken },
  render: { width: '100%', height: '100%' },
  renderBadge: { position: 'absolute', top: 10, left: 10 },
  lookName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(43,33,36,0.6)',
  },
  palette: { flexDirection: 'row', flexWrap: 'wrap' },
});
