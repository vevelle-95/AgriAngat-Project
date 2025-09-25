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
              const overrideBase = process.env.EXPO_PUBLIC_API_BASE;
              const API_URLS = __DEV__ ? [
                ...(overrideBase ? [overrideBase.endsWith('/api') ? overrideBase : `${overrideBase.replace(/\/$/, '')}/api`] : []),
                Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api', // Emulator/Simulator
                'http://192.168.254.204:5000/api',  // Windows machine IP on local network (updated)
                'http://127.0.0.1:5000/api'         // Local loopback
              ] : [overrideBase ? (overrideBase.endsWith('/api') ? overrideBase : `${overrideBase.replace(/\/$/, '')}/api`) : 'http://localhost:5000/api'];
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
    // Default fallback cities - will be replaced by API data
    "Manila", "Quezon City", "Cebu City", "Davao City", "Baguio"
  ]);
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
        console.log('🏙️ Loading cities from API...');
        
        // Try to get cities from Flask API
        const API_URLS = __DEV__ ? [
          Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
          'http://192.168.254.206:5000',  // Updated to match Flask server IP
          'http://127.0.0.1:5000'
        ] : ['http://localhost:5000'];

        let citiesData = null;
        for (const baseUrl of API_URLS) {
          try {
            const response = await fetch(`${baseUrl}/api/cities`);
            if (response.ok) {
              citiesData = await response.json();
              break;
            }
          } catch (error) {
            continue;
          }
        }
        
        if (citiesData && citiesData.success && citiesData.cities && Array.isArray(citiesData.cities)) {
          const cityNames = citiesData.cities.map(city => city.name);
          console.log(`✅ Loaded ${cityNames.length} cities from API`);
          console.log(`Sample cities: ${cityNames.slice(0, 5).join(', ')}...`);
          setAvailableCities(cityNames);
        } else {
          console.log('⚠️ Cities API response missing expected data structure');
        }
      } catch (error) {
        console.log('⚠️ Could not load cities from API, using default list:', error.message);
      }
    }
    
    loadFonts();
    loadCities();
    
    // Initialize with Manila as default city
    setTimeout(() => {
      fetchWeatherDataSimple('Manila');
    }, 1000);
  }, []);

  // Simple API fetch with dynamic endpoint discovery
  const fetchWeatherDataSimple = async (cityName) => {
    setLoading(true);
    
    // Clear previous data
    setWeatherData({
      city: cityName,
      condition: "Loading...",
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      rainChance: 0,
      forecast: [],
      tips: []
    });
    setSoilData(null);
    
    try {
      console.log(`🌤️ Fetching weather for ${cityName}...`);
      
      // Try multiple API endpoints
      const API_URLS = __DEV__ ? [
        Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
        'http://192.168.254.206:5000',  // Updated to match Flask server IP
        'http://127.0.0.1:5000'
      ] : ['http://localhost:5000'];

      let weatherData = null;
      for (const baseUrl of API_URLS) {
        try {
          const response = await fetch(`${baseUrl}/api/weather/${encodeURIComponent(cityName)}`);
          if (response.ok) {
            weatherData = await response.json();
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!weatherData || !weatherData.success) {
        throw new Error(weatherData?.error || 'Weather API request failed');
      }
      
      const apiData = weatherData.weatherData;
      console.log(`✅ Weather data received for ${cityName}`);
      
      // Update state with API data
      setWeatherData({
        city: apiData.location || cityName,
        condition: apiData.description || 'Unknown',
        temperature: Math.round(apiData.temperature || 25),
        humidity: apiData.humidity || 50,
        windSpeed: Math.round(apiData.windSpeed || 10),
        rainChance: apiData.rainChance || 0,
        forecast: apiData.forecast || [],
        tips: apiData.tips || []
      });
      
      // Fetch soil data
      fetchSoilDataSimple(cityName);
      
    } catch (error) {
      console.error('❌ Weather fetch failed:', error);
      
      // Fallback data
      const cityVariations = {
        'Manila': { temp: 28, humidity: 75, wind: 12, rain: 35 },
        'Cebu City': { temp: 30, humidity: 70, wind: 8, rain: 20 },
        'Davao City': { temp: 32, humidity: 65, wind: 6, rain: 15 },
        'Baguio': { temp: 22, humidity: 85, wind: 15, rain: 45 },
        'Iloilo City': { temp: 29, humidity: 72, wind: 10, rain: 25 }
      };
      
      const cityData = cityVariations[cityName] || { temp: 27, humidity: 70, wind: 10, rain: 30 };
      
      setWeatherData({
        city: cityName,
        condition: "Partly Cloudy (Offline Mode)",
        temperature: cityData.temp,
        humidity: cityData.humidity,
        windSpeed: cityData.wind,
        rainChance: cityData.rain,
        forecast: [
          { day: "Today", condition: "Partly Cloudy", tempRange: `${cityData.temp-2}°C - ${cityData.temp+3}°C`, icon: "sun" },
          { day: "Tomorrow", condition: "Scattered Showers", tempRange: `${cityData.temp-1}°C - ${cityData.temp+2}°C`, icon: "rain" },
          { day: "Day 3", condition: "Sunny", tempRange: `${cityData.temp}°C - ${cityData.temp+4}°C`, icon: "sun" }
        ],
        tips: [
          {
            title: "Offline Mode Active",
            description: `Cannot connect to weather service. Using estimated data for ${cityName}. Error: ${error.message}`
          }
        ]
      });
      
      setSoilData({
        pH: "6.3", organicCarbon: "19.5 g/kg", clay: "32%", sand: "27%"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSoilDataSimple = async (cityName) => {
    try {
      console.log(`🌱 Fetching soil data for ${cityName}...`);
      
      // Try multiple API endpoints
      const API_URLS = __DEV__ ? [
        Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000',
        'http://192.168.254.206:5000',  // Updated to match Flask server IP
        'http://127.0.0.1:5000'
      ] : ['http://localhost:5000'];

      let soilData = null;
      for (const baseUrl of API_URLS) {
        try {
          const response = await fetch(`${baseUrl}/api/soil/${encodeURIComponent(cityName)}`);
          if (response.ok) {
            soilData = await response.json();
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (soilData && soilData.success && soilData.soilData) {
        console.log(`✅ Soil data received for ${cityName}`);
        setSoilData({
          pH: soilData.soilData["pH Level"],
          organicCarbon: soilData.soilData["Organic Carbon"],
          clay: soilData.soilData["Clay Content"],
          sand: soilData.soilData["Sand Content"]
        });
      } else {
        throw new Error(soilData?.error || 'Soil data not available');
      }
    } catch (error) {
      console.log('⚠️ Soil data unavailable:', error.message);
      // Fallback soil data
      setSoilData({
        pH: "6.3", 
        organicCarbon: "19.5 g/kg", 
        clay: "32%", 
        sand: "27%"
      });
    }
  };

  // API integration functions
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    let lastError = null; // track last connection error across attempts
    
    // Clear previous data to ensure fresh display
    setWeatherData({
      city: cityName,
      condition: "Loading...",
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      rainChance: 0,
      forecast: [],
      tips: []
    });
    setSoilData(null);
    
    // Quick network connectivity test
    console.log(`🌐 Testing network connectivity...`);
    try {
      const connectivityTest = await fetch('https://httpbin.org/get', {
        method: 'GET',
        timeout: 3000
      });
      if (connectivityTest.ok) {
        console.log(`✅ Internet connectivity confirmed`);
      }
    } catch (connectError) {
      console.log(`⚠️ Limited internet connectivity: ${connectError.message}`);
    }
    
    try {
      // Call our Flask backend API with multiple URL fallbacks
      // Priority order: Android emulator, iOS simulator, Windows local network, localhost
      const overrideBase = process.env.EXPO_PUBLIC_API_BASE;
      const API_URLS = __DEV__ ? [
        ...(overrideBase ? [overrideBase.endsWith('/api') ? overrideBase : `${overrideBase.replace(/\/$/, '')}/api`] : []),
        Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api', // Emulator/Simulator
        'http://192.168.254.204:5000/api',  // Windows machine IP on local network (updated)
        'http://127.0.0.1:5000/api',        // Local loopback
        'http://localhost:5000/api'         // Alternative localhost
      ] : [overrideBase ? (overrideBase.endsWith('/api') ? overrideBase : `${overrideBase.replace(/\/$/, '')}/api`) : 'http://localhost:5000/api'];

      let response = null;
      let successfulUrl = null;
      
      // Show debugging info
      console.log(`🔧 Debug Info:`);
      console.log(`   Platform: ${Platform.OS}`);
      console.log(`   __DEV__: ${__DEV__}`);
      console.log(`   EXPO_PUBLIC_API_BASE: ${process.env.EXPO_PUBLIC_API_BASE}`);
      console.log(`   API URLs to try: ${JSON.stringify(API_URLS, null, 2)}`);
      
      // Try each URL until one works
      for (const API_BASE_URL of API_URLS) {
        try {
          console.log(`🔍 Attempting connection to: ${API_BASE_URL}`);
          console.log(`   City being requested: "${cityName}"`);
          console.log(`   Encoded city name: "${encodeURIComponent(cityName)}"`);
          
          // Skip health check for now and go directly to weather API
          // This is a temporary workaround for network connectivity issues
          console.log(`⚠️ Skipping health check - attempting direct weather API call`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            successfulUrl = API_BASE_URL;
            console.log(`✅ Weather API success with ${API_BASE_URL}`);
            break; // Success! Exit the loop
          } else {
            console.log(`❌ API URL ${API_BASE_URL} returned ${response.status}`);
            const errorText = await response.text();
            lastError = new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (error) {
          console.log(`❌ API URL ${API_BASE_URL} failed:`, error.message);
          // More specific error messages
          if (error.name === 'AbortError') {
            console.log(`⏱️ Timeout: ${API_BASE_URL} took too long to respond`);
            lastError = new Error(`Connection timeout to ${API_BASE_URL}`);
          } else if (error.message.includes('Network request failed')) {
            console.log(`🌐 Network: Cannot reach ${API_BASE_URL} - this could be:`);
            console.log(`   • Flask server not running`);
            console.log(`   • Windows Firewall blocking connections`);
            console.log(`   • Device and computer on different networks`);
            console.log(`   • Incorrect IP address configuration`);
            lastError = new Error(`Network error: Cannot reach ${API_BASE_URL}`);
          } else {
            lastError = error;
          }
          continue; // Try next URL
        }
      }
      
      if (!response || !response.ok) {
        const errorMessage = lastError ? lastError.message : 'All API URLs failed to connect';
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch weather data');
      }
      
      const weatherApiData = result.weatherData;
      console.log(`Weather data received for ${cityName}:`, weatherApiData);
      
      // Update weather data state with the correct structure from our Flask API
      const newWeatherData = {
        city: weatherApiData.location || cityName,
        condition: weatherApiData.description || 'Unknown',
        temperature: Math.round(weatherApiData.temperature || 25),
        humidity: weatherApiData.humidity || 50,
        windSpeed: Math.round(weatherApiData.windSpeed || 10),
        rainChance: weatherApiData.rainChance || 0,
        forecast: weatherApiData.forecast || [],
        tips: weatherApiData.tips || []
      };
      
      console.log(`Setting weather data for ${cityName}:`, newWeatherData);
      setWeatherData(newWeatherData);
      
      // Fetch soil data for this city
      fetchSoilData(cityName);
      
    } catch (error) {
      console.error('Weather API Error:', error);
      console.log('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Provide fallback weather data with city-specific variations
      const cityVariations = {
        'Manila': { temp: 28, humidity: 75, wind: 12, rain: 35 },
        'Cebu City': { temp: 30, humidity: 70, wind: 8, rain: 20 },
        'Davao City': { temp: 32, humidity: 65, wind: 6, rain: 15 },
        'Baguio': { temp: 22, humidity: 85, wind: 15, rain: 45 },
        'Iloilo City': { temp: 29, humidity: 72, wind: 10, rain: 25 }
      };
      
      const cityData = cityVariations[cityName] || { temp: 27, humidity: 70, wind: 10, rain: 30 };
      
      const fallbackData = {
        city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        condition: "Connection Failed - Sample Data",
        temperature: cityData.temp,
        humidity: cityData.humidity,
        windSpeed: cityData.wind,
        rainChance: cityData.rain,
        forecast: [
          {"day": "Today", "condition": "Sample Data", "tempRange": `${cityData.temp-2}°C - ${cityData.temp+4}°C`, "icon": "sun"},
          {"day": "Tomorrow", "condition": "Sample Data", "tempRange": `${cityData.temp-4}°C - ${cityData.temp+2}°C`, "icon": "sun"},
          {"day": "Day 3", "condition": "Sample Data", "tempRange": `${cityData.temp-5}°C - ${cityData.temp+1}°C`, "icon": "sun"}
        ],
        tips: [
          {
            title: "Connection Error",
            description: `Unable to connect to weather service for ${cityName}. Showing sample data. Please check your network connection and try again.`
          },
          {
            title: "Troubleshooting",
            description: "Make sure your device can access the internet and the Flask server is running on the same network."
          }
        ]
      };
      
      console.log(`Setting fallback data for ${cityName}:`, fallbackData);
      setWeatherData(fallbackData);
      
      // More user-friendly error message with detailed troubleshooting
      const errorDetails = lastError ? lastError.message : 'Unknown error';
      console.log(`🚨 All API endpoints failed. Last error: ${errorDetails}`);
      
      // Create detailed troubleshooting message
      const troubleshootingSteps = [
        "1. Make sure Flask server is running (python flask_weather_server.py)",
        "2. Check that both devices are on the same WiFi network",
        "3. Verify computer IP is 192.168.254.204 (run 'ipconfig' on Windows)",
        "4. Allow Python through Windows Firewall",
        "5. Try accessing http://192.168.254.204:5000/health from device browser",
        "6. If using emulator, try http://10.0.2.2:5000/health instead"
      ];
      
      Alert.alert(
        "Weather Service Connection Failed", 
        `Cannot connect to weather service.\n\nError: ${errorDetails}\n\nTroubleshooting Steps:\n${troubleshootingSteps.join('\n')}\n\nShowing sample data instead.`,
        [
          { text: "Retry", onPress: () => fetchWeatherData(cityName) },
          { text: "Use Sample Data", style: "cancel" }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSoilData = async (cityName) => {
    try {
      console.log(`🌱 Starting soil data fetch for: ${cityName}`);
      
      // Try multiple API URLs for soil data
      const overrideBase = process.env.EXPO_PUBLIC_API_BASE;
      const API_URLS = __DEV__ ? [
        ...(overrideBase ? [overrideBase.endsWith('/api') ? overrideBase : `${overrideBase.replace(/\/$/, '')}/api`] : []),
        Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api', // Emulator/Simulator
        'http://192.168.254.204:5000/api',  // Windows machine IP on local network (updated)
        'http://127.0.0.1:5000/api',        // Local loopback
        'http://localhost:5000/api'         // Alternative localhost
      ] : [overrideBase ? (overrideBase.endsWith('/api') ? overrideBase : `${overrideBase.replace(/\/$/, '')}/api`) : 'http://localhost:5000/api'];

      let response;
      let lastError;
      
      // Try each URL until one works
      for (const API_BASE_URL of API_URLS) {
        try {
          console.log(`   Trying soil API URL: ${API_BASE_URL}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          response = await fetch(`${API_BASE_URL}/soil/${encodeURIComponent(cityName)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          console.log(`   Soil API response status: ${response.status}`);
          
          if (response.ok) {
            console.log(`   ✅ Soil API success with URL: ${API_BASE_URL}`);
            break; // Success! Exit the loop
          } else {
            console.log(`   ❌ Soil API failed with status: ${response.status}`);
            const errorText = await response.text();
            console.log(`   Error response: ${errorText}`);
            lastError = `HTTP ${response.status}: ${errorText}`;
          }
        } catch (error) {
          console.log(`   Soil API URL ${API_BASE_URL} failed:`, error.message);
          lastError = error.message;
          continue; // Try next URL
        }
      }
      
      if (response?.ok) {
        const result = await response.json();
        console.log(`   Soil API result:`, result);
        
        if (result.success && result.soilData) {
          console.log(`   Processing soil data...`);
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
          console.log(`   Formatted soil data:`, formattedSoilData);
          setSoilData(formattedSoilData);
        } else {
          console.log(`   ❌ Soil API response missing success or soilData`);
        }
      } else {
        console.log(`   ❌ All soil API URLs failed. Last error: ${lastError}`);
      }
    } catch (error) {
      console.error('Soil API Error:', error);
      console.log('Soil fetch failed, but continuing without soil data');
      // Soil data is optional, so we don't show an error to the user
    }
  };

  const handleCitySearch = (city) => {
    setShowCitySearch(false);
    if (city?.trim() && city.trim() !== weatherData.city) {
      console.log(`Searching weather for new city: ${city.trim()}`);
      fetchWeatherDataSimple(city.trim());
    }
  };

  // Helper function to format dates for forecast
  const formatForecastDate = (index) => {
    const today = new Date();
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + index);
    
    const month = forecastDate.toLocaleDateString('en-US', { month: 'long' });
    const day = forecastDate.getDate();
    
    return `${month} ${day}`;
  };

  // Helper function to get day name for forecast
  const getForecastDayName = (index) => {
    if (index === 0) return 'Today';
    
    const today = new Date();
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + index);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[forecastDate.getDay()];
  };

  // Helper function to determine if tip is warning/caution or good news
  const getTipCardStyle = (tip) => {
    const warningKeywords = [
      'warning', 'caution', 'alert', 'danger', 'risk', 'avoid', 'stop', 'cancel',
      'postpone', 'delay', 'unsafe', 'harmful', 'damage', 'loss', 'disease',
      'pest', 'drought', 'flood', 'storm', 'extreme', 'emergency', 'critical',
      'threat', 'concern', 'problem', 'issue', 'failure', 'stress', 'vulnerable',
      'error', 'failed', 'cannot', 'offline', 'connection', 'timeout', 'protecting',
      'protect', 'watch for', 'monitor closely', 'cold', 'hot', 'high humidity',
      'low humidity', 'strong wind', 'fungal', 'bacterial', 'virus', 'infection'
    ];
    
    const goodNewsKeywords = [
      'good', 'excellent', 'optimal', 'ideal', 'perfect', 'great', 'suitable',
      'favorable', 'recommended', 'best', 'improve', 'growth', 'healthy',
      'productive', 'beneficial', 'harvest', 'plant', 'sow', 'irrigate',
      'fertilize', 'success', 'opportunity', 'enhance', 'boost', 'increase',
      'growing conditions', 'perfect for', 'good for', 'time to', 'consider planting'
    ];

    const tipText = (tip.title + ' ' + tip.description).toLowerCase();
    
    const hasWarning = warningKeywords.some(keyword => tipText.includes(keyword));
    const hasGoodNews = goodNewsKeywords.some(keyword => tipText.includes(keyword));
    
    if (hasWarning) {
      return {
        backgroundColor: '#ffebee', // Light red background
        titleColor: '#d32f2f',      // Red title
        borderColor: '#ffcdd2'      // Light red border
      };
    } else if (hasGoodNews) {
      return {
        backgroundColor: '#e8f5e8', // Light green background
        titleColor: '#388e3c',      // Green title
        borderColor: '#c8e6c9'      // Light green border
      };
    } else {
      return {
        backgroundColor: '#f8f8f8', // Default light gray
        titleColor: '#1976d2',      // Blue title
        borderColor: '#e0e0e0'      // Light gray border
      };
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
      </View>

      {/* Title */}
      <Text style={styles.title}>Weather & Analysis</Text>

      {/* City Search Section */}
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
        <TouchableOpacity 
          style={styles.locationHeader}
          onPress={() => weatherData.city && fetchWeatherDataSimple(weatherData.city)}
          disabled={loading || !weatherData.city}
        >
          <Text style={styles.weatherLocation}>
            My Location {loading ? "⟳" : "↻"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.weatherMainContent}>
          <View style={styles.weatherLeftContent}>
            <Text style={styles.weatherCity}>{weatherData.city}</Text>
          </View>
          <View style={styles.weatherRightContent}>
            <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
            <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
          </View>
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
                <Text style={styles.soilDataValue}>{soilData.organicCarbon}</Text>
              </View>
            )}
            {soilData.clay && (
              <View style={styles.soilDataItem}>
                <Text style={styles.soilDataLabel}>Clay Content</Text>
                <Text style={styles.soilDataValue}>{soilData.clay}</Text>
              </View>
            )}
            {soilData.sand && (
              <View style={styles.soilDataItem}>
                <Text style={styles.soilDataLabel}>Sand Content</Text>
                <Text style={styles.soilDataValue}>{soilData.sand}</Text>
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
            <View key={`${item.day}-${item.tempRange}-${index}`} style={[
              styles.forecastItemCustom,
              index === weatherData.forecast.length - 1 && styles.forecastItemLast
            ]}>
              <View style={styles.forecastLeft}>
                <Text style={styles.forecastDay}>{getForecastDayName(index)}</Text>
                <Text style={styles.forecastDate}>{formatForecastDate(index)}</Text>
              </View>
              <View style={styles.forecastCenter}>
                <Image 
                  source={item.icon === 'rain' 
                    ? require("../assets/images/rain.png") 
                    : require("../assets/images/sun.png")} 
                  style={styles.forecastIconLarge} 
                />
              </View>
              <View style={styles.forecastRight}>
                <Text style={styles.forecastCondition}>{item.condition}</Text>
                <Text style={styles.forecastTemp}>{item.tempRange}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Agricultural Weather Assessment */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 10, fontSize: 20, fontFamily: "Poppins-Bold" }]}>Agricultural Weather Assessment</Text>
        {/* Tips from API */}
        {weatherData.tips && weatherData.tips.length > 0 ? (
          weatherData.tips.map((tip, idx) => {
            const cardStyle = getTipCardStyle(tip);
            console.log(`🎨 Tip "${tip.title}" categorized as:`, 
              cardStyle.titleColor === '#d32f2f' ? 'WARNING (Red)' : 
              cardStyle.titleColor === '#388e3c' ? 'GOOD NEWS (Green)' : 
              'NEUTRAL (Blue)');
            return (
              <View key={idx} style={[
                styles.advisoryCard, 
                { 
                  backgroundColor: cardStyle.backgroundColor,
                  borderLeftWidth: 4,
                  borderLeftColor: cardStyle.borderColor,
                  borderColor: cardStyle.borderColor,
                  borderWidth: 1
                }
              ]}> 
                <Text style={[styles.advisoryTitle, { color: cardStyle.titleColor }]}>{tip.title}</Text>
                <Text style={styles.advisoryDescription}>{tip.description}</Text>
              </View>
            );
          })
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
              marginBottom: 10,
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
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginTop: 8,
    width: '95%',
    alignSelf: 'center',
  },
  forecastItemCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  forecastItemLast: {
    borderBottomWidth: 0,
  },
  forecastLeft: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  forecastCenter: {
    flex: 1,
    alignItems: 'center',
  },
  forecastRight: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  forecastDay: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    marginBottom: 1,
  },
  forecastDate: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  forecastIconLarge: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  forecastCondition: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 1,
    textAlign: 'right',
  },
  forecastTemp: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
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
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    flex: 1,
    flexWrap: "wrap",
  },
  locationHeader: {
    marginBottom: 4,
  },
  weatherMainContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  weatherLeftContent: {
    flex: 1,
    marginRight: 16,
  },
  weatherRightContent: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    minWidth: 120,
  },
  weatherCondition: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#fff",
    opacity: 0.9,
    textAlign: "right",
    marginTop: -10,
  },
  temperatureSection: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 2
  },
  temperature: {
    fontSize: 45,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    textAlign: "right",
    marginTop: -28
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
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    opacity: 0.8,
    marginBottom: 3,
    marginTop: 5
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
    marginBottom: -1,
  },
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  forecastDate: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#007AFF",
    fontStyle: "normal",
    borderTop: -30
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
    fontSize: 17,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 2,
  },
  forecastIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  forecastIcon2: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  forecastCondition: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#666",
    textAlign: "center",
    marginBottom: 2,
  },
  forecastTemp: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    textAlign: "center",
  },
  advisoryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  advisoryTitle: {
    fontSize: 16,
    fontFamily: "Poppins-ExtraBold",
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
    marginHorizontal: 20,
    marginBottom: 15,
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
