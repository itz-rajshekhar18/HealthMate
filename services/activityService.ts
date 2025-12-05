import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../FirebaseConfig';

const ACTIVITY_STORAGE_KEY = '@healthmate_activities';

export type ActivityType = 'vital_recorded' | 'report_exported' | 'chart_exported' | 'reminder_set' | 'profile_updated';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string; // ISO string
  userId: string;
}

// Get activity icon and color based on type
export const getActivityStyle = (type: ActivityType) => {
  switch (type) {
    case 'vital_recorded':
      return { icon: 'checkmark', color: '#16A34A', bgColor: '#DCFCE7' };
    case 'report_exported':
      return { icon: 'document-text', color: '#2563EB', bgColor: '#DBEAFE' };
    case 'chart_exported':
      return { icon: 'bar-chart', color: '#8B5CF6', bgColor: '#EDE9FE' };
    case 'reminder_set':
      return { icon: 'notifications', color: '#F59E0B', bgColor: '#FEF3C7' };
    case 'profile_updated':
      return { icon: 'person', color: '#6366F1', bgColor: '#E0E7FF' };
    default:
      return { icon: 'ellipse', color: '#6B7280', bgColor: '#F3F4F6' };
  }
};

// Get activity title based on type
export const getActivityTitle = (type: ActivityType): string => {
  switch (type) {
    case 'vital_recorded':
      return 'Vitals recorded';
    case 'report_exported':
      return 'Health report exported';
    case 'chart_exported':
      return 'Analytics chart exported';
    case 'reminder_set':
      return 'Reminder updated';
    case 'profile_updated':
      return 'Profile updated';
    default:
      return 'Activity';
  }
};

// Log a new activity
export const logActivity = async (type: ActivityType, description?: string): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const activity: Activity = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: getActivityTitle(type),
      description,
      timestamp: new Date().toISOString(),
      userId,
    };

    const activities = await getActivities();
    activities.unshift(activity); // Add to beginning

    // Keep only last 50 activities
    const trimmedActivities = activities.slice(0, 50);
    
    await AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedActivities));
    console.log('✅ Activity logged:', type);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Get all activities for current user
export const getActivities = async (): Promise<Activity[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const data = await AsyncStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!data) return [];

    const allActivities: Activity[] = JSON.parse(data);
    // Filter by current user
    return allActivities.filter(a => a.userId === userId);
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};

// Get recent activities (last N)
export const getRecentActivities = async (limit: number = 10): Promise<Activity[]> => {
  const activities = await getActivities();
  return activities.slice(0, limit);
};

// Clear all activities for current user
export const clearActivities = async (): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const data = await AsyncStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!data) return;

    const allActivities: Activity[] = JSON.parse(data);
    const filteredActivities = allActivities.filter(a => a.userId !== userId);
    
    await AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(filteredActivities));
  } catch (error) {
    console.error('Error clearing activities:', error);
  }
};

// Format timestamp for display
export const formatActivityTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
