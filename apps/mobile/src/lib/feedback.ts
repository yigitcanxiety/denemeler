import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useAppStore } from '@/store/app-store';

/** Original UI sounds, synthesised for Tonelle (no samples). */
const SOUNDS = {
  intro: require('../../assets/sounds/intro.m4a'),
  shutter: require('../../assets/sounds/shutter.m4a'),
  success: require('../../assets/sounds/success.m4a'),
  reveal: require('../../assets/sounds/reveal.m4a'),
  tick: require('../../assets/sounds/tick.m4a'),
} as const;

export type SoundName = keyof typeof SOUNDS;

const players: Partial<Record<SoundName, AudioPlayer>> = {};
let modeReady = false;

/**
 * Plays a short effect. Mixes with the user's music and stays silent with the ring/silent
 * switch, so it never interrupts anything. Failures are ignored: sound is decoration.
 */
export function playSound(name: SoundName, volume = 1): void {
  if (Platform.OS === 'web' || !useAppStore.getState().soundsEnabled) return;
  try {
    if (!modeReady) {
      modeReady = true;
      void setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => undefined);
    }
    const player = (players[name] ??= createAudioPlayer(SOUNDS[name]));
    player.volume = volume;
    void player.seekTo(0).catch(() => undefined);
    player.play();
  } catch {
    // ignore
  }
}

/** Loads the players ahead of their first use so the first effect is not late. */
export function preloadSounds(): void {
  if (Platform.OS === 'web') return;
  for (const name of Object.keys(SOUNDS) as SoundName[]) {
    try {
      players[name] ??= createAudioPlayer(SOUNDS[name]);
    } catch {
      // ignore
    }
  }
}

const run = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => undefined);
};

/** Haptics; iOS turns them off by itself when the user disabled system haptics. */
export const haptic = {
  /** Lists, chips, tabs. */
  select: () => run(() => Haptics.selectionAsync()),
  /** Primary buttons. */
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Shutter, palette spin. */
  thud: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  /** Results ready, look rendered, purchase. */
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  soft: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)),
};

/** The "it worked" moment: chime, success buzz. */
export function celebrate(sound: SoundName = 'reveal'): void {
  haptic.success();
  playSound(sound);
}
