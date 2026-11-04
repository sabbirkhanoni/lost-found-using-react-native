import React, { useState } from "react";
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
} from "react-native";
import { forgetPasswordRequestApi } from "../api/auth.api";

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      await forgetPasswordRequestApi(email.trim());

      navigation.navigate("VerifyOTP", {
        email: email.trim(),
        mode: "reset",
      });
    } catch (error) {
      Alert.alert(
        "Request Failed",
        error.response?.data?.message ||
          "Unable to send the verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

          {/* Content */}
          <View style={styles.content}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Forgot your password?
              </Text>

              <Text style={styles.subtitle}>
                No worries. Enter the email address associated
                with your account and we'll send you a
                verification code to reset your password.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  EMAIL ADDRESS
                </Text>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Text style={styles.atSymbol}>
                      @
                    </Text>
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
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[
                  styles.button,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      Send Verification Code
                    </Text>

                    <Text style={styles.arrow}>
                      →
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Security Note */}
            <View style={styles.securityContainer}>
              <View style={styles.securityIcon}>
                <Text style={styles.check}>
                  ✓
                </Text>
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>
                  Secure password recovery
                </Text>

                <Text style={styles.securityText}>
                  A one-time verification code will be sent
                  to your registered email.
                </Text>
              </View>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Remember your password?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Your account security is our priority.
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
    backgroundColor: "#F8FAFC",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    overflow: "hidden",
  },

  /* -------------------------------- */
  /* Background                       */
  /* -------------------------------- */

  blueGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#DBEAFE",
    top: -170,
    right: -120,
  },

  purpleGlow: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#EDE9FE",
    bottom: -140,
    left: -130,
  },

  smallGlow: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#CFFAFE",
    top: 240,
    right: -35,
  },

  /* -------------------------------- */
  /* Back Button                      */
  /* -------------------------------- */

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 8,
    paddingRight: 12,
  },

  backArrow: {
    fontSize: 29,
    lineHeight: 28,
    color: "#0F172A",
    marginRight: 5,
    fontWeight: "300",
  },

  backText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  /* -------------------------------- */
  /* Content                          */
  /* -------------------------------- */

  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },

  /* -------------------------------- */
  /* Recovery Icon                    */
  /* -------------------------------- */

  iconContainer: {
    marginBottom: 24,
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },

  iconText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  /* -------------------------------- */
  /* Header                           */
  /* -------------------------------- */

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 33,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    maxWidth: 345,
  },

  /* -------------------------------- */
  /* Form                             */
  /* -------------------------------- */

  form: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 9,
    letterSpacing: 0.2,
  },

  inputWrapper: {
    height: 58,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,

    shadowColor: "#64748B",
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
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  atSymbol: {
    fontSize: 14,
    fontWeight: "900",
    color: "#4F46E5",
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#0F172A",
  },

  /* -------------------------------- */
  /* Button                           */
  /* -------------------------------- */

  button: {
    height: 58,
    borderRadius: 15,
    backgroundColor: "#4F46E5",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#4F46E5",
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
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 10,
    marginTop: -2,
  },

  /* -------------------------------- */
  /* Security                         */
  /* -------------------------------- */

  securityContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 25,
    padding: 14,

    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  securityIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#ECFDF3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  check: {
    fontSize: 14,
    fontWeight: "900",
    color: "#16A34A",
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 2,
  },

  securityText: {
    fontSize: 10,
    lineHeight: 15,
    color: "#64748B",
  },

  /* -------------------------------- */
  /* Login                            */
  /* -------------------------------- */

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 13,
    color: "#64748B",
  },

  loginLink: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4F46E5",
    marginLeft: 5,
  },

  /* -------------------------------- */
  /* Footer                           */
  /* -------------------------------- */

  footer: {
    textAlign: "center",
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 12,
  },
});

export default ForgetPasswordScreen;
