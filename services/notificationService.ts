import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDER_STORAGE_KEY = '@healthmate_reminders';
const isWeb = Platform.OS === 'web';

// Configure notification behavior (only on native)
if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

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

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (isWeb) {
    console.log('Notifications not fully supported on web');
    return true; // Return true to allow UI to work
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Android requires a notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('health-reminders', {
        name: 'Health Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A90D9',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}


// Schedule a daily reminder
export async function scheduleReminder(reminder: HealthReminder): Promise<string[]> {
  const notificationIds: string[] = [];

  if (isWeb) {
    console.log('Scheduling reminders not supported on web');
    return notificationIds;
  }

  try {
    // Cancel existing notifications for this reminder
    await cancelReminder(reminder.id);

    if (!reminder.enabled) {
      return notificationIds;
    }

    // Schedule for each selected day
    for (const day of reminder.days) {
      const trigger: Notifications.WeeklyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day,
        hour: reminder.hour,
        minute: reminder.minute,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { reminderId: reminder.id, type: reminder.type },
        },
        trigger,
      });

      notificationIds.push(notificationId);
    }

    return notificationIds;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return notificationIds;
  }
}

// Cancel a specific reminder
export async function cancelReminder(reminderId: string): Promise<void> {
  if (isWeb) return;

  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.reminderId === reminderId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error canceling reminder:', error);
  }
}

// Cancel all reminders
export async function cancelAllReminders(): Promise<void> {
  if (isWeb) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all reminders:', error);
  }
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
  if (isWeb) return;

  for (const reminder of reminders) {
    if (reminder.enabled) {
      await scheduleReminder(reminder);
    }
  }
}

// Send an immediate test notification
export async function sendTestNotification(): Promise<void> {
  if (isWeb) {
    Alert.alert(
      'Web Platform',
      'Push notifications are not supported on web. Please use the mobile app for full notification support.',
      [{ text: 'OK' }]
    );
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ HealthMate Notifications Working!',
        body: 'You will receive health reminders at your scheduled times.',
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
}

// Get notification permission status
export async function getNotificationPermissionStatus(): Promise<string> {
  if (isWeb) {
    return 'granted'; // Allow UI to work on web
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting permission status:', error);
    return 'undetermined';
  }
}
