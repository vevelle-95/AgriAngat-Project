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

const LoginScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // Deprecated: account type selection state no longer needed
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
    // Login only. Registration now navigates directly on selection.
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    console.log("Logging in with:", email, password);
    Alert.alert("Success", "Login successful!", [
      {
        text: "OK",
        onPress: () => router.replace("(tabs)/home"),
      },
    ]);
  };

  // Back navigation from login disabled

  // removed account type selector callback; selections navigate directly now

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header (no back navigation from login) */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { gap: 5 }]}>
            <Image
              source={agriangatLogo}
              style={[
                styles.logoLarge,
                { width: 56, height: 56, marginRight: -10 },
              ]}
            />
            <Text style={[styles.logoText, { color: "#808080" }]}>
              AgriAngat
            </Text>
          </View>
        </View>

        {/* Navigation Toggle (smaller/more compact) */}
        <View style={styles.toggleContainerSmall}>
          <TouchableOpacity
            style={[
              styles.toggleButtonSmall,
              !isLogin && styles.toggleButtonActive,
            ]}
            onPress={() => setIsLogin(false)}
          >
            <Text
              style={[
                styles.toggleButtonTextSmall,
                !isLogin && styles.toggleButtonTextActive,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButtonSmall,
              isLogin && styles.toggleButtonActive,
            ]}
            onPress={() => setIsLogin(true)}
          >
            <Text
              style={[
                styles.toggleButtonTextSmall,
                isLogin && styles.toggleButtonTextActive,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { marginBottom: 22, marginTop: 55 }]}>
            {isLogin ? "Welcome back!" : "Create an Account"}
          </Text>

          {isLogin ? (
            // Login Form
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#666" 
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeButtonText}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { paddingVertical: 12, borderRadius: 10 },
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              <View style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>
                  Forgot password?{" "}
                  <Text style={styles.forgotPasswordLink} onPress={() => router.push("/forgot-password")}>
                    Forgot
                  </Text>
                </Text>
              </View>

              {/* Register Link */}
              <View style={styles.inlineLinkRow}>
                <Text style={styles.registerLinkText}>
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(false)}>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Registration Form
            <View style={styles.form}>
              {/* Removed account type header by request */}

              {/* Account Type Buttons (navigate directly) */}
              <TouchableOpacity
                style={styles.accountTypeButton}
                onPress={() => router.push("/register/farmer")}
              >
                <Text style={styles.accountTypeButtonText}>Farmer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accountTypeButton}
                onPress={() => router.push("/register/customer")}
              >
                <Text style={styles.accountTypeButtonText}>
                  Customer / Store
                </Text>
              </TouchableOpacity>

              {/* Bank option removed; buttons above navigate directly */}

              {/* Login Link */}
              <View style={styles.inlineLinkRow}>
                <Text style={styles.loginLinkText}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(true)}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
  },
  edgeBackZone: {
    position: "absolute",
    left: 0,
    top: 50,
    bottom: 20,
    width: 30,
    // invisible tap target along the left edge
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
  },
  logoLarge: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 10,
  },
  logoText: {
    fontSize: 23,
    marginRight: 3,
    marginTop: 4,
    fontFamily: "Poppins-ExtraBold",
    color: "#f0f0f0",
  },
  placeholder: {
    width: 60,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 4,
  },
  toggleContainerSmall: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 18,
    backgroundColor: "transparent",
    borderRadius: 22,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: "center",
  },
  toggleButtonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
    // subtle shadow to match raised pill look
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  toggleButtonTextSmall: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  toggleButtonTextActive: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  accountTypeTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#808080",
    fontFamily: "Poppins-Regular",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  forgotPasswordLink: {
    color: "#007AFF",
    marginTop: 3,
    fontFamily: "Poppins-Bold",
    textDecorationLine: "underline",
  },
  registerLinkContainer: {
    alignItems: "center",
  },
  inlineLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  registerLinkText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  registerLink: {
    color: "#007AFF",
    fontFamily: "Poppins-Bold",
    textDecorationLine: "underline",
  },
  accountTypeButton: {
    backgroundColor: "#0f6d00",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  accountTypeButtonSelected: {
    backgroundColor: "#0b5a00",
    borderWidth: 2,
    borderColor: "#0a7a00",
  },
  accountTypeButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  accountTypeButtonTextSelected: {
    color: "#fff",
  },
  bankButton: {
    backgroundColor: "#333",
  },
  bankButtonSelected: {
    backgroundColor: "#222",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  bankButtonText: {
    color: "white",
  },
  bankButtonTextSelected: {
    color: "#fff",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  loginLinkContainer: {
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 50,
  },
  loginLink: {
    color: "#007AFF",
    fontFamily: "Poppins-Bold",
    textDecorationLine: "underline",
    marginTop: 50,
  },
});
