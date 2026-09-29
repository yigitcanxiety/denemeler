import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Button, IconButton } from '@/components/button';
import { Icon } from '@/components/icon';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { env } from '@/lib/env';
import { isLookId, lookSummary } from '@/lib/looks';
import { seasonText } from '@/lib/results';
import { uiCopy, upper } from '@/lib/ui-copy';
import { deleteTempFile } from '@/services/photo';
import { useAppStore } from '@/store/app-store';
import { colors, fonts, GUTTER, spacing } from '@/theme';

/** view-shot + native share sheet are app-only; the web preview shows the card without the button. */
const CAN_SHARE_IMAGE = Platform.OS !== 'web';

/** Story share card, captured at 1080×1920 (DESIGN.md §3). */
export default function ShareScreen() {
  const t = useT();
  const locale = useLocale();
  const copy = uiCopy(locale);
  const premium = usePremium();
  const { lookId } = useLocalSearchParams<{ lookId?: string }>();
  const analysis = useAppStore((s) => s.analysis);
  const photo = useAppStore((s) => s.photo);
  const render = useAppStore((s) => (isLookId(lookId) ? s.renders[lookId] : undefined));
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();

  if (!analysis || !premium) return <Redirect href="/" />;

  const season = seasonText(analysis, locale);
  const siteHost = env.siteUrl.replace(/^https?:\/\//, '');
  const portrait = render ?? photo?.dataUrl ?? null;
  // 9:16, sized to fit the screen; captured at 1080×1920.
  const cardWidth = Math.min(width - GUTTER * 2 - 24, (height - 250) * (9 / 16), 360);
  const cardHeight = (cardWidth * 16) / 9;
  const s = cardWidth / 360;

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
      header={
        <View style={styles.top}>
          <AppText variant="h2" accessibilityRole="header">
            {t('share.title')}
          </AppText>
          <IconButton icon="close" label={t('common.close')} onPress={() => router.back()} />
        </View>
      }
      footer={
        CAN_SHARE_IMAGE ? (
          <Button
            label={busy ? t('share.generating') : t('share.shareButton')}
            onPress={() => void share()}
            loading={busy}
            icon="share"
          />
        ) : null
      }
    >
      <AppText variant="bodyMuted" align="center">
        {t('share.subtitle')}
      </AppText>

      <View style={styles.cardShadow}>
        <View ref={cardRef} collapsable={false} style={[styles.card, { width: cardWidth, height: cardHeight, borderRadius: 26 * s }]}>
          <LinearGradient colors={['#FFFFFF', colors.board]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={[styles.inner, { padding: 24 * s, gap: 14 * s }]}>
            <View style={styles.cardTop}>
              <AppText style={{ fontFamily: fonts.display, fontSize: 24 * s, color: colors.ink }}>Tonelle</AppText>
              <View style={[styles.aiPill, { paddingHorizontal: 9 * s, paddingVertical: 4 * s }]}>
                <Icon name="sparkle" size={10 * s} color={colors.violet} />
                <AppText style={{ fontFamily: fonts.semibold, fontSize: 10 * s, color: colors.violet }}>
                  {t('common.aiGenerated')}
                </AppText>
              </View>
            </View>

            <View style={{ gap: 4 * s }}>
              <AppText style={{ fontFamily: fonts.semibold, fontSize: 10.5 * s, letterSpacing: 0.8 * s, color: colors.violet }}>
                {upper(copy.shareEyebrow, locale)}
              </AppText>
              <AppText style={{ fontFamily: fonts.display, fontSize: 44 * s, lineHeight: 48 * s, color: colors.ink }}>
                {season.name}
              </AppText>
            </View>

            <View style={styles.flex}>
              {portrait ? (
                <View style={[styles.portrait, { borderRadius: 22 * s, borderWidth: 5 * s }]}>
                  <Image source={{ uri: portrait }} style={styles.fill} resizeMode="cover" accessibilityIgnoresInvertColors />
                  {isLookId(lookId) && render ? (
                    <View style={[styles.lookTag, { left: 10 * s, bottom: 10 * s, paddingHorizontal: 10 * s, paddingVertical: 4 * s }]}>
                      <AppText style={{ fontFamily: fonts.semibold, fontSize: 10.5 * s, color: colors.ink }}>
                        {lookSummary(lookId, locale).name}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              ) : (
                <View style={[styles.dots, { gap: 10 * s }]}>
                  {season.palette.slice(0, 6).map((hex, i) => (
                    <View key={`${hex}-${i}`} style={{ width: 70 * s, height: 70 * s, borderRadius: 35 * s, backgroundColor: hex }} />
                  ))}
                </View>
              )}
            </View>

            <View style={{ gap: 8 * s }}>
              <AppText style={{ fontFamily: fonts.semibold, fontSize: 11 * s, color: colors.muted }}>
                {t('share.cardPaletteLabel')}
              </AppText>
              <View style={[styles.palette, { gap: 5 * s }]}>
                {analysis.bestColors.slice(0, 7).map((hex, i) => (
                  <View key={`${hex}-${i}`} style={[styles.flex, { height: 30 * s, borderRadius: 9 * s, backgroundColor: hex }]} />
                ))}
              </View>
              <AppText style={{ fontFamily: fonts.medium, fontSize: 10.5 * s, color: colors.muted }}>
                {t('share.cardFooter')}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {CAN_SHARE_IMAGE ? null : <Notice message={copy.shareAppOnly} />}
      {error ? <Notice tone="error" message={error} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fill: { width: '100%', height: '100%' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardShadow: {
    alignSelf: 'center',
    borderRadius: 26,
    shadowColor: '#2A1C6E',
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
    marginVertical: spacing.sm,
  },
  card: { overflow: 'hidden', backgroundColor: colors.paper },
  inner: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 999, backgroundColor: colors.violetSoft },
  portrait: { flex: 1, overflow: 'hidden', borderColor: colors.paper, backgroundColor: colors.mist },
  lookTag: { position: 'absolute', borderRadius: 999, backgroundColor: colors.floatBg },
  dots: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' },
  palette: { flexDirection: 'row' },
});
