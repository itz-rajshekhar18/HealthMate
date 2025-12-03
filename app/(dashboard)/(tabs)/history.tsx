import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { readAllVitals, deleteVital, Vital } from '../../../services/vitalsService';

export default function HistoryScreen() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '7' | '30' | '90'>('all');

  useEffect(() => {
    loadVitals();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadVitals();
    }, [])
  );

  const loadVitals = async () => {
    try {
      setLoading(true);
      const allVitals = await readAllVitals();
      setVitals(allVitals);
    } catch (error) {
      console.error('Error loading vitals:', error);
      Alert.alert('Error', 'Failed to load vitals history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVital = (vitalId: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this vital record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVital(vitalId);
              setVitals(vitals.filter(v => v.id !== vitalId));
              Alert.alert('Success', 'Record deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  };


  const getFilteredVitals = () => {
    if (selectedFilter === 'all') return vitals;
    
    const days = parseInt(selectedFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return vitals.filter(vital => {
      const vitalDate = vital.timestamp?.toDate?.() || new Date(vital.timestamp as any);
      return vitalDate >= cutoffDate;
    });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: '#10B981' };
    if (systolic < 130 && diastolic < 80) return { label: 'Elevated', color: '#F59E0B' };
    if (systolic < 140 || diastolic < 90) return { label: 'High Stage 1', color: '#F97316' };
    return { label: 'High Stage 2', color: '#EF4444' };
  };

  const filteredVitals = getFilteredVitals();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Vitals History</Text>
            <Text style={styles.subtitle}>
              {filteredVitals.length} record{filteredVitals.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {[
              { key: 'all', label: 'All' },
              { key: '7', label: '7 Days' },
              { key: '30', label: '30 Days' },
              { key: '90', label: '90 Days' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === filter.key && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>


          {/* Vitals List */}
          {filteredVitals.length > 0 ? (
            <View style={styles.vitalsList}>
              {filteredVitals.map((vital, index) => {
                const bpStatus = getBPStatus(vital.bloodPressure.systolic, vital.bloodPressure.diastolic);
                return (
                  <View key={vital.id || index} style={styles.vitalCard}>
                    {/* Date Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.dateText}>{formatDate(vital.timestamp)}</Text>
                        <Text style={styles.timeText}>{formatTime(vital.timestamp)}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => vital.id && handleDeleteVital(vital.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    {/* Vitals Grid */}
                    <View style={styles.vitalsGrid}>
                      {/* Blood Pressure */}
                      <View style={styles.vitalItem}>
                        <View style={styles.vitalIconContainer}>
                          <Ionicons name="heart" size={20} color="#EF4444" />
                        </View>
                        <View style={styles.vitalInfo}>
                          <Text style={styles.vitalLabel}>Blood Pressure</Text>
                          <Text style={styles.vitalValue}>
                            {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                          </Text>
                          <View style={[styles.statusBadge, { backgroundColor: bpStatus.color + '20' }]}>
                            <Text style={[styles.statusText, { color: bpStatus.color }]}>
                              {bpStatus.label}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Heart Rate */}
                      <View style={styles.vitalItem}>
                        <View style={styles.vitalIconContainer}>
                          <Ionicons name="pulse" size={20} color="#F97316" />
                        </View>
                        <View style={styles.vitalInfo}>
                          <Text style={styles.vitalLabel}>Heart Rate</Text>
                          <Text style={styles.vitalValue}>{vital.heartRate} BPM</Text>
                        </View>
                      </View>

                      {/* SpO2 */}
                      <View style={styles.vitalItem}>
                        <View style={styles.vitalIconContainer}>
                          <Ionicons name="water" size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.vitalInfo}>
                          <Text style={styles.vitalLabel}>SpO₂</Text>
                          <Text style={styles.vitalValue}>{vital.spO2}%</Text>
                        </View>
                      </View>

                      {/* Temperature */}
                      <View style={styles.vitalItem}>
                        <View style={styles.vitalIconContainer}>
                          <Ionicons name="thermometer" size={20} color="#F59E0B" />
                        </View>
                        <View style={styles.vitalInfo}>
                          <Text style={styles.vitalLabel}>Temperature</Text>
                          <Text style={styles.vitalValue}>{vital.temperature}°F</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Records Found</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'all'
                  ? 'Start recording your vitals to see them here'
                  : `No records in the last ${selectedFilter} days`}
              </Text>
            </View>
          )}
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  vitalsList: {
    gap: 16,
  },
  vitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  vitalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalInfo: {
    flex: 1,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
