import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, IconButton } from '@/components/button';
import { FaceGuide, faceCircle } from '@/components/face-guide';
import { Icon } from '@/components/icon';
import { PressableScale, Reveal } from '@/components/motion';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { BackTitle, Pill, Ring } from '@/components/ui';
import { useLocale, useT } from '@/hooks/use-i18n';
import { uiCopy } from '@/lib/ui-copy';
import { deleteTempFile, preparePhoto } from '@/services/photo';
import { useAppStore, type SessionPhoto } from '@/store/app-store';
import { colors, GUTTER, spacing } from '@/theme';

/** The web preview has no live camera UI; selfies come from a file upload instead. */
const UPLOAD_ONLY = Platform.OS === 'web';

export default function CameraScreen() {
  const t = useT();
  const copy = uiCopy(useLocale());
  const { width, height } = useWindowDimensions();
  /** `returnTo=look`: just capture a new photo and go back (used by the makeup try-on). */
  const { returnTo, error: errorParam } = useLocalSearchParams<{ returnTo?: string; error?: string }>();
  const setPhoto = useAppStore((s) => s.setPhoto);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<SessionPhoto | null>(null);
  const [error, setError] = useState<string | null>(errorParam === 'no_face' ? t('errors.no_face') : null);

  const handleImage = async (uri: string, w: number, h: number) => {
    setBusy(true);
    setError(null);
    try {
      setPreview(await preparePhoto(uri, w, h));
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

  /* ---------- "Harika görünüyorsun" confirmation ---------- */
  if (preview) {
    const size = Math.min(width - GUTTER * 2 - 40, 280);
    return (
      <Screen
        header={<BackTitle title={copy.confirmTitle} onBack={() => setPreview(null)} backLabel={copy.otherSelfie} />}
        footer={
          <>
            <Button label={copy.otherSelfie} variant="ghost" onPress={() => setPreview(null)} />
            <Button
              label={returnTo === 'look' ? t('camera.usePhoto') : copy.startAnalysis}
              onPress={usePhoto}
              icon="sparkle"
            />
          </>
        }
      >
        <AppText variant="bodyMuted">{copy.confirmBody}</AppText>
        <Reveal style={styles.confirm}>
          <View style={{ width: size + 36, height: size + 36, alignItems: 'center', justifyContent: 'center' }}>
            <View style={StyleSheet.absoluteFill}>
              <Ring size={size + 36} stroke={5} progress={0.78} />
            </View>
            <View style={[styles.halo, { width: size + 16, height: size + 16, borderRadius: (size + 16) / 2 }]} />
            <Image
              source={{ uri: preview.dataUrl }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              accessible
              accessibilityLabel={copy.greatSelfie}
            />
          </View>
          <Pill tone="violet" icon="check" label={copy.greatSelfie} size="md" style={styles.center} />
        </Reveal>
        <View style={styles.privacy}>
          <Icon name="shield" size={14} color={colors.muted} />
          <AppText variant="small">{t('common.privacyBadge')}</AppText>
        </View>
      </Screen>
    );
  }

  /* ---------- Upload (browser preview) and permission states ---------- */
  if (UPLOAD_ONLY || !permission?.granted) {
    const blocked = !UPLOAD_ONLY && permission && !permission.canAskAgain;
    const size = Math.min(width - GUTTER * 2 - 80, 230);
    return (
      <Screen
        header={
          <BackTitle
            title={UPLOAD_ONLY ? copy.uploadTitle : t('camera.permissionTitle')}
            onBack={() => router.back()}
            backLabel={t('common.back')}
          />
        }
        footer={
          UPLOAD_ONLY ? (
            <Button label={t('camera.upload')} onPress={() => void pick()} loading={busy} icon="upload" />
          ) : (
            <>
              {permission === null ? null : blocked ? (
                <Button label={t('camera.openSettings')} onPress={() => void Linking.openSettings()} />
              ) : (
                <Button label={t('camera.permissionButton')} onPress={() => void requestPermission()} icon="camera" />
              )}
              <Button label={t('camera.upload')} variant="ghost" onPress={() => void pick()} loading={busy} icon="upload" />
            </>
          )
        }
      >
        <AppText variant="bodyMuted">
          {UPLOAD_ONLY ? copy.uploadBody : blocked ? t('camera.permissionDenied') : t('camera.permissionBody')}
        </AppText>
        <PressableScale
          onPress={() => void pick()}
          accessibilityRole="button"
          accessibilityLabel={t('camera.upload')}
          style={[styles.dropzone, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <View style={styles.dropIcon}>
            <Icon name={UPLOAD_ONLY ? 'image' : 'camera'} size={26} color={colors.violet} />
          </View>
          <AppText variant="smallStrong" color={colors.violet}>
            {t('camera.upload')}
          </AppText>
          <AppText variant="caption" align="center" style={styles.dropHint}>
            {t('camera.fileTypes')}
          </AppText>
        </PressableScale>
        {error ? <Notice tone="warning" message={error} /> : null}
        <View style={styles.privacy}>
          <Icon name="shield" size={14} color={colors.muted} />
          <AppText variant="small">{t('common.privacyBadge')}</AppText>
        </View>
      </Screen>
    );
  }

  /* ---------- Live camera ---------- */
  const circle = faceCircle(width, height);
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
        <FaceGuide />
      </View>
      <SafeAreaView style={styles.cameraUi} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <IconButton icon="back" label={t('common.back')} onPress={() => router.back()} tone="glass" size={40} />
          <AppText variant="h2" style={styles.cameraTitle}>
            {t('camera.title')}
          </AppText>
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: circle.cy + circle.r + 22 }} pointerEvents="none">
          <AppText variant="label" align="center">
            {t('camera.frameHint')}
          </AppText>
          <AppText variant="small" align="center">
            {t('camera.hintLight')}
          </AppText>
        </View>
        <View style={styles.flex} />
        <View style={styles.bottom}>
          {error ? <Notice tone="warning" message={error} /> : null}
          <View style={styles.controls}>
            <PressableScale
              onPress={() => void pick()}
              accessibilityRole="button"
              accessibilityLabel={t('camera.upload')}
              style={styles.sideButton}
            >
              <View style={styles.sideIcon}>
                <Icon name="image" size={20} color={colors.violet} />
              </View>
              <AppText variant="caption" color={colors.ink} align="center" numberOfLines={1}>
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
              <View style={styles.shutterInner} />
            </Pressable>
            <View style={styles.sideButton} />
          </View>
          <AppText variant="caption" align="center">
            {t('common.privacyBadge')}
          </AppText>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignSelf: 'center' },
  confirm: { alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  halo: { position: 'absolute', backgroundColor: colors.paper },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dropzone: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: spacing.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.violet,
    backgroundColor: colors.mist,
  },
  dropIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dropHint: { paddingHorizontal: 28 },
  cameraRoot: { flex: 1, backgroundColor: colors.paper },
  cameraUi: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: GUTTER, paddingTop: spacing.sm },
  cameraTitle: { fontSize: 22 },
  bottom: { paddingHorizontal: GUTTER, paddingBottom: spacing.md, gap: spacing.md },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sideButton: { width: 84, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 4 },
  sideIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: colors.violet,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: { opacity: 0.7 },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.violet },
});
