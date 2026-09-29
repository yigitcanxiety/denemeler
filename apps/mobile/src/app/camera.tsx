import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { FaceGuide } from '@/components/face-guide';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useT } from '@/hooks/use-i18n';
import { deleteTempFile, preparePhoto } from '@/services/photo';
import { useAppStore, type SessionPhoto } from '@/store/app-store';
import { colors, radii, spacing } from '@/theme';

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
        header={<TopBar onBack={() => setPreview(null)} backLabel={t('camera.retake')} />}
        footer={
          <>
            <Button label={t('camera.usePhoto')} onPress={usePhoto} />
            <Button label={t('camera.retake')} variant="secondary" onPress={() => setPreview(null)} />
          </>
        }
        scroll={false}
      >
        <View style={styles.previewWrap}>
          <Image
            source={{ uri: preview.dataUrl }}
            style={styles.previewImage}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            accessible
            accessibilityLabel={t('camera.title')}
          />
        </View>
        <AppText variant="caption" align="center">
          {t('common.privacyBadge')}
        </AppText>
      </Screen>
    );
  }

  /* ---------- Permission states ---------- */
  if (!permission?.granted) {
    const blocked = permission && !permission.canAskAgain;
    return (
      <Screen
        header={<TopBar onBack={() => router.back()} backLabel={t('common.back')} />}
        footer={
          <>
            {permission === null ? null : blocked ? (
              <Button label={t('camera.openSettings')} onPress={() => void Linking.openSettings()} />
            ) : (
              <Button label={t('camera.permissionButton')} onPress={() => void requestPermission()} />
            )}
            <Button label={t('camera.upload')} variant="secondary" onPress={() => void pick()} loading={busy} />
          </>
        }
      >
        <View style={styles.permissionArt}>
          <FaceGuide width={160} height={210} />
        </View>
        <AppText variant="title" accessibilityRole="header">
          {t('camera.permissionTitle')}
        </AppText>
        <AppText variant="bodyMuted">{blocked ? t('camera.permissionDenied') : t('camera.permissionBody')}</AppText>
        <AppText variant="caption">{t('camera.fileTypes')}</AppText>
        {error ? <Notice tone="error" message={error} /> : null}
      </Screen>
    );
  }

  /* ---------- Live camera ---------- */
  return (
    <View style={styles.cameraRoot}>
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
        <TopBar onClose={() => router.back()} closeLabel={t('common.close')} />
        <View style={styles.topHints}>
          <AppText variant="label" color={colors.inkInverse} align="center">
            {t('camera.frameHint')}
          </AppText>
          <AppText variant="caption" color={colors.inkInverse} align="center">
            {t('camera.hintLight')}
          </AppText>
        </View>
        <View style={styles.flex} />
        <View style={styles.bottom}>
          <View style={styles.hintList}>
            {HINTS.slice(1).map((key) => (
              <View key={key} style={styles.hintPill}>
                <AppText variant="caption" color={colors.inkInverse}>
                  {t(key)}
                </AppText>
              </View>
            ))}
          </View>
          {error ? <Notice tone="error" message={error} /> : null}
          <View style={styles.controls}>
            <Pressable
              onPress={() => void pick()}
              accessibilityRole="button"
              accessibilityLabel={t('camera.upload')}
              style={styles.sideButton}
              hitSlop={8}
            >
              <AppText variant="caption" color={colors.inkInverse} align="center">
                {t('camera.upload')}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => void capture()}
              disabled={!cameraReady || busy}
              accessibilityRole="button"
              accessibilityLabel={t('camera.capture')}
              accessibilityState={{ disabled: !cameraReady || busy, busy }}
              style={({ pressed }) => [styles.shutter, (pressed || busy) && styles.shutterPressed]}
            >
              <View style={styles.shutterInner} />
            </Pressable>
            <View style={styles.sideButton} />
          </View>
          {Platform.OS === 'android' ? null : (
            <AppText variant="caption" color={colors.inkInverse} align="center">
              {t('common.privacyBadge')}
            </AppText>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cameraRoot: { flex: 1, backgroundColor: '#000' },
  cameraUi: { flex: 1 },
  topHints: { alignItems: 'center', gap: 4, paddingHorizontal: spacing.xl },
  bottom: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.md },
  hintList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center' },
  hintPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(43,33,36,0.55)',
  },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sideButton: { width: 84, minHeight: 44, justifyContent: 'center' },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: colors.inkInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: { opacity: 0.6 },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.accent },
  previewWrap: {
    flex: 1,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSunken,
  },
  previewImage: { width: '100%', height: '100%' },
  permissionArt: { alignItems: 'center', paddingVertical: spacing.xl },
});
