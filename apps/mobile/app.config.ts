import type { ConfigContext, ExpoConfig } from 'expo/config';

import en from './locales/en.json';

/**
 * Tonelle mobile app config.
 *
 * App languages: one locales/<lang>.json per language holds the localized display name and
 * permission texts (compiled into <lang>.lproj/InfoPlist.strings by expo prebuild); English is
 * the base string. LANGUAGES also feeds CFBundleLocalizations, so iOS Settings shows the
 * per-app Language option. Values are written verbatim into .strings files: no double quotes.
 *
 * Privacy manifest: the entries below cover the "required reason" APIs used by React Native,
 * AsyncStorage and Expo modules. Expo/RevenueCat SDKs ship their own PrivacyInfo.xcprivacy that
 * Xcode merges. Before submission, re-check App Store Connect's privacy "nutrition label":
 * photos are processed transiently (not collected/stored), purchases are handled by RevenueCat,
 * and there is no tracking (NSPrivacyTracking = false).
 *
 * App icon: glass compact with four brand-colour pans on lavender (assets/images/icon.png,
 * 1024px, no alpha);
 * adaptive-icon.png is the same art shrunk into Android's safe zone on ICON_BG.
 */

const CAMERA_EN = en.ios.NSCameraUsageDescription;
const PHOTOS_EN = en.ios.NSPhotoLibraryUsageDescription;

/** Same languages as LOCALES in @tonelle/shared (Brazilian Portuguese is the pt-BR lproj). */
const LANGUAGES = ['en', 'tr', 'es', 'pt-BR', 'de', 'fr', 'it', 'ja', 'ko'] as const;

/** v3 "Aura" paper (src/theme.ts). */
const PAPER = '#FFFFFF';
/** Lavender behind the compact in the icon art. */
const ICON_BG = '#E4DCEC';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tonelle',
  owner: 'yigitcanxiety',
  slug: 'tonelle',
  scheme: 'tonelle',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/images/icon.png',
  backgroundColor: PAPER,
  ios: {
    bundleIdentifier: 'com.tonelleapp.app',
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
    package: 'com.tonelleapp.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: ICON_BG,
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
    favicon: './assets/images/favicon.png',
  },
  locales: Object.fromEntries(LANGUAGES.map((lang) => [lang, `./locales/${lang}.json`])),
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        // Same background, image and size as the opening animation (src/components/intro.tsx).
        backgroundColor: '#F3EFFD',
        image: './assets/images/palette.png',
        imageWidth: 160,
      },
    ],
    ['expo-localization', { supportedLocales: { ios: [...LANGUAGES], android: [...LANGUAGES] } }],
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
    eas: { projectId: '39517736-92a6-4831-b56e-fc618dfd21fd' },
  },
});
