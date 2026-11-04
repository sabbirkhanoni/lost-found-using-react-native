import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { resetPasswordApi } from '../api/auth.api';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter and confirm your new password.',
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Don't Match",
        'Please make sure both passwords are the same.',
      );
      return;
    }

    try {
      setLoading(true);

      await resetPasswordApi({
        email,
        newPassword,
      });

      Alert.alert(
        'Password Updated',
        'Your password has been successfully changed. Please sign in with your new password.',
      );

      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Reset Failed',
        error.response?.data?.message ||
          'Unable to reset your password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Background Decorations */}
          <View style={styles.blueGlow} />
          <View style={styles.purpleGlow} />
          <View style={styles.smallGlow} />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create a new password</Text>

              <Text style={styles.subtitle}>
                Your identity has been verified. Choose a strong new password
                for your account.
              </Text>

              <Text style={styles.email}>{email}</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NEW PASSWORD</Text>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Text style={styles.lockIcon}>••</Text>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#94A3B8"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.showText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CONFIRM PASSWORD</Text>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Text style={styles.lockIcon}>••</Text>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleReset}
                  />

                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.showText}>
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirement */}
              <View style={styles.requirementRow}>
                <View style={styles.requirementDot} />

                <Text style={styles.requirementText}>
                  Use at least 6 characters for your password.
                </Text>
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleReset}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Reset Password</Text>

                    <Text style={styles.arrow}>→</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Security Note */}
            <View style={styles.securityBox}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityCheck}>✓</Text>
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Almost there</Text>

                <Text style={styles.securityText}>
                  Once updated, you'll be able to sign in using your new
                  password.
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Lost & Found • Secure Account Recovery
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* Screen */

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },

  /* Background */

  blueGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#DBEAFE',
    top: -170,
    right: -120,
  },

  purpleGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#EDE9FE',
    bottom: -140,
    left: -130,
  },

  smallGlow: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#CFFAFE',
    top: 230,
    right: -35,
  },

  /* Back */

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 8,
    paddingRight: 12,
  },

  backArrow: {
    fontSize: 29,
    lineHeight: 28,
    color: '#0F172A',
    marginRight: 5,
    fontWeight: '300',
  },

  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },

  /* Content */

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },

  /* Icon */

  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
  },

  /* Header */

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 33,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
    maxWidth: 345,
  },

  email: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 6,
  },

  /* Form */

  form: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 9,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    height: 58,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  lockIcon: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -2,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0F172A',
  },

  showText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    paddingLeft: 8,
  },

  /* Requirement */

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -3,
    marginBottom: 18,
  },

  requirementDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
    marginRight: 7,
  },

  requirementText: {
    fontSize: 10,
    color: '#94A3B8',
  },

  /* Button */

  button: {
    height: 58,
    borderRadius: 15,
    backgroundColor: '#4F46E5',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 7,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 22,
    marginLeft: 10,
    marginTop: -2,
  },

  /* Security */

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 24,
    padding: 14,

    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  securityIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#ECFDF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  securityCheck: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16A34A',
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 2,
  },

  securityText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#64748B',
  },

  /* Footer */

  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#94A3B8',
    marginBottom: 12,
  },
});

export default ResetPasswordScreen;
