import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Font from "expo-font";
import { useRouter } from "expo-router";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

const LoanApplicationSuccess = () => {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={agriangatLogo} style={styles.logo} />
          <View>
            <Text style={styles.logoBrand}>AgriAngat</Text>
            <Text style={styles.logoSubtitle}>Loan Application</Text>
          </View>
        </View>
      </View>

      {/* Success Content */}
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.description}>
          Your loan application has been successfully submitted. Our team will review your information and contact you within 3-5 business days.
        </Text>
        <Text style={styles.description}>
          You can track the status of your application in the "Services" section of the app.
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace("/(tabs)/services")}
        >
          <Text style={styles.buttonText}>Back to Services</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoanApplicationSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  logoBrand: {
    fontSize: 18,
    color: "#666",
    fontFamily: "Poppins-ExtraBold",
  },
  logoSubtitle: {
    fontSize: 9,
    color: "#666",
    fontFamily: "Poppins-Regular",
    marginTop: -2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  successIcon: {
    fontSize: 50,
    color: "#4CAF50",
    fontFamily: "Poppins-Bold",
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});