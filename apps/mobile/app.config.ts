import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Tonelle mobile app config.
 *
 * Permission copy: English is the base string; Turkish is provided through `locales`
 * (compiled into tr.lproj/InfoPlist.strings by expo prebuild).
 *
 * Privacy manifest: the entries below cover the "required reason" APIs used by React Native,
 * AsyncStorage and Expo modules. Expo/RevenueCat SDKs ship their own PrivacyInfo.xcprivacy that
 * Xcode merges. Before submission, re-check App Store Connect's privacy "nutrition label":
 * photos are processed transiently (not collected/stored), purchases are handled by RevenueCat,
 * and there is no tracking (NSPrivacyTracking = false).
 *
 * Assets under assets/images/placeholder-* are generated placeholders
 * (scripts/generate-placeholder-assets.mjs) — replace with final brand artwork.
 */

const CAMERA_EN =
  'Tonelle uses your camera to take a selfie for your colour and makeup analysis. The photo is not stored.';
const PHOTOS_EN =
  'Tonelle lets you choose a selfie from your library for your colour and makeup analysis. The photo is not stored.';
const CAMERA_TR =
  'Tonelle, renk ve makyaj analizin için selfie çekmek amacıyla kamerana erişir. Fotoğrafın saklanmaz.';
const PHOTOS_TR =
  'Tonelle, renk ve makyaj analizin için galerinden bir selfie seçmene olanak tanır. Fotoğrafın saklanmaz.';

const NUDE_50 = '#FDF9F6';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tonelle',
  slug: 'tonelle',
  scheme: 'tonelle',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/images/placeholder-icon.png',
  backgroundColor: NUDE_50,
  ios: {
    bundleIdentifier: 'app.tonelle',
    supportsTablet: false,
    config: { usesNonExemptEncryption: false },
    infoPlist: {
      NSCameraUsageDescription: CAMERA_EN,
      NSPhotoLibraryUsageDescription: PHOTOS_EN,
      ITSAppUsesNonExemptEncryption: false,
      CFBundleAllowMixedLocalizations: true,
    },
    privacyManifests: {
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [],
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
          NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
          NSPrivacyAccessedAPITypeReasons: ['E174.1'],
        },
      ],
    },
  },
  android: {
    package: 'app.tonelle',
    adaptiveIcon: {
      foregroundImage: './assets/images/placeholder-adaptive-icon.png',
      monochromeImage: './assets/images/placeholder-monochrome-icon.png',
      backgroundColor: '#F9F0EA',
    },
    // CAMERA is the only runtime permission. (INTERNET and Play BILLING are normal/install-time
    // permissions added by React Native and react-native-purchases.)
    permissions: ['android.permission.CAMERA'],
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
    predictiveBackGestureEnabled: false,
  },
  web: {
    // Browser preview (scripts/export-web-preview.mjs): single-page app, no server rendering.
    output: 'single',
    favicon: './assets/images/placeholder-favicon.png',
  },
  locales: {
    en: {
      ios: { NSCameraUsageDescription: CAMERA_EN, NSPhotoLibraryUsageDescription: PHOTOS_EN },
    },
    tr: {
      ios: { NSCameraUsageDescription: CAMERA_TR, NSPhotoLibraryUsageDescription: PHOTOS_TR },
    },
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        backgroundColor: NUDE_50,
        image: './assets/images/placeholder-splash.png',
        imageWidth: 120,
      },
    ],
    ['expo-localization', { supportedLocales: { ios: ['en', 'tr'], android: ['en', 'tr'] } }],
    [
      'expo-camera',
      {
        cameraPermission: CAMERA_EN,
        microphonePermission: false,
        recordAudioAndroid: false,
        barcodeScannerEnabled: false,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: PHOTOS_EN,
        cameraPermission: CAMERA_EN,
        microphonePermission: false,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    // Web preview only: exported with a placeholder base path that
    // scripts/export-web-preview.mjs rewrites to a runtime-detected one, so the export works
    // under any sub-path. Native builds ignore baseUrl.
    ...(process.env.TONELLE_WEB_BASE_PLACEHOLDER ? { baseUrl: process.env.TONELLE_WEB_BASE_PLACEHOLDER } : {}),
  },
  extra: {
    ...config.extra,
    publisher: 'Doribleg Trade Ltd',
  },
});
