import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import rings from "../../assets/images/rings.png";
import redsky from "../../assets/images/skyhalf-red.png";
import greenBag from "../../assets/images/green-bag.png";
import marketplace from "../../assets/images/aa-marketplace.png";
import skyblue from "../../assets/images/sky-blue.png";
import hub from "../../assets/images/study-hub.png";

export default function ServicesScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const CARD_WIDTH = Dimensions.get("window").width - 32;
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSlides = 3;
  const heroScrollRef = useRef(null);
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
  useEffect(() => {
    if (!heroScrollRef.current) return;
    const id = setInterval(() => {
      const next = (heroIndex + 1) % heroSlides;
      heroScrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
      setHeroIndex(next);
    }, 4000);
    return () => clearInterval(id);
  }, [heroIndex, heroSlides, CARD_WIDTH]);
  if (!fontsLoaded) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Welcome/Hero carousel */}
      <ScrollView
        ref={heroScrollRef}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setHeroIndex(index);
        }}
        contentContainerStyle={styles.heroScroll}
      >
        {/* FIXED: Welcome card with overlapping background */}
        <View style={[styles.serviceCard, { width: CARD_WIDTH, position: 'relative' }]}>
          {/* Background image positioned absolutely */}
          <View style={styles.backgroundImageContainer}>
            <Image source={rings} style={styles.backgroundImage} />
          </View>

          {/* Content on top */}
          <View style={styles.welcomeContentContainer}>
            <Text style={[styles.serviceTitle, { marginBottom: -5, marginTop: -20, fontSize: 20 }]}>Welcome to</Text>
            <Text style={[styles.serviceTitle, { fontSize: 20 }]}>AgriAngat Services!</Text>
            <Text style={[styles.serviceSub, { marginBottom: -5, marginTop: 20, color: "#0CA201", fontSize: 15, fontFamily: "Poppins-ExtraBold" }]}>See how we can help you</Text>
          </View>
        </View>

        <View style={[styles.serviceCard, { width: CARD_WIDTH, backgroundColor: "#FFDB24" }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.serviceTitle, { fontFamily: "Poppins-ExtraBold" }]}>Rainy Season Alert: Farm with Caution</Text>
            <Text style={[styles.serviceSub, { color: "#0a0b0a" }]}>PAGASA forecasts up to 16 tropical cyclones from AUG to DEC. Ensure to prepare or stock before weather disrupts supply chains.</Text>
          </View>
          <View style={styles.serviceImageContainer}>
            <Image source={redsky} style={styles.serviceImage} />
          </View>
        </View>
        <View style={[styles.serviceCard, { width: CARD_WIDTH, backgroundColor: "#0ca201" }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.serviceTitle, { color: "#ffffff" }]}>Sell fresh, buy fresh.</Text>
            <Text style={[styles.serviceSub, { color: "#ffffff" }]}>
              With our Marketplace, farmers connect directly to stores and buyers nearby. No extra layers, no unfair markups
            </Text>
            <View style={styles.serviceLogo}>
              <Image source={marketplace} style={styles.logoIcon} />
            </View>
          </View>
          <View style={styles.serviceImageContainer}>
            <Image source={greenBag} style={styles.serviceImage} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.dotsWrap}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === heroIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Action tiles */}
      <View style={styles.tilesRow}>
        <View style={styles.tile}>
          <Image source={rings} style={{ width: 50, height: 50, marginTop: -10 }} />
          <Text style={styles.tileTitle}>Apply for</Text>
          <Text style={styles.tileTitle}>Loan</Text>
          <Text style={styles.tileSub}>
            Apply for loan offered by our partners
          </Text>
          <TouchableOpacity
            style={styles.ctaDark}
            onPress={() => router.push("/loan-application")}
          >
            <Text style={styles.ctaDarkText}>Apply now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tile}>
          <Image source={skyblue} style={{ width: "25%", height: 30, marginBottom: 5 }} />
          <Text style={styles.tileTitle}>Weather & Analysis</Text>
          <Text style={styles.tileSub}>
            Check weather, forecasts and insights.
          </Text>
          <TouchableOpacity
            style={styles.ctaLight}
            onPress={() => router.push("/weather-analysis")}
          >
            <Text style={styles.ctaLightText}>Check now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tileFull}>
        <Image source={hub} style={{ width: "10%", height: 35, marginBottom: 5 }} />
        <Text style={styles.tileTitle}>Study Hub</Text>
        <Text style={styles.tileSub}>
          Learn tips and how-tos from AgriAngat videos and the AgriAngat
          Assistant.
        </Text>
        <TouchableOpacity
          style={styles.ctaDark}
          onPress={() => router.push("/study-hub-videos")}
        >
          <Text style={styles.ctaDarkText}>Learn now</Text>
        </TouchableOpacity>
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
    paddingTop: 13,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: -4,
  },
  brandIcon: { width: 50, height: 50, borderRadius: 6, marginTop: 41 },
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 24, color: "#111", marginTop: 41, marginLeft: 192 },

  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6FFD6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    overflow: 'hidden', // Prevents background image from extending beyond card bounds
  },

  // NEW STYLES FOR OVERLAPPING BACKGROUND
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    zIndex: 1,
  },

  backgroundImage: {
    width: 300,
    height: 500,
    marginTop: -20,
    marginRight: -100,
    transform: [{ rotate: "97deg" }],
  },

  welcomeContentContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    zIndex: 2, // Ensure content is above image
  },

  serviceTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#0A0B0A",
    marginBottom: 2,
  },
  serviceSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#0CA201",
    marginBottom: 12,
  },
  serviceLogo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: "60%",
    height: 50,
    marginRight: 18,
    marginTop: -5,
  },
  serviceImageContainer: {
    position: "relative",
  },
  serviceImage: {
    width: 130,
    height: 150,
    marginRight: -30,
  },
  heroTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#111",
    marginBottom: 0,
  },
  heroSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginTop: 10,
    color: "#174c1a",
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginLeft: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  heroScroll: { paddingBottom: 6 },
  dotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#cfd8cf" },
  dotActive: { width: 18, backgroundColor: "#0f6d00", borderRadius: 3 },

  tilesRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  tile: { flex: 1, backgroundColor: "#f6f6f6", borderRadius: 12, padding: 12 },
  tileTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 20, color: "#111" },
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