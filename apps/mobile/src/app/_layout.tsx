import { Gloock_400Regular } from '@expo-google-fonts/gloock/400Regular';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DemoBadge } from '@/components/demo-badge';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { isWebDemo } from '@/lib/env';
import { initPurchases } from '@/purchases/purchases';
import { useAppStore } from '@/store/app-store';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Gloock_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const reduced = useReducedMotion();
  const hydrated = useAppStore((s) => s.hydrated);
  const anonId = useAppStore((s) => s.anonId);
  // If fonts fail we still render with system fonts rather than blocking the app.
  const ready = hydrated && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (hydrated && anonId) initPurchases(anonId);
  }, [hydrated, anonId]);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  // Calm, quick transitions (DESIGN.md §6): fades; none with reduce motion.
  const fade = reduced ? 'none' : 'fade';

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {isWebDemo ? <DemoBadge /> : null}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
          animation: reduced ? 'none' : 'fade_from_bottom',
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: fade }} />
        <Stack.Screen name="consent" />
        <Stack.Screen name="tips" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="analyzing" options={{ gestureEnabled: false, animation: fade }} />
        <Stack.Screen name="teaser" options={{ gestureEnabled: false, animation: fade }} />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
            animation: reduced ? 'none' : 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="look/[id]" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="share" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
