import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import terraces from "../assets/images/rice-terraces.png";

export default function WelcomeScreen() {
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 36 }}>
      <View style={styles.headerRow}>
        <Image source={agriangatLogo} style={styles.brandIcon} />
        <Text style={styles.headerTitle}>Welcome</Text>
        <View style={{ width: 40 }} />
      </View>

      <ImageBackground source={terraces} style={styles.heroImage} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Great to see you again!</Text>
          <Text style={styles.heroSub}>You're signed in to AgriAngat.</Text>
        </View>
      </ImageBackground>

      <Text style={styles.bodyTitle}>What would you like to do?</Text>
      <Text style={styles.bodyText}>Jump right into your dashboard or explore services and marketplace.</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => router.replace("/(tabs)/home")}>
          <Text style={styles.primaryText}>Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.replace("/(tabs)/marketplace")}>
          <Text style={styles.secondaryText}>Marketplace</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  brandIcon: { width: 28, height: 28, borderRadius: 8 },
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 18, color: "#111" },
  heroImage: { width: "100%", height: 200, marginBottom: 16 },
  heroOverlay: { flex: 1, justifyContent: "flex-end", padding: 14 },
  heroTitle: { color: "#fff", fontFamily: "Poppins-ExtraBold", fontSize: 20 },
  heroSub: { color: "#fff", fontFamily: "Poppins-Regular", fontSize: 12 },
  bodyTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 18, color: "#111", marginBottom: 8 },
  bodyText: { fontFamily: "Poppins-Regular", fontSize: 13, color: "#555" },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  button: { flex: 1, borderRadius: 24, paddingVertical: 12, alignItems: "center" },
  primaryButton: { backgroundColor: "#111" },
  secondaryButton: { backgroundColor: "#f0f0f0", borderWidth: 1, borderColor: "#ddd" },
  primaryText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 14 },
  secondaryText: { color: "#111", fontFamily: "Poppins-Bold", fontSize: 14 },
});


