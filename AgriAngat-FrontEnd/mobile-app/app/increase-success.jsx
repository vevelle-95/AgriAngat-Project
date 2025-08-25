import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import aalogo from "../assets/images/agriangat-nobg-logo.png";

export default function IncreaseSuccess() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo/Icon Section */}
        <View style={styles.iconContainer}>
          <View style={styles.logoCircle}>
            <Image source={aalogo} style={styles.logoIcon} />
          </View>
        </View>

        {/* Thank You Title */}
        <Text style={styles.titleText}>Thank You!</Text>

        {/* Success Message */}
        <Text style={styles.messageText}>
          Kinakalkula na namin ang iyong bagong AngatScore. Bumalik lamang sa ilang sandali para makita ang pagtaas ng iyong AngatScore at ang mga pre-approved loan offer mo!
        </Text>

        {/* Exit Button */}
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  titleText: {
    fontSize: 32,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
  },
  messageText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 80,
    paddingHorizontal: 10,
  },
  exitButton: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: "transparent",
  },
  exitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    textAlign: "center",
  },
});
