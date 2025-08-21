import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import terraces from "../../assets/images/rice-terraces.png";


export default function HomeScreen() {
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
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header with tappable logo and greeting */}
      <View style={styles.headerRow}>
        <Image source={agriangatLogo} style={styles.brandIcon} />
        <Text style={styles.greetingText}>Mabuhay!</Text>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <ImageBackground source={terraces} style={styles.heroImage}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert("AngatScore", "Coming soon")}
            style={styles.scorePillTouchable}
          >
            <BlurView intensity={3} tint="light" style={styles.scorePill}>
              <Text style={styles.scorePillText}>AngatScore</Text>
            </BlurView>
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroName}>Juan Dela Cruz</Text>
            {/* Circular progress ring */}
            <View style={styles.scoreRingContainer}>
              {(() => {
                const size = 170;
                const strokeWidth = 18;
                const radius = (size - strokeWidth) / 2;
                const circumference = 2 * Math.PI * radius;
                const score = 88; // 0-100
                const progress = Math.max(0, Math.min(100, score)) / 100; // clamp 0..1
                const dashOffset = circumference * (1 - progress);
                return (
                  <>
                    <Svg width={size} height={size}>
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#111"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#ff2d55"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        fill="none"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                      />
                    </Svg>
                    <View style={styles.scoreValueWrapper}>
                      <Text style={styles.scoreText}>88</Text>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>
        </ImageBackground>
      </View>

{/* Two stats + actions */}
<View style={styles.statRow}>
  {/* Left column: Balance + Button */}
  <View style={styles.leftCol}>
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>Balance</Text>
      <Text style={styles.statValue}>₱150,000.00</Text>
    </View>

    <TouchableOpacity style={styles.outlineBtn}>
      <Text style={styles.outlineBtnText}>Get new loan</Text>
    </TouchableOpacity>
  </View>

  {/* Right column: Due */}
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>Due Next 30 Days</Text>
    <Text style={styles.statValue}>₱5,000.00</Text>
    <TouchableOpacity style={styles.darkBtn}>
      <Text style={styles.darkBtnText}>Pay Now</Text>
    </TouchableOpacity>
  </View>
</View>


      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <TouchableOpacity style={styles.outlineBtn2}>
          <Text style={styles.outlineBtnText2}>See All</Text>
        </TouchableOpacity>
      </View>
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
  scorePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    marginTop: 10,
    marginLeft: 6,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    shadowColor: "#0f6d00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scorePillTouchable: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 9999,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  scorePillText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  heroName: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 21, top: 70 },
  scoreRingContainer: { width: 170, height: 170 },
  scoreValueWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  blurButtonWrapper: {
    borderRadius: 25,
    overflow: "hidden",
  },
  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(170, 152, 152, 0.4)",
  },
  pillButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  scoreText: { color: "#fff", fontFamily: "Poppins-ExtraBold", fontSize: 40 },
  statRow: { flexDirection: "row", gap: 12, marginTop: -50, marginBottom: 35 },
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
  outlineBtn2: {
    marginTop: -1,
    marginBottom: 3,
    borderWidth: 2,
    backgroundColor: "#fff",
    height: 35,
    paddingVertical: -5,
    paddingHorizontal: 24,
    minWidth: 140,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f6d00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlineBtnText: { color: "#111", fontFamily: "Poppins-Bold", fontSize: 12 },
  outlineBtnText2: {
    color: "#0f6d00",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  darkBtn: {
    marginTop: 10,
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },
  darkBtnText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 22,
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
