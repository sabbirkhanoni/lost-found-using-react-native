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
import { signUpApi } from '../api/auth.api';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        'Missing Information',
        'Name, email and password are required.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await signUpApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      Alert.alert('Success', response.data.message);

      navigation.navigate('VerifyOTP', { email });
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message ||
          'Registration failed. Please try again.',
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

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create an account</Text>

            <Text style={styles.subtitle}>
              Join Lost & Found and help reconnect people with their belongings.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>A</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>@</Text>
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

            {/* Phone */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Phone Number</Text>

                <Text style={styles.optional}>Optional</Text>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>+</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#94A3B8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>••</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
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
                  activeOpacity={0.7}
                >
                  <Text style={styles.showText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Create Account */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Create Account</Text>

                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms & Privacy Policy.
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
    top: 190,
    right: -35,
  },

  /* Header */

  header: {
    marginBottom: 30,
  },

  logoContainer: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,

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
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1.1,
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
    marginBottom: 16,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },

  optional: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 8,
  },

  inputWrapper: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,

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

  iconText: {
    color: '#4F46E5',
    fontSize: 13,
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

  /* Button */

  button: {
    height: 58,
    borderRadius: 15,
    backgroundColor: '#4F46E5',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 4,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.27,
    shadowRadius: 15,
    elevation: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    marginLeft: 10,
  },

  /* Login */

  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    fontSize: 13,
    color: '#64748B',
  },

  loginLink: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4F46E5',
    marginLeft: 5,
  },

  /* Footer */

  footerText: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    color: '#94A3B8',
    marginTop: 20,
    paddingHorizontal: 25,
  },
});

export default SignUpScreen;
