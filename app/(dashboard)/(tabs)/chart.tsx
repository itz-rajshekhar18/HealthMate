import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Vital, calculateAverageVitals } from '../../../services/vitalsService';
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
import { logActivity } from '../../../services/activityService';
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

  const exportCharts = async () => {
    if (vitals.length === 0) {
      Alert.alert('No Data', 'No vitals data available to export.');
      return;
    }

    try {
      const userName = auth.currentUser?.displayName || userEmail.split('@')[0];
      const reportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      const averages = calculateAverageVitals(vitals);
      const insights = generateHealthInsights(vitals);
      const recommendations = generateRecommendations(vitals);

      // Generate chart data for all vital types
      const bpData = prepareChartData(vitals, 'bloodPressure', 7);
      const hrData = prepareChartData(vitals, 'heartRate', 7);
      const spo2Data = prepareChartData(vitals, 'spO2', 7);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Health Analytics Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1F2937; }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #4F46E5; }
            h1 { font-size: 28px; color: #1F2937; margin-bottom: 8px; }
            .subtitle { font-size: 16px; color: #6B7280; }
            .info-bar { display: flex; justify-content: space-between; background: #F9FAFB; padding: 16px; border-radius: 12px; margin-bottom: 30px; }
            .info-item { text-align: center; }
            .info-label { font-size: 12px; color: #6B7280; }
            .info-value { font-size: 16px; font-weight: 600; color: #1F2937; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #1F2937; margin-bottom: 16px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; }
            .vitals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
            .vital-card { background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px; text-align: center; }
            .vital-label { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
            .vital-value { font-size: 24px; font-weight: bold; color: #1F2937; }
            .vital-unit { font-size: 12px; color: #6B7280; }
            .chart-section { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
            .chart-title { font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 12px; }
            .chart-data { display: flex; flex-wrap: wrap; gap: 8px; }
            .data-point { background: #EEF2FF; padding: 8px 12px; border-radius: 8px; font-size: 14px; }
            .insight-card { background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
            .insight-title { font-weight: 600; color: #1F2937; margin-bottom: 4px; }
            .insight-message { font-size: 14px; color: #6B7280; }
            .recommendation { padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
            .recommendation:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; font-size: 12px; color: #9CA3AF; }
            .trend-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .trend-table th, .trend-table td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
            .trend-table th { background: #F9FAFB; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Health Analytics Report</h1>
            <div class="subtitle">Comprehensive Health Trends & Insights</div>
          </div>

          <div class="info-bar">
            <div class="info-item">
              <div class="info-label">Patient</div>
              <div class="info-value">${userName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Report Date</div>
              <div class="info-value">${reportDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Period</div>
              <div class="info-value">Last ${dateRange} Days</div>
            </div>
            <div class="info-item">
              <div class="info-label">Records</div>
              <div class="info-value">${vitals.length}</div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Average Vitals Summary</h2>
            <div class="vitals-grid">
              <div class="vital-card">
                <div class="vital-label">Blood Pressure</div>
                <div class="vital-value">${averages?.bloodPressure.systolic || '--'}/${averages?.bloodPressure.diastolic || '--'}</div>
                <div class="vital-unit">mmHg</div>
              </div>
              <div class="vital-card">
                <div class="vital-label">Heart Rate</div>
                <div class="vital-value">${averages?.heartRate || '--'}</div>
                <div class="vital-unit">BPM</div>
              </div>
              <div class="vital-card">
                <div class="vital-label">SpO₂</div>
                <div class="vital-value">${averages?.spO2 || '--'}%</div>
                <div class="vital-unit">Oxygen</div>
              </div>
              <div class="vital-card">
                <div class="vital-label">Temperature</div>
                <div class="vital-value">${averages?.temperature || '--'}°F</div>
                <div class="vital-unit">Fahrenheit</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Trend Data</h2>
            <div class="chart-section">
              <div class="chart-title">Blood Pressure Readings</div>
              <div class="chart-data">
                ${bpData.labels.map((label, i) => `<span class="data-point">${label}: ${bpData.datasets[0].data[i]} mmHg</span>`).join('')}
              </div>
            </div>
            <div class="chart-section">
              <div class="chart-title">Heart Rate Readings</div>
              <div class="chart-data">
                ${hrData.labels.map((label, i) => `<span class="data-point">${label}: ${hrData.datasets[0].data[i]} BPM</span>`).join('')}
              </div>
            </div>
            <div class="chart-section">
              <div class="chart-title">SpO₂ Readings</div>
              <div class="chart-data">
                ${spo2Data.labels.map((label, i) => `<span class="data-point">${label}: ${spo2Data.datasets[0].data[i]}%</span>`).join('')}
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Health Insights</h2>
            ${insights.map(insight => `
              <div class="insight-card">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-message">${insight.message}</div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Recommendations</h2>
            ${recommendations.map(rec => `<div class="recommendation">• ${rec}</div>`).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Detailed Records</h2>
            <table class="trend-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Pressure</th>
                  <th>Heart Rate</th>
                  <th>SpO₂</th>
                  <th>Temperature</th>
                </tr>
              </thead>
              <tbody>
                ${vitals.slice(0, 15).map(vital => {
                  const date = vital.timestamp?.toDate?.() || new Date(vital.timestamp as any);
                  return `
                    <tr>
                      <td>${date.toLocaleDateString()}</td>
                      <td>${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic} mmHg</td>
                      <td>${vital.heartRate} BPM</td>
                      <td>${vital.spO2}%</td>
                      <td>${vital.temperature}°F</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            Generated by HealthMate Analytics • ${reportDate}<br>
            For: ${userEmail}
          </div>
        </body>
        </html>
      `;

      // Export based on platform
      if (Platform.OS === 'web') {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HealthMate_Analytics_${new Date().getTime()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        await logActivity('chart_exported', `Analytics chart for last ${dateRange} days`);
        Alert.alert('Success', 'Analytics report downloaded successfully!');
      } else {
        const fileName = `HealthMate_Analytics_${new Date().getTime()}.html`;
        const filePath = `${(FileSystem as any).documentDirectory || ''}${fileName}`;
        await (FileSystem as any).writeAsStringAsync(filePath, htmlContent);
        
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'text/html',
            dialogTitle: 'Share Analytics Report',
          });
        } else {
          Alert.alert('Success', 'Report saved to: ' + filePath);
        }
        await logActivity('chart_exported', `Analytics chart for last ${dateRange} days`);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export charts: ' + error.message);
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
        <TouchableOpacity style={styles.exportButton} onPress={exportCharts}>
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
