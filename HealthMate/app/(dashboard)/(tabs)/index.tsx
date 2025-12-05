import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateAverageVitals, readAllVitals, Vital } from '../../../services/vitalsService';
import { Activity, getRecentActivities, getActivityStyle, formatActivityTime } from '../../../services/activityService';
import { auth } from '../../../FirebaseConfig';

export default function DashboardHomeScreen() {
  const router = useRouter();
  const [todayVitals, setTodayVitals] = React.useState<Vital | null>(null);
  const [recentActivities, setRecentActivities] = React.useState<Activity[]>([]);
  const [averageVitals, setAverageVitals] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [userName, setUserName] = React.useState<string>('User');

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  React.useEffect(() => {
    loadVitals();
    // Get user info
    const user = auth.currentUser;
    if (user) {
      // Use displayName if available, otherwise extract from email
      if (user.displayName) {
        setUserName(user.displayName);
      } else if (user.email) {
        // Extract name from email (before @)
        const emailName = user.email.split('@')[0];
        // Capitalize first letter
        setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
      }
    }
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadVitals();
    }, [])
  );

  const loadVitals = async () => {
    try {
      const vitals = await readAllVitals();
      console.log('📊 Dashboard loaded vitals:', vitals.length);

      if (vitals.length > 0) {
        // Get the most recent vital (today's or latest)
        setTodayVitals(vitals[0]);
        
        // Calculate average vitals from all vitals data
        const avgData = calculateAverageVitals(vitals);
        setAverageVitals(avgData);
      } else {
        setTodayVitals(null);
        setAverageVitals(null);
      }

      // Load recent activities from activity service
      const activities = await getRecentActivities(10);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading vitals:', error);
      setTodayVitals(null);
      setAverageVitals(null);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVitals = () => {
    router.push('/(dashboard)/(tabs)/addVitals');
  };

  const handleChartsInsights = () => {
    router.push('/(dashboard)/(tabs)/chart');
  };

  const handleExportPDF = () => {
    router.push('/(dashboard)/(tabs)/export');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/(dashboard)/(tabs)/reminders')}
          >
            <Ionicons name="notifications-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Today's Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Vitals</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalCard}>
              <Ionicons name="heart" size={24} color="#EF4444" />
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>
                {todayVitals ? `${todayVitals.bloodPressure.systolic}/${todayVitals.bloodPressure.diastolic}` : '--/--'}
              </Text>
              <Text style={styles.vitalUnit}>mmHg</Text>
            </View>
            <View style={styles.vitalCard}>
              <Ionicons name="pulse" size={24} color="#F97316" />
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>
                {todayVitals ? todayVitals.heartRate : '--'}
              </Text>
              <Text style={styles.vitalUnit}>bpm</Text>
            </View>
            <View style={styles.vitalCard}>
              <Ionicons name="water" size={24} color="#3B82F6" />
              <Text style={styles.vitalLabel}>SpO₂</Text>
              <Text style={styles.vitalValue}>
                {todayVitals ? `${todayVitals.spO2}%` : '--%'}
              </Text>
              <Text style={styles.vitalUnit}>Oxygen</Text>
            </View>
            <View style={styles.vitalCard}>
              <Ionicons name="thermometer" size={24} color="#F59E0B" />
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>
                {todayVitals ? `${todayVitals.temperature}°F` : '--°F'}
              </Text>
              <Text style={styles.vitalUnit}>Normal</Text>
            </View>
          </View>
        </View>

        {/* Average Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average Vitals</Text>
          <View style={styles.vitalsGrid}>
            <View style={[styles.vitalCard, styles.averageCard]}>
              <Ionicons name="heart" size={24} color="#EF4444" />
              <Text style={styles.vitalLabel}>Avg Blood Pressure</Text>
              <Text style={styles.vitalValue}>
                {averageVitals ? `${averageVitals.bloodPressure.systolic}/${averageVitals.bloodPressure.diastolic}` : '--/--'}
              </Text>
              <Text style={styles.vitalUnit}>mmHg</Text>
            </View>
            <View style={[styles.vitalCard, styles.averageCard]}>
              <Ionicons name="pulse" size={24} color="#F97316" />
              <Text style={styles.vitalLabel}>Avg Heart Rate</Text>
              <Text style={styles.vitalValue}>
                {averageVitals ? averageVitals.heartRate : '--'}
              </Text>
              <Text style={styles.vitalUnit}>bpm</Text>
            </View>
            <View style={[styles.vitalCard, styles.averageCard]}>
              <Ionicons name="water" size={24} color="#3B82F6" />
              <Text style={styles.vitalLabel}>Avg SpO₂</Text>
              <Text style={styles.vitalValue}>
                {averageVitals ? `${averageVitals.spO2}%` : '--%'}
              </Text>
              <Text style={styles.vitalUnit}>Oxygen</Text>
            </View>
            <View style={[styles.vitalCard, styles.averageCard]}>
              <Ionicons name="thermometer" size={24} color="#F59E0B" />
              <Text style={styles.vitalLabel}>Avg Temperature</Text>
              <Text style={styles.vitalValue}>
                {averageVitals ? `${averageVitals.temperature}°F` : '--°F'}
              </Text>
              <Text style={styles.vitalUnit}>Normal</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddVitals}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Vitals</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/(dashboard)/(tabs)/history')}
          >
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleChartsInsights}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
              <Text style={styles.actionLabel}>Charts & Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handleExportPDF}>
              <Ionicons name="document-text" size={24} color="#3B82F6" />
              <Text style={styles.actionLabel}>Export PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const style = getActivityStyle(activity.type);
                return (
                  <View key={activity.id || index} style={[styles.activityItem, index === recentActivities.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[styles.activityIcon, { backgroundColor: style.bgColor }]}>
                      <Ionicons name={style.icon as any} size={16} color={style.color} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      {activity.description && (
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      )}
                      <Text style={styles.activityTime}>{formatActivityTime(activity.timestamp)}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="information" size={16} color="#6B7280" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>No recent activity</Text>
                  <Text style={styles.activityTime}>Start by adding your vitals</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  averageCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  vitalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  vitalUnit: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  activityDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
});
