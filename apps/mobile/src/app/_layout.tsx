import { InterTight_300Light } from '@expo-google-fonts/inter-tight/300Light';
import { InterTight_400Regular } from '@expo-google-fonts/inter-tight/400Regular';
import { InterTight_500Medium } from '@expo-google-fonts/inter-tight/500Medium';
import { InterTight_600SemiBold } from '@expo-google-fonts/inter-tight/600SemiBold';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { initPurchases } from '@/purchases/purchases';
import { useAppStore } from '@/store/app-store';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    InterTight_300Light,
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
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

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
          animation: reduced ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: reduced ? 'none' : 'fade' }} />
        <Stack.Screen name="consent" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="camera" options={{ contentStyle: { backgroundColor: colors.night } }} />
        <Stack.Screen name="analyzing" options={{ gestureEnabled: false, animation: reduced ? 'none' : 'fade' }} />
        <Stack.Screen name="teaser" options={{ gestureEnabled: false, animation: reduced ? 'none' : 'fade' }} />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
            animation: reduced ? 'none' : 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="results" options={{ gestureEnabled: false }} />
        <Stack.Screen name="look/[id]" />
        <Stack.Screen name="share" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
}
