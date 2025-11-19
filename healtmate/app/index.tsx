import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';



export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(login)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section with Blue Background */}
        <View style={styles.header}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="heart-outline" size={36} color="#4F46E5" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>HealthMate</Text>
          <Text style={styles.subtitle}>Your Health, Simplified</Text>

          {/* Stats and Graph Container */}
          <View style={styles.statsGraphContainer}>
            {/* Health Stats Card */}
            <View className="FIRSTBOX" style={styles.statsCard}>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#4F46E5' }]} />
                <Text style={styles.statText}>120/80</Text>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.statText}>72 BPM</Text>
              </View>
              <View style={styles.statRow}>
                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.statText}>98% SpO2</Text>
              </View>
            </View>
            
            {/* Adjacent Graph */}
            <View style={styles.graphContainer}>
              <View style={styles.graphLine}>
                {/* Curved line segments to create smooth wave */}
                <View style={[styles.curvedSegment, { left: '5%', bottom: '60%', width: 25, height: 8, borderRadius: 4 }]} />
                <View style={[styles.curvedSegment, { left: '20%', bottom: '70%', width: 30, height: 6, borderRadius: 3 }]} />
                <View style={[styles.curvedSegment, { left: '35%', bottom: '50%', width: 25, height: 8, borderRadius: 4 }]} />
                <View style={[styles.curvedSegment, { left: '50%', bottom: '40%', width: 28, height: 7, borderRadius: 3.5 }]} />
                <View style={[styles.curvedSegment, { left: '65%', bottom: '30%', width: 22, height: 9, borderRadius: 4.5 }]} />
                <View style={[styles.curvedSegment, { left: '80%', bottom: '55%', width: 20, height: 6, borderRadius: 3 }]} />
                
                {/* Additional smaller segments for smoother curve */}
                <View style={[styles.curvedSegment, { left: '12%', bottom: '65%', width: 15, height: 4, borderRadius: 2 }]} />
                <View style={[styles.curvedSegment, { left: '28%', bottom: '60%', width: 18, height: 5, borderRadius: 2.5 }]} />
                <View style={[styles.curvedSegment, { left: '43%', bottom: '45%', width: 16, height: 6, borderRadius: 3 }]} />
                <View style={[styles.curvedSegment, { left: '58%', bottom: '35%', width: 14, height: 5, borderRadius: 2.5 }]} />
                <View style={[styles.curvedSegment, { left: '73%', bottom: '42%', width: 17, height: 4, borderRadius: 2 }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          {/* Track Your Health */}
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="heart-outline" size={24} color="#4F46E5" />
              </View>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Track Your Health</Text>
              <Text style={styles.featureDescription}>
                Monitor your vitals like blood pressure, heart rate, and oxygen levels with our comprehensive health tracking platform.
              </Text>
            </View>
          </View>

          {/* Record Vitals */}
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="fitness-outline" size={24} color="#EF4444" />
              </View>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Record Vitals</Text>
              <Text style={styles.featureDescription}>
                Easily log blood pressure, heart rate, blood flow, temperature, and weight readings with our intuitive interface.
              </Text>
            </View>
          </View>

          {/* View History */}
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="time-outline" size={24} color="#F97316" />
              </View>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>View History</Text>
              <Text style={styles.featureDescription}>
                Access your complete health history with detailed records organized by date and time.
              </Text>
            </View>
          </View>

          {/* Track Trends */}
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="trending-up-outline" size={24} color="#10B981" />
              </View>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Track Trends</Text>
              <Text style={styles.featureDescription}>
                Visualize your health data with graphs and charts to identify patterns and insights.
              </Text>
            </View>
          </View>

          {/* Share Reports */}
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: '#FAF5FF' }]}>
                <Ionicons name="share-social-outline" size={24} color="#A855F7" />
              </View>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Share Reports</Text>
              <Text style={styles.featureDescription}>
                Generate PDF reports and share your health data with doctors and family.
              </Text>
            </View>
          </View>

          {/* Why Choose VisualTracker */}
          <View style={styles.whyChooseSection}>
            <Text style={styles.sectionTitle}>Why Choose HealthMate?</Text>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitTitle}>Simple & Intuitive</Text>
                <Text style={styles.benefitDescription}>User-friendly interface for effortless data entry.</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <Text style={styles.benefitTitle}>Comprehensive Tracking</Text>
                <Text style={styles.benefitDescription}>Monitor all essential health metrics in one place.</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <Text style={styles.benefitTitle}>Smart Insights</Text>
                <Text style={styles.benefitDescription}>Get personalized health tips and pattern analysis.</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <Text style={styles.benefitTitle}>Healthcare Ready</Text>
                <Text style={styles.benefitDescription}>Professional reports for doctor visits.</Text>
              </View>
            </View>
          </View>

          {/* Ready to Start */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Start?</Text>
            <Text style={styles.ctaDescription}>
              Begin your health journey today with HealthMate
            </Text>
            
            {/* Get Started Button */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              activeOpacity={0.8}
              onPress={handleGetStarted}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            {/* Learn More Button */}
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>HealthMate</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 72,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGraphContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  statText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  featureItem: {
    marginBottom: 40,
  },
  featureBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featureIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTextContainer: {
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyChooseSection: {
    marginTop: 16,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  benefitsList: {
    paddingHorizontal: 8,
  },
  benefitItem: {
    marginBottom: 20,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ctaSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 25,
    marginHorizontal: 8,
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
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerSeparator: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  graphContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  graphLine: {
    flex: 1,
    position: 'relative',
  },
  curvedSegment: {
    position: 'absolute',
    backgroundColor: '#4F46E5',
    opacity: 0.8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});