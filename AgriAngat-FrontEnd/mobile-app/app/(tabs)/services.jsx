import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import terraces from "../../assets/images/rice-terraces.png";

export default function ServicesScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Welcome/Hero */}
      <View style={styles.heroCard}>
        <View>
          <Text style={styles.heroTitle}>Welcome to AgriAngat Services!</Text>
          <Text style={styles.heroSub}>See how we can help you</Text>
        </View>
        <Image source={terraces} style={styles.heroImage} />
      </View>

      {/* Action tiles */}
      <View style={styles.tilesRow}>
        <View style={styles.tile}>
          <Text style={styles.tileTitle}>Apply for Loan</Text>
          <Text style={styles.tileSub}>
            Apply for loan offered by our partners
          </Text>
          <View style={styles.ctaDark}>
            <Text style={styles.ctaDarkText}>Apply now</Text>
          </View>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileTitle}>Weather & Analysis</Text>
          <Text style={styles.tileSub}>
            Check weather, forecasts and insights.
          </Text>
          <View style={styles.ctaLight}>
            <Text style={styles.ctaLightText}>Check now</Text>
          </View>
        </View>
      </View>

      <View style={styles.tileFull}>
        <Text style={styles.tileTitle}>Study Hub</Text>
        <Text style={styles.tileSub}>
          Learn tips and how-tos from AgriAngat videos and the AgriAngat
          Assistant.
        </Text>
        <View style={styles.ctaDark}>
          <Text style={styles.ctaDarkText}>Learn now</Text>
        </View>
      </View>

      {/* In-screen quick nav removed (tab bar already present) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  brandIcon: { width: 50, height: 50, borderRadius: 6, marginTop: 46 },
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 24, color: "#111", marginTop: 45, marginLeft: 192 },

  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBFBEA",
    borderRadius: 14,
    padding: 12,
  },
  heroTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "#111" },
  heroSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  heroImage: { width: 90, height: 70, borderRadius: 10, marginLeft: 8 },

  tilesRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  tile: { flex: 1, backgroundColor: "#f6f6f6", borderRadius: 12, padding: 12 },
  tileTitle: { fontFamily: "Poppins-Bold", fontSize: 13, color: "#111" },
  tileSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  ctaDark: {
    alignSelf: "flex-start",
    backgroundColor: "#111",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginTop: 8,
  },
  ctaDarkText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 12 },
  ctaLight: {
    alignSelf: "flex-start",
    backgroundColor: "#e9e9e9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginTop: 8,
  },
  ctaLightText: { color: "#111", fontFamily: "Poppins-Bold", fontSize: 12 },

  tileFull: {
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
});
