import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createVital } from '../../../services/vitalsService';
import { logActivity } from '../../../services/activityService';

export default function AddVitalsScreen() {
  const router = useRouter();
  const [vitals, setVitals] = useState({
    systolic: '120',
    diastolic: '80',
    heartRate: '72',
    spO2: '98',
    temperature: '98.6',
    weight: '150'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const updateVital = (key: string, value: string) => {
    setVitals(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveVitals = async () => {
    // Validate inputs
    const requiredFields = ['systolic', 'diastolic', 'heartRate', 'spO2', 'temperature'];
    const missingFields = requiredFields.filter(field => !vitals[field as keyof typeof vitals].trim());
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all vital measurements.');
      return;
    }

    try {
      // Save vitals to Firestore
      await createVital(vitals);
      
      // Log activity
      await logActivity('vital_recorded', `BP: ${vitals.systolic}/${vitals.diastolic}, HR: ${vitals.heartRate} BPM`);
      
      // Show success message
      setShowSuccess(true);
      
      // Hide success message and navigate to dashboard after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        router.replace('/(dashboard)');
      }, 2000);
    } catch (error) {
      console.error('Error saving vitals:', error);
      Alert.alert('Error', 'Failed to save vitals. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Record Vitals</Text>
          <Text style={styles.subtitle}>Enter your vital measurements below</Text>
        </View>

        {/* Blood Pressure */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <Ionicons name="heart" size={24} color="#4F46E5" />
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalTitle}>Blood Pressure</Text>
              <Text style={styles.vitalSubtitle}>Systolic / Diastolic</Text>
            </View>
          </View>
          <View style={styles.bloodPressureContainer}>
            <View style={styles.bpInputContainer}>
              <Text style={styles.inputLabel}>Systolic (mmHg)</Text>
              <TextInput
                style={styles.textInput}
                value={vitals.systolic}
                onChangeText={(value) => updateVital('systolic', value)}
                keyboardType="numeric"
                placeholder="120"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <Text style={styles.separator}>/</Text>
            <View style={styles.bpInputContainer}>
              <Text style={styles.inputLabel}>Diastolic (mmHg)</Text>
              <TextInput
                style={styles.textInput}
                value={vitals.diastolic}
                onChangeText={(value) => updateVital('diastolic', value)}
                keyboardType="numeric"
                placeholder="80"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Heart Rate */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <Ionicons name="pulse" size={24} color="#EF4444" />
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalTitle}>Heart Rate</Text>
              <Text style={styles.vitalSubtitle}>Beats per minute</Text>
            </View>
          </View>
          <View style={styles.singleInputContainer}>
            <Text style={styles.inputLabel}>BPM</Text>
            <TextInput
              style={styles.textInput}
              value={vitals.heartRate}
              onChangeText={(value) => updateVital('heartRate', value)}
              keyboardType="numeric"
              placeholder="72"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Blood Oxygen */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <Ionicons name="water" size={24} color="#10B981" />
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalTitle}>Blood Oxygen</Text>
              <Text style={styles.vitalSubtitle}>SpO₂ percentage</Text>
            </View>
          </View>
          <View style={styles.singleInputContainer}>
            <Text style={styles.inputLabel}>SpO₂ (%)</Text>
            <TextInput
              style={styles.textInput}
              value={vitals.spO2}
              onChangeText={(value) => updateVital('spO2', value)}
              keyboardType="numeric"
              placeholder="98"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Temperature */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <Ionicons name="thermometer" size={24} color="#F59E0B" />
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalTitle}>Temperature</Text>
              <Text style={styles.vitalSubtitle}>Body temperature</Text>
            </View>
          </View>
          <View style={styles.singleInputContainer}>
            <Text style={styles.inputLabel}>Temperature (°F)</Text>
            <TextInput
              style={styles.textInput}
              value={vitals.temperature}
              onChangeText={(value) => updateVital('temperature', value)}
              keyboardType="numeric"
              placeholder="98.6"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Weight */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <Ionicons name="fitness" size={24} color="#8B5CF6" />
            <View style={styles.vitalInfo}>
              <Text style={styles.vitalTitle}>Weight</Text>
              <Text style={styles.vitalSubtitle}>Current weight</Text>
            </View>
          </View>
          <View style={styles.singleInputContainer}>
            <Text style={styles.inputLabel}>Weight (lbs)</Text>
            <TextInput
              style={styles.textInput}
              value={vitals.weight}
              onChangeText={(value) => updateVital('weight', value)}
              keyboardType="numeric"
              placeholder="150"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveVitals}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Vitals</Text>
        </TouchableOpacity>

        {/* Success Message */}
        {showSuccess && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>Vitals Saved Successfully</Text>
              <Text style={styles.successSubtitle}>Your vital measurements have been recorded</Text>
            </View>
          </View>
        )}
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
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  vitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vitalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  vitalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  vitalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  bloodPressureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bpInputContainer: {
    flex: 1,
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    marginHorizontal: 16,
    marginTop: 20,
  },
  singleInputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  successTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 2,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#047857',
  },
});