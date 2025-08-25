import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import terraces from "../../assets/images/rice-terraces.png";
// @ts-ignore
import rings from "../../assets/images/riring.png";
import redsky from "../../assets/images/skyhalf-red.png";
import greenBag from "../../assets/images/green-bag.png";
import basket from "../../assets/images/baskets.png";


export default function HomeScreen() {
  const { colors } = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const [currentReminder, setCurrentReminder] = useState(0);
  const remScrollRef = useRef(null);
  const CARD_WIDTH = Dimensions.get("window").width - 32;
  const reminders = [
    {
      id: "r1",
      title: "Grow more than crops. Grow your chances.",
      body: "Boost your AngatScore by farming smarter and paying loans on time.",
      tint: "#d7ffd4",
    },
    {
      id: "r2",
      title: "Rainy Season Alert: Farm with Caution",
      body: "PAGASA forecasts up to 16 tropical cyclones from AUG to DEC. Ensure you plant short-cycle crops like munggo or pechay, reinforce your fields and storage, and consider early loan access to prepare before weather disrupts supply chains.",
      tint: "#ffdb24",
    },
    {
      id: "r3",
      title: "Sell fresh, buy fresh.",
      body: "With our Marketplace, farmers connect directly to stores and buyers nearby. No extra layers, no unfair markups",
      tint: "#0ca201",
      fontColor: "#fff",
    },
  ];

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

  // Auto-advance reminders
  useEffect(() => {
    if (!remScrollRef.current) return;
    const interval = setInterval(() => {
      const next = (currentReminder + 1) % reminders.length;
      remScrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
      setCurrentReminder(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentReminder, reminders.length, CARD_WIDTH]);

  if (!fontsLoaded) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header with tappable logo and greeting */}
      <View style={styles.headerRow}>
        <Image source={agriangatLogo} style={styles.brandIcon} />
        <Text style={[styles.greetingText, { color: colors.text }]}>Mabuhay!</Text>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <ImageBackground source={terraces} style={styles.heroImage}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/angatscore-explainer")}
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
                    {/* Increase Button below the score */}
                    <TouchableOpacity 
                      style={styles.increaseButton}
                      onPress={() => router.push("/increase-angatscore")}
                    >
                      <Text style={styles.increaseButtonText}>Increase</Text>
                    </TouchableOpacity>
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

          <TouchableOpacity 
            style={styles.outlineBtn}
            onPress={() => router.push("/loan-application")}
          >
            <Text style={styles.outlineBtnText}>Get new loan</Text>
          </TouchableOpacity>
        </View>

        {/* Right column: Due */}
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Due Next 30 Days</Text>
          <Text style={styles.statValue}>₱5,000.00</Text>
          <TouchableOpacity 
            style={styles.darkBtn}
            onPress={() => router.push("/loan-payment")}
          >
            <Text style={styles.darkBtnText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <TouchableOpacity 
          style={styles.outlineBtn2}
          onPress={() => router.push("/loan-transactions")}
        >
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

      {/* Reminders carousel */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { marginTop: 5, marginLeft: 10, marginBottom: -20 }]}>Reminders</Text>
      </View>
      <ScrollView
        ref={remScrollRef}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setCurrentReminder(index);
        }}
        contentContainerStyle={styles.remScroll}
      >
        {/* Welcome card with rings and basket image */}
        <View style={[styles.welcomeCard, { width: CARD_WIDTH, position: 'relative' }]}>
          {/* Background rings with basket inside */}
          <View style={styles.backgroundRingsContainer}>
            <Image source={rings} style={styles.backgroundRings} />
            <Image source={basket} style={styles.basketImageInside} />
          </View>

          {/* Content on left */}
          <View style={styles.welcomeContentContainer}>
            <Text style={[styles.welcomeTitle, { marginTop: 30 }]}>Grow more than </Text>
            <Text style={styles.welcomeTitle}>crops. Grow your</Text>
            <Text style={[styles.welcomeTitle, { marginBottom: 10 }]}>chances.</Text>
            <Text style={[styles.welcomeSub, { color: "#0f6d00" }]}>Boost your </Text>
            <Text style={[styles.welcomeSub, { color: "#0f6d00" }]}>
              <Text style={[styles.welcomeSub, { fontFamily: "Poppins-Bold", color: "#0f6d00" }]}>AngatScore</Text> by
            </Text>
            <Text style={[styles.welcomeSub, { color: "#0f6d00" }]}>farming smarter and</Text>
            <Text style={[styles.welcomeSub, { color: "#0f6d00" }]}>paying loans on time.</Text>
          </View>
        </View>

        {/* Fixed second card - removed duplicate structure */}
        <TouchableOpacity 
          style={[styles.welcomeCard, { width: CARD_WIDTH, backgroundColor: "#ffdb24" }]}
          onPress={() => router.push("/weather-analysis")}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.welcomeTitle, { fontFamily: "Poppins-ExtraBold", marginBottom: 10 }]}>Rainy Season Alert: Farm with Caution</Text>
            <Text style={[styles.welcomeSub, { color: "#0a0b0a", marginTop: -4, fontSize: 10 }]}>PAGASA forecasts up to 16 tropical cyclones from AUG to DEC. Ensure you plant short-cycle crops like munggo or pechay, reinforce your fields and storage, and consider early loan access to prepare before weather disrupts supply chains.</Text>
          </View>
          <View style={styles.welcomeImageContainer}>
            <Image source={redsky} style={styles.weatherImage} />
          </View>
        </TouchableOpacity>

        <View style={[styles.welcomeCard, { width: CARD_WIDTH, backgroundColor: "#0ca201" }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.welcomeTitle, { color: "#ffffff", marginBottom: 2, fontSize: 17 }]}>Sell fresh, buy fresh.</Text>
            <Text style={[styles.welcomeSub, { color: "#ffffff", marginBottom: 10, fontSize: 10 }]}>With our Marketplace, farmers connect directly to stores and buyers nearby. No extra layers, no unfair markups</Text>
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => router.push("/(tabs)/marketplace")}
            >
              <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeImageContainer}>
            <Image source={greenBag} style={styles.welcomeImage} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.remDotsWrap}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.remDot, i === currentReminder && styles.remDotActive]} />
        ))}
      </View>

      {/* Upcoming Payments */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Payments</Text>
        <TouchableOpacity 
          style={styles.outlineBtn2}
          onPress={() => router.push("/upcoming-payments")}
        >
          <Text style={styles.outlineBtnText2}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.upCard}>
        <View style={styles.upRow}>
          <View>
            <Text style={styles.upLoan}>Loan: 00001</Text>
            <Text style={styles.upMeta}>Date: Aug 10,2025</Text>
            <Text style={styles.upAmount}>₱5,000.00</Text>
            <Text style={styles.upMeta}>Due: Sept 10,2025</Text>
          </View>
          <TouchableOpacity 
            style={styles.payPill}
            onPress={() => router.push("/loan-payment")}
          >
            <Text style={styles.payPillText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.upRow}>
          <View>
            <Text style={styles.upLoan}>Loan: 00002</Text>
            <Text style={styles.upMeta}>Date: Aug 10,2025</Text>
            <Text style={styles.upAmount}>₱5,000.00</Text>
            <Text style={styles.upMeta}>Due: Oct 10,2025</Text>
          </View>
          <TouchableOpacity 
            style={styles.payPill}
            onPress={() => router.push("/loan-payment")}
          >
            <Text style={styles.payPillText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.upRow}>
          <View>
            <Text style={styles.upLoan}>Loan: 00003</Text>
            <Text style={styles.upMeta}>Date: Aug 10,2025</Text>
            <Text style={styles.upAmount}>₱5,000.00</Text>
            <Text style={styles.upMeta}>Due: Nov 10,2025</Text>
          </View>
          <TouchableOpacity 
            style={styles.payPill}
            onPress={() => router.push("/loan-payment")}
          >
            <Text style={styles.payPillText}>Pay Now</Text>
          </TouchableOpacity>
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
    marginTop: -10,
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
  increaseButton: {
    position: "absolute",
    bottom: -15,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  increaseButtonText: {
    color: "#0f6d00",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    textAlign: "center",
  },
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
    fontSize: 20,
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
    minWidth: 100,
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
    fontSize: 12,
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
    fontSize: 19,
    color: "#111",
  },
  txCard: { backgroundColor: "#f6f6f6", borderRadius: 14, padding: 12 },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  txTitle: { fontFamily: "Poppins-Bold", fontSize: 13, color: "#666" },
  txSub: { fontFamily: "Poppins-ExtraBold", fontSize: 13, color: "#111" },
  txAmount: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
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
  remScroll: { paddingBottom: 6 },
  remCard: {
    height: 170,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  remTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
    marginBottom: 6,
  },
  remBody: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#174c1a",
  },
  remDotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    gap: 6,
  },
  remDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#cfd8cf",
  },
  remDotActive: {
    width: 18,
    backgroundColor: "#0f6d00",
  },
  upCard: {
    backgroundColor: "#f6f6f6",
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  upRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  upLoan: { fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "#111" },
  upMeta: { fontFamily: "Poppins-Regular", fontSize: 10, color: "#666", marginBottom: 5 },
  upAmount: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
    color: "#0f6d00",
    marginTop: 2,
  },
  payPill: {
    backgroundColor: "#111",
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  payPillText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0FFE0",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    marginBottom: 10,
    height: 190,
    // Allow rings to extend beyond card boundaries
  },

  // NEW STYLES FOR OVERLAPPING RINGS
  backgroundRingsContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: 30,
    right: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  backgroundRings: {
    width: 150,
    height: 155,
    marginLeft: 48,
    marginBottom: -45,
    transform: [{ rotate: "360deg" }],
  },

  welcomeContentContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    zIndex: 2, // Ensure content is above rings
  },

  welcomeTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
    marginBottom: 0,
  },
  welcomeSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#174c1a",
  },
  welcomeImageContainer: {
    position: "relative",
  },
  welcomeImage: {
    width: 160,
    height: 170,
    marginLeft: 15,
    marginRight: -20,
  },
  weatherImage: {
    width: 130,
    height: 150,
    marginRight: -30,
  },
  shopNowButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shopNowButtonText: {
    color: "#0ca201",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  basketImage: {
    width: 140,
    height: 140,
    marginLeft: 12,
    marginRight: -13,
    marginTop: 52
  },
  basketImageInside: {
    position: 'absolute',
    width: 140,
    height: 140,
    top: 27,
    left: 19,
    zIndex: 2,
  },
  greenCurveBackground: {
    position: 'absolute',
    right: -80,
    top: -50,
    bottom: -50,
    width: 300,
    height: 300,
    backgroundColor: '#7ED321',
    borderRadius: 150,
    zIndex: 1,
  },
});