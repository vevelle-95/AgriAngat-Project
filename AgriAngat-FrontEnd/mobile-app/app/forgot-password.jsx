import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

const ForgotPasswordScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("email"); // 'email' | 'sms'
  const router = useRouter();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  const handleSubmit = () => {
    if (method === "email") {
      if (!email) {
        Alert.alert("Error", "Please enter your email address");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }
      // Simulate sending email link; navigate to reset page to complete flow optionally
      router.push({ pathname: "/reset-password", params: { via: "email", to: email } });
      return;
    }

    // SMS flow
    const normalized = phone.replace(/\D/g, "");
    if (!normalized) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (normalized.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    // Simulate sending SMS code; proceed to code entry screen
    router.push({ pathname: "/reset-password", params: { via: "sms", to: normalized } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backPill}
          >
            <Text style={styles.backPillIcon}>←</Text>
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={agriangatLogo} style={styles.logo} />
            <Text style={styles.logoText}>AgriAngat</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Choose a method to recover your account. We can send a reset link to your email or an SMS verification code to your phone.
          </Text>

          <View style={styles.form}>
            {/* Method toggle */}
            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[styles.methodButton, method === "email" && styles.methodActive]}
                onPress={() => setMethod("email")}
              >
                <Text style={[styles.methodText, method === "email" && styles.methodTextActive]}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodButton, method === "sms" && styles.methodActive]}
                onPress={() => setMethod("sms")}
              >
                <Text style={[styles.methodText, method === "sms" && styles.methodTextActive]}>SMS</Text>
              </TouchableOpacity>
            </View>

            {method === "email" ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <Text style={styles.hint}>We&apos;ll send a 6-digit code via SMS.</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleSubmit}
            >
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <View style={styles.backToLoginContainer}>
              <Text style={styles.backToLoginText}>
                Remember your password?{" "}
                <Text 
                  style={styles.backToLoginLink}
                  onPress={() => router.back()}
                >
                  Back to Login
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: -100,
  },
  backPillIcon: {
    fontSize: 20,
    marginRight: 6,
    color: "#333",
  },
  backPillText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: -20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 6,
    alignContent: "center",
    marginTop: 80,
    marginBottom: -10,
    marginRight: -5,
  },
  logoText: {
    fontSize: 21,
    fontFamily: "Poppins-ExtraBold",
    color: "#666",
    marginTop: 80,
    marginBottom: -10,
    marginRight: 35,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginBottom: 16,
  },
  methodButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
  },
  methodActive: {
    backgroundColor: "#007AFF",
  },
  methodText: {
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  methodTextActive: {
    color: "#fff",
  },
  hint: {
    marginTop: 8,
    color: "#666",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#fff",
  },
  resetButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  backToLoginContainer: {
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  backToLoginLink: {
    color: "#007AFF",
    fontFamily: "Poppins-Bold",
    textDecorationLine: "underline",
  },
});
