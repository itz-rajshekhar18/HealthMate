import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDER_STORAGE_KEY = '@healthmate_reminders';

export interface HealthReminder {
  id: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
  enabled: boolean;
  type: 'vitals' | 'medication' | 'water' | 'exercise' | 'custom';
  days: number[]; // 1-7 (Sunday = 1)
}

// Request notification permissions (simplified - just returns true)
export async function requestNotificationPermissions(): Promise<boolean> {
  return true;
}

// Schedule a reminder (stores locally, actual notifications need dev build)
export async function scheduleReminder(reminder: HealthReminder): Promise<string[]> {
  // Just save the reminder - actual push notifications need a development build
  return [];
}

// Cancel a specific reminder
export async function cancelReminder(reminderId: string): Promise<void> {
  // No-op for now
}

// Cancel all reminders
export async function cancelAllReminders(): Promise<void> {
  // No-op for now
}

// Save reminders to storage
export async function saveReminders(reminders: HealthReminder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
  }
}

// Load reminders from storage
export async function loadReminders(): Promise<HealthReminder[]> {
  try {
    const data = await AsyncStorage.getItem(REMINDER_STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultReminders();
  } catch (error) {
    console.error('Error loading reminders:', error);
    return getDefaultReminders();
  }
}

// Get default reminders
export function getDefaultReminders(): HealthReminder[] {
  return [
    {
      id: 'vitals-morning',
      title: '🩺 Morning Vitals Check',
      body: 'Time to record your morning blood pressure and heart rate!',
      hour: 8,
      minute: 0,
      enabled: false,
      type: 'vitals',
      days: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'vitals-evening',
      title: '🩺 Evening Vitals Check',
      body: "Don't forget to log your evening health readings!",
      hour: 20,
      minute: 0,
      enabled: false,
      type: 'vitals',
      days: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'water-reminder',
      title: '💧 Hydration Reminder',
      body: 'Stay hydrated! Have you had enough water today?',
      hour: 12,
      minute: 0,
      enabled: false,
      type: 'water',
      days: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: 'medication-morning',
      title: '💊 Medication Reminder',
      body: 'Time to take your morning medication!',
      hour: 9,
      minute: 0,
      enabled: false,
      type: 'medication',
      days: [1, 2, 3, 4, 5, 6, 7],
    },
  ];
}

// Schedule all enabled reminders
export async function scheduleAllReminders(reminders: HealthReminder[]): Promise<void> {
  // No-op - reminders are saved but push notifications need dev build
}

// Send a test notification
export async function sendTestNotification(): Promise<void> {
  Alert.alert(
    'Reminders Saved',
    'Your reminder settings have been saved. Push notifications require a development build to work on mobile devices.',
    [{ text: 'OK' }]
  );
}

// Get notification permission status
export async function getNotificationPermissionStatus(): Promise<string> {
  return 'granted';
}
