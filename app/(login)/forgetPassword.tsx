import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="heart" size={40} color="#FFFFFF" />
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Forgot Password?</Text>
          <Text style={styles.welcomeSubtitle}>
            Don't worry! Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Send Reset Link Button */}
          <TouchableOpacity style={styles.resetButton} activeOpacity={0.8}>
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              We'll send a password reset link to your email address. Please check your inbox and follow the instructions to create a new password.
            </Text>
          </View>

          {/* Back to Sign In Section */}
          <View style={styles.backToSignInContainer}>
            <Text style={styles.backToSignInText}>Remember your password?</Text>
            <Link href="/(login)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.backToSignInLink}>Back to Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Alternative Options */}
          <View style={styles.alternativeContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.createAccountContainer}>
              <Text style={styles.createAccountText}>Don't have an account?</Text>
              <Link href="/(login)/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.createAccountLink}>Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#4F46E5',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  resetButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  instructionsText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  backToSignInContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backToSignInText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  backToSignInLink: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  alternativeContainer: {
    marginTop: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 16,
  },
  createAccountContainer: {
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  createAccountLink: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});