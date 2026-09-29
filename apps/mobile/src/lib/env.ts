import { Platform } from 'react-native';

import { isWebDemoMode, readEnv, type MobilePlatform } from './config';

/**
 * Resolved runtime env. `process.env.EXPO_PUBLIC_*` must be referenced literally so Expo can
 * inline the values at build time.
 */
export const env = readEnv({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SITE_URL: process.env.EXPO_PUBLIC_SITE_URL,
  EXPO_PUBLIC_RC_IOS_KEY: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  EXPO_PUBLIC_RC_ANDROID_KEY: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
});

/** Browser preview without an API: flows run on the shared mock analysis (labelled DEMO in the UI). */
export const isWebDemo = isWebDemoMode(
  { EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL },
  Platform.OS as MobilePlatform,
);
