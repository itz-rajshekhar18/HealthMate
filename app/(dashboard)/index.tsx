import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  const handleAddVitals = () => {
    router.push('/(tabs)/addVitals');
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
              <Text style={styles.greetingText}>Good Morning</Text>
              <Text style={styles.userName}>Sarah Johnson</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Today's Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Vitals</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalCard}>
              <Ionicons name="heart" size={24} color="#EF4444" />
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>120/80</Text>
              <Text style={styles.vitalUnit}>mmHg</Text>
            </View>
            <View style={styles.vitalCard}>
              <Ionicons name="pulse" size={24} color="#F97316" />
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>72</Text>
              <Text style={styles.vitalUnit}>bpm</Text>
            </View>
            <View style={styles.vitalCard}>
              <Ionicons name="water" size={24} color="#3B82F6" />
              <Text style={styles.vitalLabel}>SpO₂</Text>
              <Text style={styles.vitalValue}>98%</Text>
              <Text style={styles.vitalUnit}>Oxygen</Text>
            </View>
            <View style={styles.vitalCard}>
              <Ionicons name="thermometer" size={24} color="#F59E0B" />
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>98.6°F</Text>
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
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
              <Text style={styles.actionLabel}>Charts & Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="document-text" size={24} color="#3B82F6" />
              <Text style={styles.actionLabel}>Export PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="checkmark" size={16} color="#16A34A" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Vitals recorded</Text>
                <Text style={styles.activityTime}>Today at 8:30 AM</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="trending-up" size={16} color="#2563EB" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Weekly report generated</Text>
                <Text style={styles.activityTime}>Yesterday at 6:00 PM</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="warning" size={16} color="#D97706" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Medication reminder</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
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
  userName: {
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
    fontSize: 14,
    color: '#6B7280',
  },
});