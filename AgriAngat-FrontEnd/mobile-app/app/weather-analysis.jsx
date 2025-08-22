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
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const router = useRouter();

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

  const currentWeather = {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 75,
    windSpeed: 12,
    rainfall: 5,
    icon: "⛅"
  };

  const forecast = [
    { day: "Today", high: 32, low: 24, condition: "Partly Cloudy", icon: "⛅", rain: 20 },
    { day: "Tomorrow", high: 30, low: 23, condition: "Light Rain", icon: "🌦️", rain: 60 },
    { day: "Wed", high: 29, low: 22, condition: "Rainy", icon: "🌧️", rain: 80 },
    { day: "Thu", high: 31, low: 25, condition: "Sunny", icon: "☀️", rain: 10 },
    { day: "Fri", high: 33, low: 26, condition: "Sunny", icon: "☀️", rain: 5 },
    { day: "Sat", high: 30, low: 24, condition: "Cloudy", icon: "☁️", rain: 30 },
    { day: "Sun", high: 28, low: 23, condition: "Light Rain", icon: "🌦️", rain: 50 }
  ];

  const farmingInsights = [
    {
      title: "Irrigation Recommendation",
      description: "Light rain expected Wednesday. Reduce irrigation by 30% for the next 3 days.",
      priority: "medium",
      icon: "💧"
    },
    {
      title: "Pest Alert",
      description: "High humidity levels may increase pest activity. Monitor crops closely.",
      priority: "high",
      icon: "🐛"
    },
    {
      title: "Harvest Window",
      description: "Optimal harvest conditions expected Thursday-Friday. Plan accordingly.",
      priority: "medium",
      icon: "🌾"
    },
    {
      title: "Fertilizer Application",
      description: "Apply fertilizer before Wednesday's rain for better absorption.",
      priority: "low",
      icon: "🌱"
    }
  ];

  const weeklyAnalysis = {
    avgTemp: 30,
    totalRainfall: 45,
    sunnyDays: 3,
    rainyDays: 2,
    optimalDays: 5
  };

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
      <Text style={styles.subtitle}>Cabanatuan City, Nueva Ecija</Text>

      {/* Current Weather Card */}
      <View style={styles.currentWeatherCard}>
        <View style={styles.currentWeatherMain}>
          <Text style={styles.weatherIcon}>{currentWeather.icon}</Text>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{currentWeather.temperature}°</Text>
            <Text style={styles.condition}>{currentWeather.condition}</Text>
          </View>
        </View>
        
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Humidity</Text>
            <Text style={styles.weatherDetailValue}>{currentWeather.humidity}%</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Wind</Text>
            <Text style={styles.weatherDetailValue}>{currentWeather.windSpeed} km/h</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Rainfall</Text>
            <Text style={styles.weatherDetailValue}>{currentWeather.rainfall} mm</Text>
          </View>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {["7days", "14days", "30days"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonSelected
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextSelected
            ]}>
              {period === "7days" ? "7 Days" : period === "14days" ? "14 Days" : "30 Days"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 7-Day Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
          {forecast.map((day, index) => (
            <View key={index} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <Text style={styles.forecastIcon}>{day.icon}</Text>
              <Text style={styles.forecastHigh}>{day.high}°</Text>
              <Text style={styles.forecastLow}>{day.low}°</Text>
              <Text style={styles.forecastRain}>{day.rain}%</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Weekly Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Analysis</Text>
        <View style={styles.analysisGrid}>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisValue}>{weeklyAnalysis.avgTemp}°C</Text>
            <Text style={styles.analysisLabel}>Avg Temperature</Text>
          </View>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisValue}>{weeklyAnalysis.totalRainfall}mm</Text>
            <Text style={styles.analysisLabel}>Total Rainfall</Text>
          </View>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisValue}>{weeklyAnalysis.sunnyDays}</Text>
            <Text style={styles.analysisLabel}>Sunny Days</Text>
          </View>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisValue}>{weeklyAnalysis.optimalDays}</Text>
            <Text style={styles.analysisLabel}>Optimal Days</Text>
          </View>
        </View>
      </View>

      {/* Farming Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farming Insights</Text>
        {farmingInsights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Text style={styles.insightIcon}>{insight.icon}</Text>
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={[
                  styles.priorityBadge,
                  insight.priority === 'high' && styles.priorityHigh,
                  insight.priority === 'medium' && styles.priorityMedium,
                  insight.priority === 'low' && styles.priorityLow
                ]}>
                  <Text style={[
                    styles.priorityText,
                    insight.priority === 'high' && styles.priorityTextHigh,
                    insight.priority === 'medium' && styles.priorityTextMedium,
                    insight.priority === 'low' && styles.priorityTextLow
                  ]}>
                    {insight.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        ))}
      </View>

      {/* Weather Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertTitle}>Heavy Rain Warning</Text>
          </View>
          <Text style={styles.alertDescription}>
            Heavy rainfall expected Wednesday afternoon. Consider postponing outdoor farming activities and ensure proper drainage.
          </Text>
          <Text style={styles.alertTime}>Valid until: Wednesday, 6:00 PM</Text>
        </View>
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
    fontFamily: "Poppins-Regular",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  currentWeatherCard: {
    marginHorizontal: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  currentWeatherMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  weatherIcon: {
    fontSize: 64,
    marginRight: 20,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
  },
  condition: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
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
    color: "#999",
    marginBottom: 4,
  },
  weatherDetailValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  periodSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  periodButtonSelected: {
    backgroundColor: "#0f6d00",
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  periodButtonTextSelected: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 15,
  },
  forecastScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  forecastCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    alignItems: "center",
    minWidth: 80,
  },
  forecastDay: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  forecastHigh: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  forecastLow: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  forecastRain: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#007AFF",
  },
  analysisGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  analysisCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  analysisValue: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#0f6d00",
    marginBottom: 4,
  },
  analysisLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
  },
  insightCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  insightIconContainer: {
    marginRight: 12,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  priorityHigh: {
    backgroundColor: "#ffebee",
  },
  priorityMedium: {
    backgroundColor: "#fff3e0",
  },
  priorityLow: {
    backgroundColor: "#e8f5e8",
  },
  priorityText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
  priorityTextHigh: {
    color: "#d32f2f",
  },
  priorityTextMedium: {
    color: "#f57c00",
  },
  priorityTextLow: {
    color: "#388e3c",
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 18,
    marginLeft: 32,
  },
  alertCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#856404",
  },
  alertDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#856404",
    lineHeight: 18,
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#6c5700",
  },
});
