import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import aalogo from "../assets/images/agriangat-nobg-logo.png";

export default function DataPrivacyConsentScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [consents, setConsents] = useState({
    dataProcessing: false,
    privacyPolicy: false,
    analytics: false,
  });
  const router = useRouter();

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const toggleConsent = (key) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAcceptAll = () => {
    setConsents({
      dataProcessing: true,
      privacyPolicy: true,
      analytics: true,
    });
  };

  // Check if user can proceed (required consents agreed)
  const canProceed = consents.dataProcessing && consents.privacyPolicy;

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header with agricultural illustration */}
      <View style={styles.headerContainer}>
        <View style={styles.illustrationContainer}>
          {/* AgriAngat Logo */}
          <Image 
            source={aalogo}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* AgriAngat Branding */}
      <View style={styles.brandingContainer}>
        <Text style={styles.brandName}>AgriAngat</Text>
        <Text style={styles.tagline}>Sistemang Tapat, Aangat Lahat!</Text>
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>Your Farm. Your Data.</Text>
      <Text style={styles.description}>
        Your personal and farm data will never be sold to third parties. Only AgriAngat and your chosen lending partner may access it, solely for loan evaluation and support services. You can request to delete your data at any time.
      </Text>

      {/* Consent Options */}
      <View style={styles.consentContainer}>
        {/* Required Consent 1 */}
        <View style={styles.consentItem}>
          <TouchableOpacity 
            style={[styles.checkbox, consents.dataProcessing && styles.checkedBox]}
            onPress={() => toggleConsent('dataProcessing')}
          >
            {consents.dataProcessing && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.consentTextContainer}>
            <Text style={styles.consentText}>
              <Text style={styles.requiredText}>*Required:</Text>  I agree to the processing of my personal, financial, and ESG data for the purpose of loan scoring and providing AgriAngat app functions.
            </Text>
          </View>
        </View>

        {/* Required Consent 2 */}
        <View style={styles.consentItem}>
          <TouchableOpacity 
            style={[styles.checkbox, consents.privacyPolicy && styles.checkedBox]}
            onPress={() => toggleConsent('privacyPolicy')}
          >
            {consents.privacyPolicy && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.consentTextContainer}>
            <Text style={styles.consentText}>
              <Text style={styles.requiredText}>*Required:</Text> I agree to the 
              <Text style={styles.linkText} onPress={() => router.push("+not-found")}>Privacy Policy</Text> and 
              <Text style={styles.linkText} onPress={() => router.push("+not-found")}>Terms of Use</Text>.
            </Text>
          </View>
        </View>

        {/* Optional Consent */}
        <View style={styles.consentItem}>
          <TouchableOpacity 
            style={[styles.checkbox, consents.analytics && styles.checkedBox]}
            onPress={() => toggleConsent('analytics')}
          >
            {consents.analytics && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.consentTextContainer}>
            <Text style={styles.consentText}>
              <Text style={styles.optionalText}>Optional:</Text> I agree to allow AgriAngat to collect anonymous app usage activity (e.g., logins, training module completion, crop marketplace listings). This helps AgriAngat improve its features and offer better services. No sensitive personal or financial information will be shared without my consent.
            </Text>
          </View>
        </View>

        {/* Compliance Note */}
        <View style={styles.complianceNote}>
          <View style={styles.complianceHeader}>
            <Text style={styles.farmIcon}>🛡️</Text>
            <Text style={styles.complianceTitle}>Data Protection Guarantee</Text>
          </View>
          <Text style={styles.complianceText}>
            All data is handled in compliance with the Philippines Data Privacy Act of 2012 (RA 10173).. Your agricultural information is protected with bank-level security.
          </Text>
        </View>
      </View>

      {/* Accept All Button */}
      <TouchableOpacity 
        style={styles.acceptAllButton}
        onPress={handleAcceptAll}
      >
        <Text style={styles.acceptAllText}>Accept all</Text>
      </TouchableOpacity>

      {/* Login/Sign Up Section - Only enabled when required consents are agreed */}
      {canProceed ? (
        <View style={styles.authButtonsContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push("login?mode=register")}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.continueButton, styles.disabledButton]}
          disabled={true}
        >
          <Text style={[styles.continueButtonText, styles.disabledText]}>
            Please agree to required consents to continue
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fdf8", // Light green agricultural background
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  illustrationContainer: {
    position: "relative",
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 35,
    marginLeft: -220
  },
  brandingContainer: {
    alignItems: "center",
  },
  brandName: {
    fontSize: 40,
    fontFamily: "Poppins-ExtraBold",
    color: "#2E7D32",
    textAlign: "center",
    marginLeft: 90,
    marginTop: -180
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#4CAF50",
    textAlign: "center",
    marginTop: -72,
    marginLeft: 95
  },
  title: {
    fontSize: 25,
    fontFamily: "Poppins-Bold",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 25,
    marginTop: -70
  },
  description: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#2E5D32",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 35,
    marginTop: -10,
    paddingHorizontal: 20
  },
  consentContainer: {
    marginBottom: 25,
  },
  consentItem: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#81C784",
    marginRight: 14,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkedBox: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  consentTextContainer: {
    flex: 1,
  },
  consentText: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#2E5D32",
    lineHeight: 22,
  },
  requiredText: {
    color: "#D32F2F",
    fontFamily: "Poppins-SemiBold",
  },
  optionalText: {
    color: "#FF9800",
    fontFamily: "Poppins-SemiBold",
  },
  linkText: {
    color: "#388E3C",
    fontFamily: "Poppins-SemiBold",
    textDecorationLine: "underline",
  },
  complianceNote: {
    marginTop: 15,
    padding: 20,
    backgroundColor: "#E8F5E8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  complianceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  farmIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  complianceTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1B5E20",
  },
  complianceText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#2E7D32",
    lineHeight: 20,
  },
  acceptAllButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: "center",
    marginBottom: 20,
  },
  acceptAllText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#4CAF50",
  },
  authButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flex: 0.45,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flex: 0.45,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    alignSelf: "center",
    minWidth: 220,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#C8E6C9",
  },
  disabledText: {
    color: "#81C784",
  },
});
