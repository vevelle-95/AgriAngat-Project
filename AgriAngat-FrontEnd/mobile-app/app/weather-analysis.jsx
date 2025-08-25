import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function WeatherAnalysisScreen() {
  // Geolocation support
  useEffect(() => {
    (async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Call backend API to get city name from lat/lon
            try {
              const API_URLS = __DEV__ ? [
                Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api',
                'http://192.168.254.203:5000/api',
                'http://127.0.0.1:5000/api'
              ] : ['http://localhost:5000/api'];
              let response;
              for (const API_BASE_URL of API_URLS) {
                try {
                  response = await fetch(`${API_BASE_URL}/city-from-coords?lat=${latitude}&lon=${longitude}`);
                  if (response.ok) break;
                } catch (error) { continue; }
              }
              if (response?.ok) {
                const result = await response.json();
                if (result.success && result.city) {
                  fetchWeatherData(result.city);
                }
              }
            } catch (error) {
              // fallback: do nothing
            }
          },
          (error) => {
            // fallback: do nothing
          }
        );
      }
    })();
  }, []);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState({
    city: "",
    condition: "",
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    rainChance: 0,
    forecast: [],
    tips: []
  });
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [availableCities, setAvailableCities] = useState([
    "Manila", "Quezon City", "Cebu City", "Davao City", "Baguio",
    "Iloilo City", "Bacolod", "Cagayan de Oro", "General Santos",
    "Tacloban", "Naga", "Legazpi", "Angeles", "Tarlac City",
    "Cabanatuan", "San Fernando", "Dagupan", "Lucena", "Batangas City",
    "Lipa", "Antipolo", "Caloocan", "Las Piñas", "Makati",
    "Mandaluyong", "Marikina", "Muntinlupa", "Navotas", "Parañaque",
    "Pasay", "Pasig", "San Juan", "Taguig", "Valenzuela",
    "Malabon", "Tayabas"
  ]);
  const [debugInfo, setDebugInfo] = useState('Ready to test connection...');
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
    
    async function loadCities() {
      try {
        const API_URLS = __DEV__ ? [
          Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api',
          'http://192.168.254.203:5000/api',
          'http://127.0.0.1:5000/api'
        ] : ['http://localhost:5000/api'];

        let response;
        
        for (const API_BASE_URL of API_URLS) {
          try {
            response = await fetch(`${API_BASE_URL}/cities`);
            if (response.ok) {
              break;
            }
          } catch (error) {
            continue;
          }
        }
        
        if (response?.ok) {
          const result = await response.json();
          if (result.success && result.cities) {
            const cityNames = result.cities.map(city => city.name);
            setAvailableCities(cityNames);
          }
        }
      } catch (error) {
        console.log('Could not load cities from API, using default list');
      }
    }
    
    loadFonts();
    loadCities();
    
    // Initialize with Manila as default city
    setTimeout(() => {
      fetchWeatherData('Manila');
    }, 1000);
  }, []);

  // API integration functions
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    try {
      // Call our Flask backend API with multiple URL fallbacks
      const API_URLS = __DEV__ ? [
        Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api',
        'http://192.168.254.203:5000/api',  // Your specific network IP
        'http://127.0.0.1:5000/api'         // Local fallback
      ] : ['http://localhost:5000/api'];

      let response;
      let lastError;
      
      // Try each URL until one works
      for (const API_BASE_URL of API_URLS) {
        try {
          console.log(`Trying API URL: ${API_BASE_URL}`);
          setDebugInfo(`Connecting to: ${API_BASE_URL}`);
          
          response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          });
          
          if (response.ok) {
            setDebugInfo(`Connected successfully to: ${API_BASE_URL}`);
            break; // Success! Exit the loop
          } else {
            console.log(`API URL ${API_BASE_URL} returned ${response.status}`);
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.log(`API URL ${API_BASE_URL} failed:`, error.message);
          setDebugInfo(`Failed: ${API_BASE_URL} - ${error.message}`);
          lastError = error;
          continue; // Try next URL
        }
      }
      
      if (!response || !response.ok) {
        throw lastError || new Error('All API URLs failed');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch weather data');
      }
      
      const weatherApiData = result.weatherData;
      
      // Update weather data state with the correct structure from our Flask API
      setWeatherData({
        city: weatherApiData.location,
        condition: weatherApiData.description,
        temperature: Math.round(weatherApiData.temperature),
        humidity: weatherApiData.humidity,
        windSpeed: Math.round(weatherApiData.windSpeed),
        rainChance: weatherApiData.rainChance || 0,
        forecast: weatherApiData.forecast || [],
        tips: weatherApiData.tips || []
      });
      
      // Fetch soil data for this city
      fetchSoilData(cityName);
      
    } catch (error) {
      console.error('Weather API Error:', error);
      Alert.alert(
        "Connection Error", 
        `Could not connect to weather service for ${cityName}.\n\nPlease check:\n• Internet connection\n• Flask server is running\n• Try a different city\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSoilData = async (cityName) => {
    try {
      // Try multiple API URLs for soil data
      const API_URLS = __DEV__ ? [
        Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api',
        'http://192.168.254.203:5000/api',  // Your specific network IP
        'http://127.0.0.1:5000/api'         // Local fallback
      ] : ['http://localhost:5000/api'];

      let response;
      
      // Try each URL until one works
      for (const API_BASE_URL of API_URLS) {
        try {
          response = await fetch(`${API_BASE_URL}/soil/${encodeURIComponent(cityName)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000, // 15 second timeout for soil data (can be slower)
          });
          
          if (response.ok) {
            break; // Success! Exit the loop
          }
        } catch (error) {
          console.log(`Soil API URL ${API_BASE_URL} failed:`, error.message);
          continue; // Try next URL
        }
      }
      
      if (response?.ok) {
        const result = await response.json();
        if (result.success && result.soilData) {
          // Format soil data for display
          const formattedSoilData = {};
          Object.entries(result.soilData).forEach(([key, value]) => {
            if (key === 'pH Level') {
              formattedSoilData.pH = value;
            } else if (key === 'Organic Carbon') {
              formattedSoilData.organicCarbon = value;
            } else if (key === 'Clay Content') {
              formattedSoilData.clay = value;
            } else if (key === 'Sand Content') {
              formattedSoilData.sand = value;
            }
          });
          setSoilData(formattedSoilData);
        }
      }
    } catch (error) {
      console.error('Soil API Error:', error);
      // Soil data is optional, so we don't show an error to the user
    }
  };

  const handleCitySearch = (city) => {
    setShowCitySearch(false);
    if (city?.trim()) {
      fetchWeatherData(city.trim());
    }
  };

  const testConnection = async () => {
    setDebugInfo('Testing connection...');
    try {
      await fetchWeatherData('Manila'); // Test with Manila
    } catch (error) {
      setDebugInfo(`Connection test failed: ${error.message}`);
    }
  };

  // Simple API URL configuration


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

      {/* City Search Section - moved below title */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setShowCitySearch(true)}
        >
          <Text style={styles.searchButtonText}>🔍 Search City Weather</Text>
        </TouchableOpacity>
      </View>

      {/* Current Weather Card - Blue Design */}
      <View style={styles.currentWeatherCard}>
        <Text style={styles.weatherLocation}>My Location</Text>
        <Text style={styles.weatherCity}>{weatherData.city}</Text>
        <Text style={styles.weatherCondition}>{weatherData.condition}</Text>

        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Humidity</Text>
            <Text style={styles.weatherDetailValue}>{weatherData.humidity}%</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Wind</Text>
            <Text style={styles.weatherDetailValue}>{weatherData.windSpeed} km/h</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Text style={styles.weatherDetailLabel}>Rain Chance</Text>
            <Text style={styles.weatherDetailValue}>{weatherData.rainChance}%</Text>
          </View>
        </View>
      </View>

      {/* Display soil data if available */}
      {soilData && (
        <View style={styles.soilDataCard}>
          <Text style={styles.soilDataTitle}>Soil Analysis for {weatherData.city}</Text>
          <View style={styles.soilDataGrid}>
            {soilData.pH && (
              <View style={styles.soilDataItem}>
                <Text style={styles.soilDataLabel}>pH Level</Text>
                <Text style={styles.soilDataValue}>{soilData.pH}</Text>
              </View>
            )}
            {soilData.organicCarbon && (
              <View style={styles.soilDataItem}>
                <Text style={styles.soilDataLabel}>Organic Carbon</Text>
                <Text style={styles.soilDataValue}>{soilData.organicCarbon} g/kg</Text>
              </View>
            )}
            {soilData.clay && (
              <View style={styles.soilDataItem}>
                <Text style={styles.soilDataLabel}>Clay Content</Text>
                <Text style={styles.soilDataValue}>{soilData.clay}%</Text>
              </View>
            )}
            {soilData.sand && (
              <View style={styles.soilDataItem}>
                <Text style={styles.soilDataLabel}>Sand Content</Text>
                <Text style={styles.soilDataValue}>{soilData.sand}%</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* 3-Day Forecast */}
      <View style={styles.section}>
        <View style={styles.forecastHeader}>
          <Text style={styles.sectionTitle}>3-Day Forecast</Text>
          <Text style={styles.forecastDate}>
            as of {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
        <View style={styles.forecastContainerCustom}>
          {weatherData.forecast.map((item, index) => (
            <View key={`${item.day}-${item.tempRange}-${index}`} style={styles.forecastItemCustom}>
              <View style={styles.forecastLeft}>
                <Text style={styles.forecastDayCustom}>{item.day}</Text>
                <Image 
                  source={item.icon === 'rain' 
                    ? require("../assets/images/rain.png") 
                    : require("../assets/images/sun.png")} 
                  style={item.icon === 'rain' ? styles.forecastIcon2 : styles.forecastIcon} 
                />
              </View>
              <View style={styles.forecastRight}>
                <Text style={styles.forecastConditionCustom}>{item.condition}</Text>
                <Text style={styles.forecastTempCustom}>{item.tempRange}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Agricultural Weather Assessment */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginTop: 10, fontSize: 20, fontFamily: "Poppins-Bold" }]}>Agricultural Weather Assessment</Text>
        {/* Tips from API */}
        {weatherData.tips && weatherData.tips.length > 0 ? (
          weatherData.tips.map((tip, idx) => (
            <View key={idx} style={[styles.advisoryCard, { backgroundColor: idx % 2 === 0 ? "#ffb6c1" : "#ecfadc" }]}> 
              <Text style={styles.advisoryTitle}>{tip.title}</Text>
              <Text style={styles.advisoryDescription}>{tip.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.advisoryDescription}>No assessment available for current weather.</Text>
        )}
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

      {/* City Search Modal */}
      <Modal
        visible={showCitySearch}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCitySearch(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Philippine City</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCitySearch(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Type city name..."
              value={searchCity}
              onChangeText={setSearchCity}
              placeholderTextColor="#999"
            />
          </View>

          <ScrollView style={styles.citiesContainer}>
            {availableCities
              .filter(city => city.toLowerCase().includes(searchCity.toLowerCase()))
              .map((city, index) => (
              <TouchableOpacity
                key={`${city}-${index}`}
                style={styles.cityItem}
                onPress={() => handleCitySearch(city)}
                disabled={loading}
              >
                <Text style={styles.cityItemText}>{city}</Text>
                {loading && searchCity === city && (
                  <ActivityIndicator size="small" color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Fetching weather data...</Text>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  forecastContainerCustom: {
    flexDirection: 'column',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },
  forecastItemCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf6ff',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  forecastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  forecastRight: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  forecastDayCustom: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#007AFF',
    marginRight: 8,
  },
  forecastConditionCustom: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  forecastTempCustom: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#007AFF',
  },
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
    marginTop: -20
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
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  forecastDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    fontStyle: "italic",
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
  searchDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 15,
    lineHeight: 18,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 9999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    marginTop: -15,
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
  soilDataCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  soilDataTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 12,
  },
  soilDataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  soilDataItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  soilDataLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  soilDataValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },
  searchInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#fff",
  },
  citiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cityItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#111",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: "#0066cc",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});
