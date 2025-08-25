import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// @ts-ignore
import page1 from "../assets/images/increase-page1.png";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function IncreaseAngatScore() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

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
      
      {/* Header with fading background */}
      <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Image Display Section - At the top */}
        <View style={styles.imageSection}>
          <Image source={page1} style={styles.page1Image} resizeMode="contain" />
        </View>

        {/* Content Area with gradient starting at top of title */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)', 
            'rgba(255,255,255,0.4)', 
            'rgba(255,255,255,0.8)', 
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
          ]}
          locations={[0, 0.05, 0.1, 0.15, 0.3, 0.8, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.contentGradient}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.mainTitle}>Increase AngatScore</Text>
            <Text style={styles.description}>
              Para tumaas ang iyong score at makakuha ng mas magandang loan offer, magbahagi lamang ng karagdagang impormasyon tungkol sa iyong mga gawain sa pagsasaka at sa inyong komunidad. Tatagal lamang ito ng 2-5 minuto.
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/financial-health")}>
                <Text style={styles.nextButtonText}>Next</Text>
                <Text style={styles.nextArrow}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(242,242,242,0.9)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 20,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  imageSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: -10,
    marginTop: 20,
    marginRight: 0,
    backgroundColor: "#fff",
  },
  page1Image: {
    width: screenWidth,
    height: screenHeight,
    marginBottom: -350,
    backgroundColor: "transparent",
  },
  contentGradient: {
    zIndex: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    marginTop: -20,
  },
  contentContainer: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginTop: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 22,
    marginBottom: 25,
  },
  buttonContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  nextButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 9999,
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  nextArrow: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});
