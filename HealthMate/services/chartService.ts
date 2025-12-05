import { readVitalsByEmail, calculateAverageVitals, Vital } from './vitalsService';
import { auth } from '../FirebaseConfig';

// ============================================
// DATA FETCHING
// ============================================

/**
 * Fetch vitals for the currently logged-in user
 */
export const fetchCurrentUserVitals = async (): Promise<Vital[]> => {
  try {
    const userEmail = auth.currentUser?.email;
    
    if (!userEmail) {
      throw new Error('User not authenticated');
    }

    // Fetch vitals only for the logged-in user using their email
    const userVitals = await readVitalsByEmail(userEmail);
    console.log(`✅ Fetched ${userVitals.length} vitals for ${userEmail}`);
    
    return userVitals;
  } catch (error) {
    console.error('❌ Error fetching user vitals:', error);
    throw error;
  }
};

/**
 * Filter vitals by date range
 */
export const filterVitalsByDateRange = (vitals: Vital[], days: number): Vital[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return vitals
    .filter(vital => {
      const vitalDate = vital.timestamp.toDate();
      return vitalDate >= cutoffDate;
    })
    .sort((a, b) => a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime());
};

// ============================================
// CHART DATA PREPARATION
// ============================================

export type VitalType = 'bloodPressure' | 'heartRate' | 'spO2' | 'temperature';

export interface ChartDataset {
  data: number[];
  color?: (opacity: number) => string;
  strokeWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  legend?: string[];
}

/**
 * Prepare chart data for visualization
 */
export const prepareChartData = (vitals: Vital[], vitalType: VitalType, maxPoints: number = 7): ChartData => {
  if (vitals.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{ data: [0] }]
    };
  }

  // Get last N data points
  const recentVitals = vitals.slice(-maxPoints);
  
  // Create labels (dates)
  const labels = recentVitals.map(vital => {
    const date = vital.timestamp.toDate();
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  let data: number[] = [];
  let data2: number[] = [];

  // Extract data based on vital type
  switch (vitalType) {
    case 'bloodPressure':
      data = recentVitals.map(v => v.bloodPressure.systolic);
      data2 = recentVitals.map(v => v.bloodPressure.diastolic);
      return {
        labels,
        datasets: [
          { data, color: () => '#4F46E5', strokeWidth: 2 },
          { data: data2, color: () => '#8B5CF6', strokeWidth: 2 }
        ],
        legend: ['Systolic', 'Diastolic']
      };
      
    case 'heartRate':
      data = recentVitals.map(v => v.heartRate);
      break;
      
    case 'spO2':
      data = recentVitals.map(v => v.spO2);
      break;
      
    case 'temperature':
      data = recentVitals.map(v => v.temperature);
      break;
  }

  return {
    labels,
    datasets: [{ data, color: () => '#4F46E5', strokeWidth: 2 }]
  };
};

/**
 * Get average value for display
 */
export const getAverageValueForVital = (vitals: Vital[], vitalType: VitalType): string => {
  if (vitals.length === 0) return 'N/A';
  
  const averages = calculateAverageVitals(vitals);
  if (!averages) return 'N/A';

  switch (vitalType) {
    case 'bloodPressure':
      return `${averages.bloodPressure.systolic}/${averages.bloodPressure.diastolic}`;
    case 'heartRate':
      return averages.heartRate.toString();
    case 'spO2':
      return `${averages.spO2}%`;
    case 'temperature':
      return `${averages.temperature}°F`;
  }
};

// ============================================
// HEALTH INSIGHTS
// ============================================

export interface HealthInsight {
  type: 'success' | 'warning' | 'info';
  icon: string;
  title: string;
  message: string;
  color: string;
}

/**
 * Generate health insights based on vitals data
 */
export const generateHealthInsights = (vitals: Vital[]): HealthInsight[] => {
  if (vitals.length === 0) return [];

  const averages = calculateAverageVitals(vitals);
  if (!averages) return [];

  const insights: HealthInsight[] = [];

  // Blood Pressure Insights
  if (averages.bloodPressure.systolic < 120 && averages.bloodPressure.diastolic < 80) {
    insights.push({
      type: 'success',
      icon: 'trending-up',
      title: 'Great Progress!',
      message: 'Your blood pressure is in the healthy range',
      color: '#10B981'
    });
  } else if (averages.bloodPressure.systolic > 130) {
    insights.push({
      type: 'warning',
      icon: 'warning',
      title: 'Monitor Closely',
      message: `Your systolic reading is elevated (${averages.bloodPressure.systolic} mmHg)`,
      color: '#F59E0B'
    });
  } else if (averages.bloodPressure.systolic >= 120 && averages.bloodPressure.systolic <= 130) {
    insights.push({
      type: 'info',
      icon: 'information-circle',
      title: 'Elevated Blood Pressure',
      message: 'Your blood pressure is slightly elevated. Consider lifestyle modifications.',
      color: '#3B82F6'
    });
  }

  // Heart Rate Insights
  if (averages.heartRate < 60) {
    insights.push({
      type: 'info',
      icon: 'heart',
      title: 'Low Heart Rate',
      message: `Your average heart rate is ${averages.heartRate} BPM. This may be normal for athletes.`,
      color: '#3B82F6'
    });
  } else if (averages.heartRate > 100) {
    insights.push({
      type: 'warning',
      icon: 'heart',
      title: 'Elevated Heart Rate',
      message: `Your average heart rate is ${averages.heartRate} BPM. Consider consulting a doctor.`,
      color: '#F59E0B'
    });
  }

  // SpO2 Insights
  if (averages.spO2 < 95) {
    insights.push({
      type: 'warning',
      icon: 'water',
      title: 'Low Oxygen Levels',
      message: `Your average SpO₂ is ${averages.spO2}%. Consult a healthcare provider.`,
      color: '#F59E0B'
    });
  }

  // Tracking Consistency
  if (vitals.length >= 6) {
    insights.push({
      type: 'success',
      icon: 'checkmark-circle',
      title: 'Consistent Tracking',
      message: `You've recorded ${vitals.length} measurements - keep it up!`,
      color: '#10B981'
    });
  } else if (vitals.length >= 3) {
    insights.push({
      type: 'info',
      icon: 'calendar',
      title: 'Good Start',
      message: `You have ${vitals.length} measurements. Try to track daily for better insights.`,
      color: '#3B82F6'
    });
  }

  return insights;
};

// ============================================
// RECOMMENDATIONS
// ============================================

/**
 * Generate personalized recommendations
 */
export const generateRecommendations = (vitals: Vital[]): string[] => {
  if (vitals.length === 0) {
    return [
      'Start recording your vitals daily to track your health',
      'Measure at the same time each day for consistency',
      'Keep a log of any symptoms or activities that may affect readings'
    ];
  }

  const averages = calculateAverageVitals(vitals);
  if (!averages) return [];

  const recommendations: string[] = [];

  // Blood Pressure Recommendations
  if (averages.bloodPressure.systolic >= 120) {
    recommendations.push('Consider monitoring BP at the same time daily for consistency');
    recommendations.push('Reduce sodium intake and maintain a healthy diet');
    recommendations.push('Regular exercise can help lower blood pressure');
  } else {
    recommendations.push('Your readings are within healthy range - maintain current lifestyle');
  }

  // General Recommendations
  recommendations.push('Share these trends with your healthcare provider at your next visit');
  
  if (vitals.length < 7) {
    recommendations.push('Record vitals for at least 7 days to identify patterns');
  }

  // Consistency Recommendation
  const dates = vitals.map(v => v.timestamp.toDate().toDateString());
  const uniqueDates = new Set(dates);
  if (uniqueDates.size < vitals.length) {
    recommendations.push('Try to record only one measurement per day for accurate trends');
  }

  return recommendations;
};

// ============================================
// CHART TITLES
// ============================================

/**
 * Get chart title based on vital type
 */
export const getChartTitle = (vitalType: VitalType): string => {
  switch (vitalType) {
    case 'bloodPressure':
      return 'Blood Pressure Trend';
    case 'heartRate':
      return 'Heart Rate Trend';
    case 'spO2':
      return 'Blood Oxygen Trend';
    case 'temperature':
      return 'Temperature Trend';
  }
};

/**
 * Get chart subtitle based on vital type
 */
export const getChartSubtitle = (vitalType: VitalType): string => {
  switch (vitalType) {
    case 'bloodPressure':
      return 'Systolic and Diastolic readings over time';
    case 'heartRate':
      return 'Heart rate readings over time';
    case 'spO2':
      return 'Blood oxygen saturation over time';
    case 'temperature':
      return 'Body temperature readings over time';
  }
};

// ============================================
// STATISTICS
// ============================================

/**
 * Get statistics for vitals
 */
export const getVitalsStatistics = (vitals: Vital[]) => {
  if (vitals.length === 0) {
    return {
      totalRecords: 0,
      dateRange: 'No data',
      averages: null
    };
  }

  const sortedVitals = [...vitals].sort((a, b) => 
    a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
  );

  const firstDate = sortedVitals[0].timestamp.toDate();
  const lastDate = sortedVitals[sortedVitals.length - 1].timestamp.toDate();
  
  const dateRange = `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  const averages = calculateAverageVitals(vitals);

  return {
    totalRecords: vitals.length,
    dateRange,
    averages
  };
};