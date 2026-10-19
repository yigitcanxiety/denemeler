import * as Notifications from 'expo-notifications';
import { createTranslator, type Locale } from '@tonelle/shared';
import { Platform } from 'react-native';

import { useAppStore } from '@/store/app-store';

/**
 * Weekly local reminder (no push server): Sunday 19:00, "this week's look". Re-scheduled on
 * every enable so the text follows the current language. Returns whether reminders are on.
 */
export async function enableReminders(locale: Locale): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    const granted = current.granted || (current.canAskAgain && (await Notifications.requestPermissionsAsync()).granted);
    useAppStore.getState().setReminders(granted);
    if (!granted) return false;
    const t = createTranslator(locale);
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: t('settings.reminderTitle'), body: t('settings.reminderBody'), sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: 1, hour: 19, minute: 0 },
    });
    return true;
  } catch {
    return false;
  }
}

export async function disableReminders(): Promise<void> {
  useAppStore.getState().setReminders(false);
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
}

/** Asks once, at a happy moment (first finished look), never again after an answer. */
export function maybeOfferReminders(locale: Locale): void {
  if (useAppStore.getState().remindersAsked) return;
  setTimeout(() => void enableReminders(locale), 1500);
}
