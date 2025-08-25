import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

function WeatherAnalysisScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Simple API URL configuration
  const getApiUrl = () => {
    if (__DEV__) {
      // Development mode
      if (Platform.OS === 'ios') {
        return 'http://localhost:5000';
      } else {
        return 'http://192.168.50.114:5000'; // Android emulator
      }
    } else {
      // Production - replace with your deployed URL
      return 'http://192.168.50.114:5000';
    }
  };

  const DEFAULT_CITY = "baguio";
  
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

  useEffect(() => {
    if (fontsLoaded) {
      fetchWeatherData();
    }
  }, [fontsLoaded]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl();
      console.log(`🌤️ Fetching weather from: ${apiUrl}/api/weather/${DEFAULT_CITY}`);
      
      const response = await fetch(`${apiUrl}/api/weather/${DEFAULT_CITY}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setWeatherData(data.current);
        setForecastData(data.forecast || []);
        console.log('✅ Weather data loaded successfully');
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch weather data. Check your connection.";
      setError(errorMsg);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchWeatherData();
  };

  const getWeatherIcon = (condition) => {
    const mainCondition = condition?.toLowerCase() || "";
    if (mainCondition.includes('rain') || mainCondition.includes('drizzle') || mainCondition.includes('storm')) {
      return require("../assets/images/rain.png");
    } else if (mainCondition.includes('cloud')) {
      return require("../assets/images/sun.png"); // Assuming this is your cloudy icon
    } else {
      return require("../assets/images/sun.png");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>⟲</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Weather & Analysis</Text>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Weather Card */}
      <View style={styles.currentWeatherCard}>
        <Text style={styles.weatherLocation}>My Location</Text>
        
        <Text style={styles.weatherCity}>
          {loading ? "Loading..." : (weatherData?.city || "Baguio")}
        </Text>
        
        <Text style={styles.weatherCondition}>
          {loading ? "Loading..." : 
           (weatherData?.description ? 
            weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1) : 
            "Partly Cloudy")}
        </Text>

        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>
            {loading ? "--°C" : 
             (weatherData?.temperature_c ? 
              `${Math.round(weatherData.temperature_c)}°C` : 
              "26°C")}
          </Text>
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Humidity</Text>
            <Text style={styles.weatherDetailValue}>
              {loading ? "-%" : 
               (weatherData?.humidity_pct ? 
                `${weatherData.humidity_pct}%` : 
                "75%")}
            </Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Wind</Text>
            <Text style={styles.weatherDetailValue}>
              {loading ? "- km/h" : 
               (weatherData?.wind_speed_kmh ? 
                `${Math.round(weatherData.wind_speed_kmh)} km/h` : 
                "12 km/h")}
            </Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Rain Chance</Text>
            <Text style={styles.weatherDetailValue}>
              {loading ? "-%" : 
               (weatherData?.rain_chance !== undefined ? 
                `${Math.round(weatherData.rain_chance)}%` : 
                "20%")}
            </Text>
          </View>
        </View>
      </View>

      {/* 3-Day Forecast (showing next 2 days only) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3-Day Forecast</Text>
        <View style={styles.forecastContainer}>
          {/* Today (current) */}
          <View style={styles.forecastItem}>
            <Text style={styles.forecastDay}>Today</Text>
            <Image 
              source={weatherData ? getWeatherIcon(weatherData.main_condition) : require("../assets/images/sun.png")} 
              style={styles.forecastIcon}
            />
            <Text style={styles.forecastCondition}>
              {weatherData?.description ? 
               weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1) :
               "Partly Cloudy"}
            </Text>
            <Text style={styles.forecastTemp}>
              {weatherData?.temperature_c ? 
               `${Math.round(weatherData.temperature_c - 2)}°C - ${Math.round(weatherData.temperature_c + 4)}°C` :
               "26°C - 32°C"}
            </Text>
          </View>

          {/* Next 2 days from API */}
          {loading ? (
            Array.from({length: 2}).map((_, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>Loading...</Text>
                <View style={[styles.forecastIcon, { backgroundColor: '#f0f0f0' }]} />
                <Text style={styles.forecastCondition}>Loading...</Text>
                <Text style={styles.forecastTemp}>--°C - --°C</Text>
              </View>
            ))
          ) : forecastData.length > 0 ? (
            forecastData.slice(0, 2).map((day, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{day.day}</Text>
                <Image 
                  source={getWeatherIcon(day.main_condition)} 
                  style={day.main_condition?.toLowerCase().includes('rain') ? styles.forecastIcon2 : styles.forecastIcon}
                />
                <Text style={styles.forecastCondition}>{day.condition}</Text>
                <Text style={styles.forecastTemp}>
                  {`${Math.round(day.temp_min)}°C - ${Math.round(day.temp_max)}°C`}
                </Text>
              </View>
            ))
          ) : (
            // Fallback static data for next 2 days
            <>
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
            </>
          )}
        </View>
      </View>

      {/* Dynamic Crop Advisories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginTop: 10, fontSize: 20, fontFamily: "Poppins-Bold" }]}>
          Crop Advisories
        </Text>

        {/* Rice Advisory */}
        <View style={[styles.advisoryCard, { backgroundColor: "#ffb6c1" }]}>
          <Text style={styles.advisoryTitle}>Rice (Palay) Advisory</Text>
          <Text style={styles.advisoryDescription}>
            {!loading && weatherData?.rain_chance > 60 
              ? "High rain probability detected. Ensure proper drainage to prevent waterlogging. Monitor for pest activity during wet periods."
              : "Current weather conditions are suitable for rice cultivation. Maintain proper field water levels and monitor growth regularly."
            }
          </Text>
        </View>

        {/* Corn Advisory */}
        <View style={[styles.advisoryCard, { backgroundColor: "#ffb6c1" }]}>
          <Text style={styles.advisoryTitle}>Corn (Mais) Advisory</Text>
          <Text style={styles.advisoryDescription}>
            {!loading && weatherData?.temperature_c > 32 
              ? "High temperatures detected. Monitor for heat stress and ensure adequate irrigation. Watch for pest activity."
              : "Temperature conditions are favorable for corn growth. Monitor for armyworm infestations and apply organic pesticides if necessary."
            }
          </Text>
        </View>

        {/* Banana Advisory */}
        <View style={[styles.advisoryCard, { backgroundColor: "#ecfadc" }]}>
          <Text style={[styles.advisoryTitle, { color: "#0a8701" }]}>Banana (Saging) Advisory</Text>
          <Text style={styles.advisoryDescription}>
            {!loading && weatherData?.wind_speed_kmh > 25
              ? "Strong winds detected. Secure banana plants with supports to prevent damage. Monitor for broken leaves."
              : "Weather conditions support good fruit development. Maintain consistent watering and monitor for fungal diseases."
            }
          </Text>
        </View>
      </View>

      {/* Study Hub section */}
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

        <View style={styles.studyHubCard}>
          <Image
            source={require("../assets/images/study-hub.png")}
            style={styles.studyHubIcon}
          />
          <View style={styles.studyHubContent}>
            <Text style={styles.studyHubTitle}>Study Hub</Text>
            <Text style={styles.studyHubSubtitle}>
              Learn tips and how-tos from AgriAngat videos and the AgriAngat Assistant      
            </Text>
          </View>
        </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  refreshButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  refreshIcon: {
    fontSize: 18,
    color: "#fff",
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#ffe6e6',
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: '#fff',
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

// Export as default
export default WeatherAnalysisScreen;