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
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your email and password.',
      );
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Unable to login. Please try again.',
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
          {/* Premium Background Elements */}
          <View style={styles.blueGlow} />
          <View style={styles.purpleGlow} />
          <View style={styles.smallGlow} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Sign in to continue to your Lost & Found account.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.emailIcon}>@</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgetPassword')}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.passwordIcon}>••</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>

                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <View style={styles.orContainer}>
              <Text style={styles.dividerText}>OR</Text>
            </View>

            <View style={styles.divider} />
          </View>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Create an account</Text>
            </TouchableOpacity>
          </View>

          {/* Security Note */}
          <View style={styles.securityContainer}>
            <View style={styles.securityDot} />

            <Text style={styles.securityText}>
              Your information is securely protected
            </Text>
          </View>
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
    justifyContent: 'center',
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#EDE9FE',
    bottom: -130,
    left: -120,
  },

  smallGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#CFFAFE',
    top: 210,
    right: -35,
  },

  /* Header */

  header: {
    marginBottom: 38,
  },

  logoWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  logoContainer: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',

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
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },

  title: {
    fontSize: 35,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1.2,
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    maxWidth: 335,
  },

  /* Form */

  form: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: 21,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  forgotText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },

  inputWrapper: {
    height: 57,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,
    elevation: 2,
  },

  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  emailIcon: {
    color: '#4F46E5',
    fontSize: 15,
    fontWeight: '900',
  },

  passwordIcon: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '900',
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0F172A',
  },

  showButton: {
    paddingLeft: 10,
  },

  showText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },

  /* Login Button */

  loginButton: {
    height: 58,
    borderRadius: 15,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.27,
    shadowRadius: 15,
    elevation: 8,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  arrowContainer: {
    marginLeft: 10,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '500',
  },

  /* Divider */

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 29,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  orContainer: {
    paddingHorizontal: 14,
  },

  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },

  /* Sign Up */

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signupText: {
    fontSize: 13,
    color: '#64748B',
  },

  signupLink: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4F46E5',
    marginLeft: 5,
  },

  /* Security */

  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  securityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06B6D4',
    marginRight: 7,
  },

  securityText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
});

export default LoginScreen;
