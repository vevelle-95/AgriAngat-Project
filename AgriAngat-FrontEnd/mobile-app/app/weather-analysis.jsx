import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { useWeatherData } from "../hooks/useWeatherData";
import { useCities } from "../hooks/useCities";

export default function WeatherAnalysisScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState("manila");
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Use the weather data hook with selected city
  const { weatherData, loading, error, refetch } = useWeatherData(selectedCity);
  
  // Get cities from API
  const { cities, loading: citiesLoading } = useCities();

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getWeatherIcon = (condition) => {
    const lowerCondition = condition?.toLowerCase() || '';
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return require("../assets/images/rain.png");
    } else if (lowerCondition.includes('cloud')) {
      return require("../assets/images/sun.png"); // You might want a cloudy icon
    } else {
      return require("../assets/images/sun.png");
    }
  };

  const getAssessmentColor = (level) => {
    switch (level) {
      case 'optimal':
      case 'good':
      case 'light':
      case 'calm':
        return '#4CAF50'; // Green
      case 'cool':
      case 'low':
      case 'moderate':
        return '#FF9800'; // Orange
      case 'hot':
      case 'high':
      case 'none':
        return '#FF5722'; // Red-Orange
      case 'very_hot':
      case 'heavy':
      case 'strong':
        return '#F44336'; // Red
      case 'cold':
        return '#2196F3'; // Blue
      default:
        return '#757575'; // Grey
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'numeric', 
      day: 'numeric' 
    });
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Simple API URL configuration
  return (
    <>
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setShowCityModal(true)} 
          style={styles.searchButton}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Search City</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Weather & Analysis</Text>

      {/* Current Weather Card - Using Real Data */}
      <View style={styles.currentWeatherCard}>
        <Text style={styles.weatherLocation}>Current Location</Text>
        <Text style={styles.weatherCity}>{weatherData?.city || 'Unknown City'}</Text>
        <Text style={styles.weatherCondition}>
          {weatherData?.current?.description?.replace(/^\w/, c => c.toUpperCase()) || 'Unknown'}
        </Text>

        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>{weatherData?.current?.temperature || 0}°C</Text>
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Humidity</Text>
            <Text style={styles.weatherDetailValue}>{weatherData?.current?.humidity || 0}%</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Wind</Text>
            <Text style={styles.weatherDetailValue}>
              {weatherData?.current?.wind_speed ? `${(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
            </Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Rain</Text>
            <Text style={styles.weatherDetailValue}>{weatherData?.current?.rain || 0} mm</Text>
          </View>
        </View>
      </View>

      {/* 3-Day Forecast - Using Real Data */}
      <View style={styles.section}>
        <View style={styles.forecastHeader}>
          <Text style={styles.sectionTitle}>3-Day Forecast</Text>
          <Text style={styles.forecastHeaderDate}>
            as of {new Date().toLocaleDateString('en-US', { 
              month: 'numeric', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </Text>
        </View>
        <View style={styles.forecastContainer}>
          {weatherData?.forecast?.slice(0, 3).map((day, index) => (
            <View key={index} style={[
              styles.forecastItem,
              index === 2 && styles.lastForecastItem
            ]}>
              <View style={styles.forecastLeftSection}>
                <Text style={styles.forecastDay}>
                  {index === 0 ? 'Today' : formatDate(day.date).split(' ')[0]}
                </Text>
                <Text style={styles.forecastDate}>
                  {index === 0 ? formatDate(new Date().toISOString()).replace(/^\w+\s/, '') : formatDate(day.date).replace(/^\w+\s/, '')}
                </Text>
              </View>
              
              <View style={styles.forecastCenterSection}>
                <Image 
                  source={getWeatherIcon(day.condition)} 
                  style={[
                    styles.forecastIcon,
                    day.condition?.toLowerCase().includes('rain') && styles.rainIcon
                  ]} 
                />
              </View>
              
              <View style={styles.forecastRightSection}>
                <Text style={styles.forecastCondition}>
                  {day.condition?.replace(/^\w/, c => c.toUpperCase()) || 'Unknown'}
                </Text>
                <Text style={styles.forecastTemp}>
                  {Math.round(day.temp_min)}°C - {Math.round(day.temp_max)}°C
                </Text>
              </View>
            </View>
          )) || (
            // Fallback if no forecast data
            [1, 2, 3].map((day, index) => (
              <View key={index} style={[
                styles.forecastItem,
                index === 2 && styles.lastForecastItem
              ]}>
                <View style={styles.forecastLeftSection}>
                  <Text style={styles.forecastDay}>Day {day}</Text>
                  <Text style={styles.forecastDate}>Aug {24 + index}</Text>
                </View>
                
                <View style={styles.forecastCenterSection}>
                  <Image source={require("../assets/images/sun.png")} style={styles.forecastIcon} />
                </View>
                
                <View style={styles.forecastRightSection}>
                  <Text style={styles.forecastCondition}>No data</Text>
                  <Text style={styles.forecastTemp}>-- °C</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Agricultural Assessment - Using Real Data */}
      {weatherData?.agricultural_assessment && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginTop: 10, fontSize: 20, fontFamily: "Poppins-Bold" }]}>
            Agricultural Weather Assessment
          </Text>
          
          {Object.entries(weatherData.agricultural_assessment).map(([key, assessment]) => (
            <View key={key} style={[styles.advisoryCard, { backgroundColor: '#f8f8f8' }]}>
              <Text style={[styles.advisoryTitle, { color: getAssessmentColor(assessment.level) }]}>
                {key.charAt(0).toUpperCase() + key.slice(1)} Status
              </Text>
              <Text style={styles.advisoryDescription}>
                {assessment.message}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Farming Recommendations - Using Real Data */}
      {weatherData?.farming_recommendations && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginTop: 10, fontSize: 20, fontFamily: "Poppins-Bold" }]}>
            Today's Farming Recommendations
          </Text>
          
          <View style={[styles.advisoryCard, { backgroundColor: "#ecfadc" }]}>
            <Text style={[styles.advisoryTitle, { color: "#0a8701" }]}>Farming Advisory</Text>
            <Text style={styles.advisoryDescription}>
              {weatherData.farming_recommendations.map((rec, index) => 
                `• ${rec.replace('• ', '')}`
              ).join('\n')}
            </Text>
          </View>
        </View>
      )}

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

    {/* City Selection Modal */}
    <Modal
      visible={showCityModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCityModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select City</Text>
            <TouchableOpacity 
              onPress={() => setShowCityModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            style={styles.cityList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cityItem,
                  selectedCity === item && styles.selectedCityItem
                ]}
                onPress={() => {
                  setSelectedCity(item);
                  setShowCityModal(false);
                  setSearchQuery("");
                }}
              >
                <Text style={[
                  styles.cityText,
                  selectedCity === item && styles.selectedCityText
                ]}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
                {selectedCity === item && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#F44336",
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 40,
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
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 12,
  },
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 5,
  },
  forecastHeaderDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    fontStyle: "italic",
  },
  forecastContainer: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 4,
    paddingVertical: -5,
    marginTop: -5,
    marginBottom: 15,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 4,
    minHeight: 48,
  },
  lastForecastItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  forecastLeftSection: {
    flex: 2,
    alignItems: "flex-start",
  },
  forecastCenterSection: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 2,
  },
  forecastRightSection: {
    flex: 2,
    alignItems: "flex-end",
  },
  forecastDay: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 1,
  },
  forecastDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  forecastIcon: {
    width: 32,
    height: 36,
    resizeMode: 'contain',
  },
  forecastIcon2: {
    width: 32,
    height: 40,
    resizeMode: 'contain',
  },
  rainIcon: {
    width: 34,
    height: 38,
    resizeMode: 'contain',
  },
  forecastCondition: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlign: "right",
    marginBottom: 1,
  },
  forecastTemp: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "right",
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
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  searchText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
  },
  cityList: {
    maxHeight: 300,
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedCityItem: {
    backgroundColor: "#e3f2fd",
  },
  cityText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  selectedCityText: {
    color: "#007AFF",
    fontFamily: "Poppins-SemiBold",
  },
  checkmark: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "Poppins-Bold",
  },
});
