import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Vital } from '../../../services/vitalsService';
import { 
  fetchCurrentUserVitals,
  filterVitalsByDateRange,
  prepareChartData,
  getAverageValueForVital,
  generateHealthInsights,
  generateRecommendations,
  getChartTitle,
  getChartSubtitle,
  VitalType
} from '../../../services/chartService';
import { auth } from '../../../FirebaseConfig';

const screenWidth = Dimensions.get('window').width;

export default function ChartsScreen() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVital, setSelectedVital] = useState<VitalType>('bloodPressure');
  const [dateRange, setDateRange] = useState(30); // Last 30 days
  const userEmail = auth.currentUser?.email || '';

  useEffect(() => {
    fetchUserVitals();
  }, [dateRange]); // Re-fetch when dateRange changes

  const fetchUserVitals = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching vitals for user:', userEmail);
      
      // Fetch vitals only for the logged-in user using their email
      const userVitals = await fetchCurrentUserVitals();
      console.log('📊 Total vitals fetched:', userVitals.length);
      
      // Filter by date range
      const filteredVitals = filterVitalsByDateRange(userVitals, dateRange);
      console.log(`📊 Filtered vitals (last ${dateRange} days):`, filteredVitals.length);
      
      setVitals(filteredVitals);
    } catch (error: any) {
      console.error('❌ Error fetching vitals:', error);
      alert(`Failed to load vitals: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading your health data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Charts & Insights</Text>
              <Text style={styles.subtitle}>Analyze your health trends and patterns</Text>
              <Text style={styles.userEmail}>Data for: {userEmail}</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={fetchUserVitals}
              disabled={loading}
            >
              <Ionicons name="refresh" size={24} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Vital Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.filterButton, selectedVital === 'bloodPressure' && styles.filterButtonActive]}
                onPress={() => setSelectedVital('bloodPressure')}
              >
                <Ionicons name="heart" size={16} color={selectedVital === 'bloodPressure' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[styles.filterButtonText, selectedVital === 'bloodPressure' && styles.filterButtonTextActive]}>
                  Blood Pressure
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, selectedVital === 'heartRate' && styles.filterButtonActive]}
                onPress={() => setSelectedVital('heartRate')}
              >
                <Ionicons name="pulse" size={16} color={selectedVital === 'heartRate' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[styles.filterButtonText, selectedVital === 'heartRate' && styles.filterButtonTextActive]}>
                  Heart Rate
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, selectedVital === 'spO2' && styles.filterButtonActive]}
                onPress={() => setSelectedVital('spO2')}
              >
                <Ionicons name="water" size={16} color={selectedVital === 'spO2' ? '#FFFFFF' : '#6B7280'} />
                <Text style={[styles.filterButtonText, selectedVital === 'spO2' && styles.filterButtonTextActive]}>
                  SpO₂
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Date Range</Text>
            <View style={styles.dateRangeButtons}>
              <TouchableOpacity
                style={[styles.dateButton, dateRange === 7 && styles.dateButtonActive]}
                onPress={() => setDateRange(7)}
              >
                <Text style={[styles.dateButtonText, dateRange === 7 && styles.dateButtonTextActive]}>7 days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, dateRange === 30 && styles.dateButtonActive]}
                onPress={() => setDateRange(30)}
              >
                <Text style={[styles.dateButtonText, dateRange === 30 && styles.dateButtonTextActive]}>30 days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, dateRange === 90 && styles.dateButtonActive]}
                onPress={() => setDateRange(90)}
              >
                <Text style={[styles.dateButtonText, dateRange === 90 && styles.dateButtonTextActive]}>90 days</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Chart Card */}
        {vitals.length > 0 ? (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>{getChartTitle(selectedVital)}</Text>
              <Text style={styles.chartAverage}>{getAverageValueForVital(vitals, selectedVital)}</Text>
            </View>
            <Text style={styles.chartSubtitle}>{getChartSubtitle(selectedVital)}</Text>
            
            <LineChart
              data={prepareChartData(vitals, selectedVital, 7)}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#4F46E5'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        ) : (
          <View style={styles.noDataCard}>
            <Ionicons name="bar-chart-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>No Data Available</Text>
            <Text style={styles.noDataText}>Start recording your vitals to see trends and insights</Text>
          </View>
        )}

        {/* Health Insights */}
        {generateHealthInsights(vitals).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Insights</Text>
            {generateHealthInsights(vitals).map((insight, index) => (
              <View key={index} style={[styles.insightCard, { borderLeftColor: insight.color }]}>
                <Ionicons name={insight.icon as any} size={24} color={insight.color} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations */}
        {vitals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.recommendationsHeader}>
              <Ionicons name="bulb" size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Recommendations</Text>
            </View>
            <Text style={styles.recommendationsSubtitle}>Based on your recent trends</Text>
            <View style={styles.recommendationsList}>
              {generateRecommendations(vitals).map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export Charts</Text>
        </TouchableOpacity>

        {/* Data Count */}
        <Text style={styles.dataCount}>
          Showing {vitals.length} record{vitals.length !== 1 ? 's' : ''} for {userEmail}
        </Text>
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
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  dateRangeButtons: {
    flexDirection: 'row',
  },
  dateButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  dateButtonTextActive: {
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chartAverage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  insightContent: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  recommendationsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#4F46E5',
    marginRight: 8,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dataCount: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
});
