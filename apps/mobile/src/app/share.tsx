import { Redirect, router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import Svg, { Circle, Line } from 'react-native-svg';

import { Button } from '@/components/button';
import { FitWordmark } from '@/components/fit-wordmark';
import { HeatFace } from '@/components/heat-face';
import { Chip, MonoLabel } from '@/components/labels';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar, Wordmark } from '@/components/top-bar';
import { useLocale, useT } from '@/hooks/use-i18n';
import { usePremium } from '@/hooks/use-premium';
import { env } from '@/lib/env';
import { isLookId, lookSummary } from '@/lib/looks';
import { seasonText } from '@/lib/results';
import { uiCopy } from '@/lib/ui-copy';
import { deleteTempFile } from '@/services/photo';
import { useAppStore } from '@/store/app-store';
import { colors, GUTTER, heat, radii, spacing } from '@/theme';

/** view-shot + native share sheet are app-only; the web preview shows the card without the button. */
const CAN_SHARE_IMAGE = Platform.OS !== 'web';

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
  const cardWidth = Math.min(width - GUTTER * 2 - 16, 340);
  const cardHeight = (cardWidth * 16) / 9;
  const s = cardWidth / 360;
  const pad = 22 * s;
  const facePalette = [
    analysis.lip[0] ?? heat[0],
    analysis.lip[1] ?? analysis.lip[0] ?? heat[1],
    analysis.blush[0] ?? heat[2],
    analysis.eyeshadow[0] ?? heat[3],
    heat[4],
  ];

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
      <MonoLabel caps={false} style={styles.center}>
        {t('share.subtitle')}
      </MonoLabel>

      <View style={styles.cardShadow}>
        <View
          ref={cardRef}
          collapsable={false}
          style={[styles.card, { width: cardWidth, height: cardHeight, padding: pad }]}
        >
          {/* construction grid */}
          <Svg width={cardWidth} height={cardHeight} style={StyleSheet.absoluteFill}>
            {[0.25, 0.5, 0.75].map((x) => (
              <Line key={`x${x}`} x1={cardWidth * x} y1={0} x2={cardWidth * x} y2={cardHeight} stroke={colors.line} strokeWidth={0.6} />
            ))}
            {[0.3, 0.62].map((y) => (
              <Line key={`y${y}`} x1={0} y1={cardHeight * y} x2={cardWidth} y2={cardHeight * y} stroke={colors.line} strokeWidth={0.6} />
            ))}
            <Circle cx={cardWidth / 2} cy={cardHeight * 0.47} r={cardWidth * 0.46} stroke={colors.accent} strokeOpacity={0.45} strokeWidth={0.8} fill="none" />
          </Svg>

          <View style={styles.cardTop}>
            <Wordmark color={colors.ink} size={16 * s} />
            <Chip label={t('common.aiGenerated')} tone="ink" caps={false} />
          </View>

          <View style={{ marginTop: 16 * s, gap: 4 * s }}>
            <MonoLabel slash size={10 * s}>
              {t('results.yourSeason')}
            </MonoLabel>
            <FitWordmark lines={season.name.split(' ')} reveal={false} maxSize={96 * s} />
          </View>

          <View style={styles.object}>
            {render ? (
              <View style={[styles.renderWrap, { width: cardWidth * 0.62, height: cardWidth * 0.62 * 1.2, borderRadius: 20 * s }]}>
                <Image source={{ uri: render }} style={styles.render} resizeMode="cover" accessibilityIgnoresInvertColors />
                {isLookId(lookId) ? (
                  <View style={styles.lookName}>
                    <AppText variant="monoSmall" color={colors.onInk}>
                      {lookSummary(lookId, locale).name}
                    </AppText>
                  </View>
                ) : null}
              </View>
            ) : (
              <HeatFace width={cardWidth * 0.52} palette={facePalette} animate={false} />
            )}
          </View>

          <View style={{ gap: 6 * s }}>
            <MonoLabel size={10 * s} color={colors.ink}>
              {t('share.cardPaletteLabel')}
            </MonoLabel>
            <View style={[styles.palette, { height: 30 * s }]}>
              {analysis.bestColors.slice(0, 8).map((hex, i, arr) => (
                <View
                  key={`${hex}-${i}`}
                  style={[
                    styles.paletteSeg,
                    { backgroundColor: hex },
                    i === 0 && { borderTopLeftRadius: 10 * s, borderBottomLeftRadius: 10 * s },
                    i === arr.length - 1 && { borderTopRightRadius: 10 * s, borderBottomRightRadius: 10 * s },
                  ]}
                />
              ))}
            </View>
            <MonoLabel caps={false} size={10 * s} color={colors.inkMuted}>
              {`${t('share.cardHeadline', { season: season.name })} — ${t('share.cardFooter')}`}
            </MonoLabel>
          </View>

          <FitWordmark lines={['TONELLE']} reveal={false} style={{ marginTop: 8 * s }} />
        </View>
      </View>

      {CAN_SHARE_IMAGE ? null : <Notice tone="info" message={uiCopy(locale).shareAppOnly} />}
      {error ? <Notice tone="error" message={error} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  cardShadow: {
    alignSelf: 'center',
    borderRadius: radii.card,
    shadowColor: '#231816',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
    marginVertical: spacing.sm,
  },
  card: { borderRadius: radii.card, overflow: 'hidden', backgroundColor: colors.paper },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  object: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  renderWrap: { overflow: 'hidden', backgroundColor: colors.paperSunken },
  render: { width: '100%', height: '100%' },
  lookName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(35,24,22,0.7)',
  },
  palette: { flexDirection: 'row', gap: 2 },
  paletteSeg: { flex: 1, borderRadius: 2 },
});
