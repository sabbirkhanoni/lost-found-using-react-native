import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ onFinish }) => {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenSplash', 'true');
    onFinish();
  };

  return (
    <LinearGradient
      colors={['#6C5CE7', '#8172F0', '#FFB627']}
      style={styles.container}
    >
      <View style={styles.logoBox}>
        <Text style={styles.logoIcon}>🔍</Text>
      </View>

      <Text style={styles.title}>Lost & Found</Text>
      <Text style={styles.subtitle}>
        Hi, welcome to Lost & Found! This app helps you find lost items and
        report found items in your area. Let's get started! Hi
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 34,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 16,
  },
  buttonText: { color: '#5641D8', fontWeight: '700', fontSize: 15 },
});

export default SplashScreen;
