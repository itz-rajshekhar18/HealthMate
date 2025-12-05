import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HealthReminder,
  requestNotificationPermissions,
  loadReminders,
  saveReminders,
  scheduleReminder,
  cancelReminder,
  sendTestNotification,
  getNotificationPermissionStatus,
} from '../../../services/notificationService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const [tempHour, setTempHour] = useState(8);
  const [tempMinute, setTempMinute] = useState(0);

  useEffect(() => {
    initializeReminders();
  }, []);

  const initializeReminders = async () => {
    try {
      const status = await getNotificationPermissionStatus();
      setPermissionGranted(status === 'granted');
      const savedReminders = await loadReminders();
      setReminders(savedReminders);
    } catch (error) {
      console.error('Error initializing reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
    if (granted) {
      Alert.alert('Success', 'Notification permissions granted!');
      await sendTestNotification();
    } else {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings.'
      );
    }
  };


  const handleToggleReminder = async (reminderId: string) => {
    const updatedReminders = reminders.map((r) =>
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
    const reminder = updatedReminders.find((r) => r.id === reminderId);
    if (reminder) {
      reminder.enabled ? await scheduleReminder(reminder) : await cancelReminder(reminderId);
    }
  };

  const handleToggleDay = async (reminderId: string, day: number) => {
    const updatedReminders = reminders.map((r) => {
      if (r.id === reminderId) {
        const newDays = r.days.includes(day)
          ? r.days.filter((d) => d !== day)
          : [...r.days, day].sort();
        return { ...r, days: newDays };
      }
      return r;
    });
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
    const reminder = updatedReminders.find((r) => r.id === reminderId);
    if (reminder?.enabled) await scheduleReminder(reminder);
  };

  const openTimePicker = (reminderId: string) => {
    const reminder = reminders.find((r) => r.id === reminderId);
    if (reminder) {
      setSelectedReminderId(reminderId);
      setTempHour(reminder.hour);
      setTempMinute(reminder.minute);
      setTimePickerVisible(true);
    }
  };

  const handleSaveTime = async () => {
    if (!selectedReminderId) return;
    
    const updatedReminders = reminders.map((r) =>
      r.id === selectedReminderId ? { ...r, hour: tempHour, minute: tempMinute } : r
    );
    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
    
    const reminder = updatedReminders.find((r) => r.id === selectedReminderId);
    if (reminder?.enabled) await scheduleReminder(reminder);
    
    setTimePickerVisible(false);
    setSelectedReminderId(null);
  };

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
  };

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      vitals: 'heart',
      medication: 'medical',
      water: 'water',
      exercise: 'fitness',
    };
    return icons[type] || 'notifications';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vitals: '#EF4444',
      medication: '#8B5CF6',
      water: '#3B82F6',
      exercise: '#10B981',
    };
    return colors[type] || '#6B7280';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reminders...</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reminders</Text>
            <Text style={styles.subtitle}>
              Set up notifications to stay on track with your health goals
            </Text>
          </View>

          {/* Permission Banner */}
          {!permissionGranted && (
            <TouchableOpacity style={styles.permissionBanner} onPress={handleRequestPermission}>
              <Ionicons name="warning" size={24} color="#F59E0B" />
              <View style={styles.permissionTextContainer}>
                <Text style={styles.permissionTitle}>Enable Notifications</Text>
                <Text style={styles.permissionSubtitle}>
                  Tap here to allow HealthMate to send you reminders
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#F59E0B" />
            </TouchableOpacity>
          )}

          {/* Test Notification Button */}
          {permissionGranted && (
            <TouchableOpacity style={styles.testButton} onPress={sendTestNotification}>
              <Ionicons name="notifications" size={20} color="white" />
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          )}

          {/* Reminders List */}
          <View style={styles.remindersList}>
            {reminders.map((reminder, index) => (
              <View key={reminder.id} style={[styles.reminderCard, index > 0 && { marginTop: 16 }]}>
                {/* Reminder Header */}
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: getTypeColor(reminder.type) + '20' }]}>
                      <Ionicons name={getTypeIcon(reminder.type)} size={20} color={getTypeColor(reminder.type)} />
                    </View>
                    <View style={styles.reminderTextContainer}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      <Text style={styles.reminderBody} numberOfLines={1}>{reminder.body}</Text>
                    </View>
                  </View>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => handleToggleReminder(reminder.id)}
                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                    thumbColor={reminder.enabled ? '#3B82F6' : '#9CA3AF'}
                  />
                </View>

                {/* Time Display - Tappable */}
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => openTimePicker(reminder.id)}
                >
                  <Ionicons name="time-outline" size={18} color="#3B82F6" />
                  <Text style={styles.timeButtonText}>{formatTime(reminder.hour, reminder.minute)}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Day Selector */}
                <View style={styles.daysContainer}>
                  {DAYS.map((day, idx) => {
                    const dayNumber = idx + 1;
                    const isSelected = reminder.days.includes(dayNumber);
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => handleToggleDay(reminder.id, dayNumber)}
                        style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                      >
                        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoText}>
                Tap the time to change it. Toggle reminders on/off and select which days.
              </Text>
            </View>
          </View>

          {Platform.OS === 'web' && (
            <View style={styles.webWarning}>
              <Ionicons name="warning" size={20} color="#F59E0B" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.webWarningTitle}>Web Limitations</Text>
                <Text style={styles.webWarningText}>
                  Push notifications work best on mobile devices.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>


      {/* Time Picker Modal */}
      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Reminder Time</Text>
            
            <View style={styles.pickerContainer}>
              {/* Hour Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView 
                  style={styles.pickerScroll} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScrollContent}
                >
                  {HOURS.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.pickerItem, tempHour === hour && styles.pickerItemSelected]}
                      onPress={() => setTempHour(hour)}
                    >
                      <Text style={[styles.pickerItemText, tempHour === hour && styles.pickerItemTextSelected]}>
                        {formatHour(hour)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView 
                  style={styles.pickerScroll} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScrollContent}
                >
                  {MINUTES.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[styles.pickerItem, tempMinute === minute && styles.pickerItemSelected]}
                      onPress={() => setTempMinute(minute)}
                    >
                      <Text style={[styles.pickerItemText, tempMinute === minute && styles.pickerItemTextSelected]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Selected Time Preview */}
            <View style={styles.timePreview}>
              <Text style={styles.timePreviewLabel}>Selected Time:</Text>
              <Text style={styles.timePreviewValue}>{formatTime(tempHour, tempMinute)}</Text>
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setTimePickerVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTime}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
  },
  permissionBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  permissionTitle: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 15,
  },
  permissionSubtitle: {
    color: '#B45309',
    fontSize: 13,
    marginTop: 2,
  },
  testButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  remindersList: {
    marginBottom: 20,
  },
  reminderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  reminderTitle: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 15,
  },
  reminderBody: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  timeButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  dayButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayTextSelected: {
    color: 'white',
  },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  infoTitle: {
    color: '#1E40AF',
    fontWeight: '600',
    fontSize: 14,
  },
  infoText: {
    color: '#3B82F6',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  webWarning: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  webWarningTitle: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 14,
  },
  webWarningText: {
    color: '#B45309',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  pickerScroll: {
    height: 200,
    width: '100%',
  },
  pickerScrollContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#3B82F6',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#4B5563',
  },
  pickerItemTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  timePreview: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  timePreviewLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  timePreviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
