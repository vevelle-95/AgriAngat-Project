import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Font from "expo-font";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import terraces from "../../assets/images/rice-terraces.png";


export default function HomeScreen() {
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header with tappable logo and greeting */}
      <View style={styles.headerRow}>
        <Image source={agriangatLogo} style={styles.brandIcon} />
        <Text style={styles.greetingText}>Mabuhay!</Text>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <Image source={terraces} style={styles.heroImage} />
        <View style={styles.heroContent}>
          <Text style={styles.heroName}>Juan Dela Cruz</Text>
          {/* Simple circular badge for score placeholder */}
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>88</Text>
          </View>
        </View>
      </View>

      {/* Two stats + actions */}
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>₱150,000.00</Text>
          <TouchableOpacity style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>Get new loan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Due Next 30 Days</Text>
          <Text style={styles.statValue}>₱5,000.00</Text>
          <TouchableOpacity style={styles.darkBtn}>
            <Text style={styles.darkBtnText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transactions</Text>
      {/* Simple list mock */}
      <View style={styles.txCard}>
        <View style={styles.txRow}>
          <View>
            <Text style={styles.txTitle}>Cash-out to</Text>
            <Text style={styles.txSub}>InstaPay</Text>
          </View>
          <View>
            <Text style={styles.txAmount}>₱50,000.00</Text>
            <Text style={styles.txDate}>Sept 10,2025</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.txRow}>
          <View>
            <Text style={styles.txTitle}>Received Loan 0002 from</Text>
            <Text style={styles.txSub}>BPI Loan</Text>
          </View>
          <View>
            <Text style={styles.txAmount}>₱50,000.00</Text>
            <Text style={styles.txDate}>Sept 10,2025</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.txRow}>
          <View>
            <Text style={styles.txTitle}>Paid Loan 0001 to</Text>
            <Text style={styles.txSub}>BPI Loan</Text>
          </View>
          <View>
            <Text style={styles.txAmount}>₱5,000.00</Text>
            <Text style={styles.txDate}>July 10,2025</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 120,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  brandIcon: { width: 50, height: 50, borderRadius: 6, top: -60 },
  greetingText: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 22,
    color: "#111",
    top: -60,
    marginRight: 5
  },
  heroCard: { borderRadius: 14, overflow: "hidden", backgroundColor: "#eee", top: -65 },
  heroImage: { width: "100%", height: 210 },
  heroContent: {
    position: "absolute",
    top: 20,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroName: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 18, top: 30 },
  scoreCircle: {
    width: 170,
    height: 170,
    borderRadius: 95,
    backgroundColor: "#ff2d55",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 10,
    borderColor: "#111",
  },
  scoreText: { color: "#fff", fontFamily: "Poppins-ExtraBold", fontSize: 40 },
  statRow: { flexDirection: "row", gap: 12, marginTop: -35 },
  statCard: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    borderRadius: 14,
    padding: 12,
  },
  statLabel: { color: "#666", fontFamily: "Poppins-Regular", fontSize: 11 },
  statValue: {
    color: "#0f6d00",
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
    marginTop: 4,
  },
  outlineBtn: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#111",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },
  outlineBtnText: { color: "#111", fontFamily: "Poppins-Bold", fontSize: 12 },
  darkBtn: {
    marginTop: 10,
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },
  darkBtnText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 12 },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
    color: "#111",
  },
  txCard: { backgroundColor: "#f6f6f6", borderRadius: 14, padding: 12 },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  txTitle: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#666" },
  txSub: { fontFamily: "Poppins-Bold", fontSize: 13, color: "#111" },
  txAmount: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#0f6d00",
    textAlign: "right",
  },
  txDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#666",
    textAlign: "right",
  },
  divider: { height: 1, backgroundColor: "#ddd" },
});
