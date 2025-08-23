import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function WeatherAnalysisScreen() {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Weather & Analysis</Text>

      {/* Current Weather Card - Blue Design */}
      <View style={styles.currentWeatherCard}>
        <Text style={styles.weatherLocation}>My Location</Text>
        <Text style={styles.weatherCity}>Tayabas, Quezon</Text>
        <Text style={styles.weatherCondition}>Partly Cloudy</Text>

        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>26°C</Text>
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Humidity</Text>
            <Text style={styles.weatherDetailValue}>75%</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Wind</Text>
            <Text style={styles.weatherDetailValue}>12 km/h</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Rain Chance</Text>
            <Text style={styles.weatherDetailValue}>20%</Text>
          </View>
        </View>
      </View>

      {/* 3-Day Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3-Day Forecast</Text>
        <View style={styles.forecastContainer}>
          <View style={styles.forecastItem}>
            <Text style={styles.forecastDay}>Today</Text>
            <Image source={require("../assets/images/sun.png")} style={styles.forecastIcon} />
            <Text style={styles.forecastCondition}>Partly Cloudy</Text>
            <Text style={styles.forecastTemp}>26°C - 32°C</Text>
          </View>
          <View style={styles.forecastItem}>
            <Text style={styles.forecastDay}>Thu</Text>
            <Image source={require("../assets/images/rain.png")} style={styles.forecastIcon2} />
            <Text style={styles.forecastCondition}>Rainy</Text>
            <Text style={styles.forecastTemp}>24°C - 28°C</Text>
          </View>
          <View style={styles.forecastItem}>
            <Text style={styles.forecastDay}>Fri</Text>
            <Image source={require("../assets/images/rain.png")} style={styles.forecastIcon2} />
            <Text style={styles.forecastCondition}>Rainy</Text>
            <Text style={styles.forecastTemp}>23°C - 27°C</Text>
          </View>
        </View>
      </View>

      {/* Crop Advisories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginTop: 10, fontSize: 20, fontFamily: "Poppins-Bold" }]}>Crop Advisories</Text>

        {/* Rice Advisory */}
        <View style={[styles.advisoryCard, { backgroundColor: "#ffb6c1" }]}>
          <Text style={styles.advisoryTitle}>Rice (Palay) Advisory</Text>
          <Text style={styles.advisoryDescription}>
            Expect Moderate rainfall next week. Ensure proper drainage to prevent waterlogging. Monitor for pest activity during wet periods.
          </Text>
        </View>

        {/* Corn Advisory */}
        <View style={[styles.advisoryCard, { backgroundColor: "#ffb6c1" }]}>
          <Text style={styles.advisoryTitle}>Corn (Mais) Advisory</Text>
          <Text style={styles.advisoryDescription}>
            Monitor for armyworm infestations as temperature rise. Apply organic pesticides if necessary.
          </Text>
        </View>

        {/* Banana Advisory */}
        <View style={[styles.advisoryCard, { backgroundColor: "#ecfadc" }]}>
          <Text style={[styles.advisoryTitle, { color: "#0a8701" }]}>Banana (Saging) Advisory</Text>
          <Text style={styles.advisoryDescription}>
            Moderate wind and warm temperatures support ideal fruit development. Maintain consistent watering and monitor for fungal diseases.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
  <Text
    style={[
      styles.sectionTitle,
      {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        marginTop: 30,
      },
    ]}
  >
    Find more Crop Care tips and sustainable farming practices in Study Hub.
  </Text>

  {/* Card (display only, not clickable) */}
  <View style={styles.studyHubCard}>
    <Image
      source={require("../assets/images/study-hub.png")}
      style={styles.studyHubIcon}
    />
    <View style={styles.studyHubContent}>
      <Text style={styles.studyHubTitle}>Study Hub</Text>
      <Text style={styles.studyHubSubtitle}>
      Learn tips and how-tos from AgriAngat videos and the AgriAngat Assistant      </Text>
    </View>
  </View>

  {/* Learn More button → navigates to Study Hub */}
  <TouchableOpacity
    style={styles.learnMoreButton}
    onPress={() => router.push("/study-hub-videos")}
  >
    <Text style={styles.learnMoreText}>Learn More</Text>
  </TouchableOpacity>
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignSelf: "flex-start",
  },
  backIcon: {
    fontSize: 20,
    marginRight: 8,
    color: "#333",
  },
  backText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    textAlign: "center",
    marginBottom: 25,
  },
  currentWeatherCard: {
    marginHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  weatherLocation: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    opacity: 0.8,
    marginBottom: 4,
  },
  weatherCity: {
    fontSize: 19,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#fff",
    opacity: 0.9,
    marginBottom: 15,
    marginLeft: 189,
  },
  temperatureSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    marginLeft: 180,
    marginTop: -93,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weatherDetailItem: {
    alignItems: "center",
  },
  weatherDetailLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#fff",
    opacity: 0.8,
    marginBottom: 3,
    marginTop: -5
  },
  weatherDetailValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 10,
  },
  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  forecastItem: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  forecastDay: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  forecastIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  forecastIcon2: {
    width: 32,
    height: 43,
    marginBottom: 8,
  },
  forecastCondition: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#111",
    textAlign: "center",
  },
  advisoryCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  advisoryTitle: {
    fontSize: 16,
    fontFamily: "Poppins-ExtraBold",
    color: "#ff0019",
    marginBottom: 8,
  },
  advisoryDescription: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    lineHeight: 20,
  },
  studyHubCard: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  studyHubIcon: {
    width: 42,
    height: 45,
    marginRight: 12,
  },
  studyHubContent: {
    flex: 1,
  },
  studyHubTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 4,
  },
  studyHubSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 16,
  },
  learnMoreButton: {
    backgroundColor: "#111",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  learnMoreText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
});
