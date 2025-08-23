import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

export default function FarmerWelcomeScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-ExtraBold": require("../../assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 36 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>WELCOME!</Text>

      <Text style={styles.bodyText}>
      Your account is now ready. Start exploring tools to grow your farm, boost your AngatScore, and connect with new opportunities.
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tip}>
      Tip: Complete your profile and learn from the Study Hub to make the most of your AgriAngat journey.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 24 },

  headerRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brandIcon: { width: 65, height: 65, borderRadius: 16, marginTop: 60 },

  headerTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 75,
  },

  bodyText: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 15,
    marginTop: 40,
  },

  actionsRow: {
    alignItems: "center",
    marginTop: 24,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: "center",
    marginTop: 30,
  },
  primaryButton: { backgroundColor: "#111", marginTop: 220 },
  primaryText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 15 },
  tip: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 15,
    marginTop: 40,
  }
});
