import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, IconButton } from '@/components/button';
import { FaceGuide } from '@/components/face-guide';
import { Icon } from '@/components/icon';
import { Chip, MonoLabel } from '@/components/labels';
import { PressableScale } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { Card, CardStack } from '@/components/stack';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useT } from '@/hooks/use-i18n';
import { deleteTempFile, preparePhoto } from '@/services/photo';
import { useAppStore, type SessionPhoto } from '@/store/app-store';
import { colors, GUTTER, radii, spacing } from '@/theme';

const HINTS = [
  'camera.hintLight',
  'camera.hintNoFilter',
  'camera.hintNoMakeup',
  'camera.hintGlasses',
  'camera.hintStraight',
] as const;

export default function CameraScreen() {
  const t = useT();
  /** `returnTo=look`: just capture a new photo and go back (used by look detail). */
  const { returnTo, error: errorParam } = useLocalSearchParams<{ returnTo?: string; error?: string }>();
  const setPhoto = useAppStore((s) => s.setPhoto);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<SessionPhoto | null>(null);
  const [error, setError] = useState<string | null>(errorParam === 'no_face' ? t('errors.no_face') : null);

  const handleImage = async (uri: string, width: number, height: number) => {
    setBusy(true);
    setError(null);
    try {
      setPreview(await preparePhoto(uri, width, height));
    } catch {
      deleteTempFile(uri);
      setError(t('errors.unsupportedFile'));
    } finally {
      setBusy(false);
    }
  };

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.9, exif: false });
      if (!shot) throw new Error('No picture');
      await handleImage(shot.uri, shot.width, shot.height);
    } catch {
      setError(t('errors.cameraUnavailable'));
      setBusy(false);
    }
  };

  const pick = async () => {
    setError(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
      exif: false,
    });
    const asset = result.canceled ? null : result.assets[0];
    if (!asset) return;
    if (asset.mimeType && !/^image\/(jpeg|jpg|png|webp|heic|heif)$/i.test(asset.mimeType)) {
      setError(t('errors.unsupportedFile'));
      return;
    }
    await handleImage(asset.uri, asset.width, asset.height);
  };

  const usePhoto = () => {
    if (!preview) return;
    setPhoto(preview);
    if (returnTo === 'look') router.back();
    else router.replace('/analyzing');
  };

  /* ---------- Preview of the captured / picked photo ---------- */
  if (preview) {
    return (
      <Screen
        scroll={false}
        footer={
          <>
            <Button label={t('camera.usePhoto')} onPress={usePhoto} icon="arrow" />
            <Button label={t('camera.retake')} variant="secondary" onPress={() => setPreview(null)} />
          </>
        }
      >
        <TopBar onBack={() => setPreview(null)} backLabel={t('camera.retake')} chip={t('common.privacyBadge')} />
        <View style={styles.previewWrap}>
          <Image
            source={{ uri: preview.dataUrl }}
            style={styles.previewImage}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            accessible
            accessibilityLabel={t('camera.title')}
          />
          <View style={[StyleSheet.absoluteFill, styles.centerAll]} pointerEvents="none">
            <FaceGuide width={180} height={236} tone="light" />
          </View>
        </View>
      </Screen>
    );
  }

  /* ---------- Permission states ---------- */
  if (!permission?.granted) {
    const blocked = permission && !permission.canAskAgain;
    return (
      <Screen
        footer={
          <>
            {permission === null ? null : blocked ? (
              <Button label={t('camera.openSettings')} onPress={() => void Linking.openSettings()} />
            ) : (
              <Button label={t('camera.permissionButton')} onPress={() => void requestPermission()} />
            )}
            <Button label={t('camera.upload')} variant="secondary" onPress={() => void pick()} loading={busy} icon="upload" />
          </>
        }
      >
        <CardStack>
          <TopBar onBack={() => router.back()} backLabel={t('common.back')} title={t('camera.title')} />
          <Card style={styles.permission}>
            <AppText variant="title" color={colors.onInk} accessibilityRole="header">
              {t('camera.permissionTitle')}
            </AppText>
            <AppText variant="body" color={colors.onInkMuted}>
              {blocked ? t('camera.permissionDenied') : t('camera.permissionBody')}
            </AppText>
            <MonoLabel color={colors.onInkSubtle} caps={false}>
              {t('camera.fileTypes')}
            </MonoLabel>
          </Card>
        </CardStack>
        <View style={styles.permissionArt}>
          <FaceGuide width={150} height={198} />
        </View>
        {error ? <Notice tone="error" message={error} /> : null}
      </Screen>
    );
  }

  /* ---------- Live camera ---------- */
  return (
    <View style={styles.cameraRoot}>
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
        mirror
        animateShutter={false}
        onCameraReady={() => setCameraReady(true)}
        onMountError={() => setError(t('errors.cameraUnavailable'))}
        accessibilityLabel={t('camera.frameHint')}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FaceGuide overlay />
      </View>
      <SafeAreaView style={styles.cameraUi} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <IconButton icon="close" label={t('common.close')} onPress={() => router.back()} tone="glass" size={44} />
          <Chip label={t('camera.title')} tone="soft" />
        </View>
        <View style={styles.topHints}>
          <AppText variant="label" color={colors.onInk} align="center">
            {t('camera.frameHint')}
          </AppText>
          <MonoLabel color={colors.onInkMuted} caps={false} style={styles.center}>
            {t('camera.hintLight')}
          </MonoLabel>
        </View>
        <View style={styles.flex} />
        <View style={styles.bottom}>
          <View style={styles.hintList}>
            {HINTS.slice(1).map((key) => (
              <View key={key} style={styles.hintPill}>
                <AppText variant="monoSmall" color={colors.onInk}>
                  {t(key)}
                </AppText>
              </View>
            ))}
          </View>
          {error ? <Notice tone="error" message={error} /> : null}
          <View style={styles.controls}>
            <PressableScale
              onPress={() => void pick()}
              accessibilityRole="button"
              accessibilityLabel={t('camera.upload')}
              style={styles.sideButton}
              hitSlop={8}
            >
              <View style={styles.sideIcon}>
                <Icon name="upload" size={20} color={colors.onInk} />
              </View>
              <AppText variant="monoSmall" color={colors.onInk} align="center" numberOfLines={2}>
                {t('camera.upload')}
              </AppText>
            </PressableScale>
            <Pressable
              onPress={() => void capture()}
              disabled={!cameraReady || busy}
              accessibilityRole="button"
              accessibilityLabel={t('camera.capture')}
              accessibilityState={{ disabled: !cameraReady || busy, busy }}
              style={({ pressed }) => [styles.shutter, (pressed || busy) && styles.shutterPressed]}
            >
              <View style={styles.shutterInner}>
                <View style={styles.shutterDot} />
              </View>
            </Pressable>
            <View style={styles.sideButton} />
          </View>
          {Platform.OS === 'android' ? null : (
            <MonoLabel color={colors.onInkMuted} caps={false} style={styles.center}>
              {t('common.privacyBadge')}
            </MonoLabel>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  centerAll: { alignItems: 'center', justifyContent: 'center' },
  cameraRoot: { flex: 1, backgroundColor: colors.night },
  cameraUi: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER + 4,
    paddingTop: spacing.xs,
  },
  topHints: { alignItems: 'center', gap: 4, paddingHorizontal: spacing.xl, marginTop: spacing.md },
  bottom: { paddingHorizontal: GUTTER + 4, paddingBottom: spacing.lg, gap: spacing.md },
  hintList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  hintPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(22,16,16,0.6)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(239,233,227,0.2)',
  },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sideButton: { width: 84, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 4 },
  sideIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(22,16,16,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.onInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: { opacity: 0.6 },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.onInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  previewWrap: {
    flex: 1,
    marginTop: spacing.sm,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  previewImage: { width: '100%', height: '100%' },
  permission: { gap: spacing.md },
  permissionArt: { alignItems: 'center', paddingVertical: spacing.lg },
});
