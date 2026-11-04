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
import {
  verifySignUpOTPApi,
  resendOTPApi,
  verifyOTPApi,
} from '../api/auth.api';

const VerifyOtpScreen = ({ route, navigation }) => {
  const { email, mode } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert(
        'Missing Code',
        'Please enter the 6-digit verification code.',
      );
      return;
    }

    if (otp.length !== 6) {
      Alert.alert(
        'Invalid Code',
        'Please enter the complete 6-digit verification code.',
      );
      return;
    }

    try {
      setLoading(true);

      if (mode === 'signup') {
        await verifySignUpOTPApi({ email, otp });

        Alert.alert(
          'Email Verified',
          'Your email has been successfully verified. You can now sign in.',
        );

        navigation.navigate('Login');
      } else {
        await verifyOTPApi({ email, otp });

        navigation.navigate('ResetPassword', { email });
      }
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error.response?.data?.message ||
          'The verification code is incorrect or has expired.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      await resendOTPApi(email);

      Alert.alert(
        'Code Sent',
        'A new verification code has been sent to your email.',
      );
    } catch (error) {
      Alert.alert(
        'Unable to Resend',
        error.response?.data?.message ||
          'Failed to resend the verification code.',
      );
    } finally {
      setResending(false);
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
              <Text style={styles.title}>Verify your email</Text>

              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to
              </Text>

              <Text style={styles.email}>{email}</Text>
            </View>

            {/* OTP Section */}
            <View style={styles.form}>
              <Text style={styles.label}>VERIFICATION CODE</Text>

              <View style={styles.otpWrapper}>
                <TextInput
                  style={styles.otpInput}
                  value={otp}
                  onChangeText={value => setOtp(value.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="000000"
                  placeholderTextColor="#CBD5E1"
                  textAlign="center"
                  autoFocus
                />
              </View>

              <Text style={styles.helperText}>
                Enter the 6-digit code from your email.
              </Text>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify Code</Text>

                    <Text style={styles.arrow}>→</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Resend */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>

              <TouchableOpacity
                onPress={handleResend}
                disabled={resending}
                activeOpacity={0.7}
              >
                {resending ? (
                  <ActivityIndicator
                    size="small"
                    color="#4F46E5"
                    style={styles.resendLoader}
                  />
                ) : (
                  <Text style={styles.resendLink}>Resend code</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Security Note */}
            <View style={styles.securityBox}>
              <View style={styles.securityIcon}>
                <Text style={styles.securityCheck}>✓</Text>
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Secure verification</Text>

                <Text style={styles.securityText}>
                  Never share your verification code with anyone.
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Lost & Found • Secure Account Verification
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* -------------------------------- */
  /* Screen                           */
  /* -------------------------------- */

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

  /* -------------------------------- */
  /* Background                       */
  /* -------------------------------- */

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

  /* -------------------------------- */
  /* Back                             */
  /* -------------------------------- */

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

  /* -------------------------------- */
  /* Content                          */
  /* -------------------------------- */

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },

  /* -------------------------------- */
  /* Icon                             */
  /* -------------------------------- */

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

  /* -------------------------------- */
  /* Header                           */
  /* -------------------------------- */

  header: {
    marginBottom: 30,
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
  },

  email: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 4,
  },

  /* -------------------------------- */
  /* Form                             */
  /* -------------------------------- */

  form: {
    width: '100%',
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 9,
    letterSpacing: 0.3,
  },

  otpWrapper: {
    height: 70,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  otpInput: {
    width: '100%',
    height: '100%',
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 10,
    paddingLeft: 10,
  },

  helperText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 18,
  },

  /* -------------------------------- */
  /* Button                           */
  /* -------------------------------- */

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

  /* -------------------------------- */
  /* Resend                           */
  /* -------------------------------- */

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  resendText: {
    fontSize: 13,
    color: '#64748B',
  },

  resendLink: {
    fontSize: 15,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#4F46E5',
    fontWeight: '800',
    color: '#4F46E5',
    marginLeft: 5,
  },

  resendLoader: {
    marginLeft: 8,
  },

  /* -------------------------------- */
  /* Security                         */
  /* -------------------------------- */

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

  /* -------------------------------- */
  /* Footer                           */
  /* -------------------------------- */

  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#94A3B8',
    marginBottom: 12,
  },
});

export default VerifyOtpScreen;
