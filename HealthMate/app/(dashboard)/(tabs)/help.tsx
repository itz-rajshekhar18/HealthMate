import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I record my vitals?',
    answer: 'Go to the Add Vitals tab from the bottom navigation. Enter your blood pressure, heart rate, SpO2, temperature, and weight, then tap Save Vitals.',
  },
  {
    question: 'How do I export my health report?',
    answer: 'Navigate to the Export tab, select your desired date range, and tap Download PDF or Share Report to export your vitals data.',
  },
  {
    question: 'Can I view my vitals history?',
    answer: 'Yes! From the Home screen, tap View History to see all your recorded vitals. You can filter by time period and delete old records.',
  },
  {
    question: 'How do I set up reminders?',
    answer: 'Go to the Reminders tab, toggle on the reminders you want, select the days, and tap the time to change when you want to be reminded.',
  },
  {
    question: 'Is my health data secure?',
    answer: 'Yes, your data is stored securely in Firebase with user authentication. Only you can access your health records when logged in.',
  },
  {
    question: 'How do I view my health trends?',
    answer: 'Tap on Analytics in the bottom navigation to see charts and insights about your health trends over time.',
  },
  {
    question: 'Can I share my health report with my doctor?',
    answer: 'Yes! Use the Export tab to generate a shareable link or download a PDF report that you can share with your healthcare provider.',
  },
  {
    question: 'How do I change my account settings?',
    answer: 'Go to Profile tab where you can view your account information and sign out. Account settings can be managed through your email provider.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSupport = () => {
    const email = 'support@healthmate.app';
    const subject = 'HealthMate Support Request';
    const body = 'Please describe your issue or question:\n\n';
    
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .catch(() => {
        Alert.alert('Email Not Available', `Please contact us at ${email}`);
      });
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Contact Sales Team',
      'Our sales team is available Monday-Friday, 9 AM - 6 PM EST.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL('tel:+1234567890') },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.title}>Help & Support</Text>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            
            <TouchableOpacity style={styles.contactCard} onPress={handleContactSupport}>
              <View style={[styles.contactIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="mail" size={24} color="#2563EB" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Email Support</Text>
                <Text style={styles.contactSubtitle}>Get help via email within 24 hours</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleCallSupport}>
              <View style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="call" size={24} color="#059669" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Contact Sales Team</Text>
                <Text style={styles.contactSubtitle}>Mon-Fri, 9 AM - 6 PM EST</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactCard} 
              onPress={() => Linking.openURL('https://github.com/itz-rajshekhar18/HealthMate')}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="globe" size={24} color="#DC2626" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Visit Help Center</Text>
                <Text style={styles.contactSubtitle}>Browse articles and tutorials</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* FAQs Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6B7280"
                  />
                </View>
                {expandedFaq === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>HealthMate v1.0.0</Text>
            <Text style={styles.appCopyright}>© 2025 HealthMate. All rights reserved.</Text>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 14,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    paddingRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 22,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});
