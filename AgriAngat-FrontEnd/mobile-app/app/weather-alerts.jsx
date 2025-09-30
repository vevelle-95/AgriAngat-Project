import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Switch,
} from 'react-native';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';

const WeatherAlertsScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    sms_enabled: true,
    whatsapp_enabled: false,
    phone_number: '+639123456789',
    city: 'manila',
    alert_types: ['severe_weather', 'temperature_extreme', 'heavy_rain', 'strong_wind']
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const router = useRouter();

  // Using your computer's IP address
  const API_BASE_URL = 'http://26.109.250.170:5000'; // Your computer's IP address

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
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Check server health
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setServerStatus(healthData);
      }

      // Load preferences
      const prefsResponse = await fetch(`${API_BASE_URL}/api/alerts/preferences`);
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        if (prefsData.success) {
          setPreferences(prefsData.preferences);
        }
      }

      // Load monitoring status
      const statusResponse = await fetch(`${API_BASE_URL}/api/alerts/status`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setIsMonitoring(statusData.status.is_running);
        }
      }

      // Load current weather
      const weatherResponse = await fetch(`${API_BASE_URL}/api/weather/${preferences.city}`);
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        if (weatherData.success) {
          setCurrentWeather(weatherData.weatherData);
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert(
        'Connection Error', 
        `Could not connect to weather server at ${API_BASE_URL}. Make sure the Python server is running and the IP address is correct.`
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPrefs) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/alerts/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs),
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(data.preferences);
        Alert.alert('Success', 'Preferences updated!');
      } else {
        Alert.alert('Error', data.error || 'Failed to update preferences');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleMonitoring = async () => {
    try {
      setLoading(true);
      const endpoint = isMonitoring ? '/api/alerts/stop' : '/api/alerts/start';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST' });

      const data = await response.json();
      if (data.success) {
        setIsMonitoring(!isMonitoring);
        Alert.alert('Success', isMonitoring ? 'Monitoring stopped' : 'Monitoring started');
      } else {
        Alert.alert('Error', data.error || 'Failed to toggle monitoring');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not toggle monitoring');
    } finally {
      setLoading(false);
    }
  };

  const testAlert = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/test/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: preferences.phone_number,
          message: `Test ${type.toUpperCase()} from AgriAngat 🌤️`
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', `Test ${type.toUpperCase()} sent! Check your phone.`);
      } else {
        Alert.alert('Error', data.error || `Failed to send ${type}`);
      }
    } catch (error) {
      Alert.alert('Error', `Could not send test ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const manualCheck = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/alerts/check`, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        if (data.alert_sent) {
          Alert.alert('Alert Sent!', 'Weather conditions triggered an alert. Check your phone!');
        } else {
          Alert.alert('No Alert Needed', 'Current weather conditions are normal.');
        }
      } else {
        Alert.alert('Error', data.error || 'Failed to check weather');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not check weather');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0f6d00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weather Alerts</Text>
      </View>

      {/* Server Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🖥️ Server Status</Text>
        {serverStatus ? (
          <View>
            <Text style={styles.statusText}>✅ Connected to weather server</Text>
            <Text style={styles.statusSubtext}>Service: {serverStatus.service}</Text>
            <Text style={styles.statusSubtext}>
              Twilio: {serverStatus.twilio_configured ? '✅ Configured' : '❌ Not configured'}
            </Text>
          </View>
        ) : (
          <Text style={styles.statusText}>❌ Could not connect to server</Text>
        )}
      </View>

      {/* Current Weather */}
      {currentWeather && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌤️ Current Weather</Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLocation}>{currentWeather.location}</Text>
            <Text style={styles.weatherTemp}>{currentWeather.temperature}°C</Text>
            <Text style={styles.weatherDesc}>{currentWeather.description}</Text>
            <Text style={styles.weatherDetail}>Humidity: {currentWeather.humidity}%</Text>
          </View>
        </View>
      )}

      {/* Monitoring Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📡 Monitoring Status</Text>
        <View style={styles.monitoringRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isMonitoring ? '#4CAF50' : '#FF5722' }]} />
            <Text style={styles.statusLabel}>
              {isMonitoring ? 'Active - Checking weather every 30 minutes' : 'Inactive'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isMonitoring ? '#FF5722' : '#4CAF50' }]}
          onPress={toggleMonitoring}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Alert Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Alert Settings</Text>
        
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>SMS Alerts</Text>
          <Switch
            value={preferences.sms_enabled}
            onValueChange={(value) => updatePreferences({ sms_enabled: value })}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.sms_enabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>WhatsApp Alerts</Text>
          <Switch
            value={preferences.whatsapp_enabled}
            onValueChange={(value) => updatePreferences({ whatsapp_enabled: value })}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={preferences.whatsapp_enabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.phoneRow}>
          <Text style={styles.phoneLabel}>📱 Phone Number:</Text>
          <TextInput
            style={styles.phoneInput}
            value={preferences.phone_number}
            onChangeText={(text) => setPreferences({...preferences, phone_number: text})}
            placeholder="+639123456789"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => updatePreferences({ phone_number: preferences.phone_number })}
        >
          <Text style={styles.updateButtonText}>Update Phone Number</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧪 Test & Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={manualCheck} disabled={loading}>
          <Text style={styles.actionButtonText}>Check Weather Now</Text>
        </TouchableOpacity>

        <View style={styles.testButtonRow}>
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: '#2196F3' }]}
            onPress={() => testAlert('sms')}
            disabled={loading}
          >
            <Text style={styles.testButtonText}>Test SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: '#25D366' }]}
            onPress={() => testAlert('whatsapp')}
            disabled={loading}
          >
            <Text style={styles.testButtonText}>Test WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Instructions</Text>
        <Text style={styles.instructionText}>
          1. Make sure the Python weather server is running{'\n'}
          2. Update the API_BASE_URL in this file with your computer's IP{'\n'}
          3. Configure your Twilio credentials in the backend .env file{'\n'}
          4. Test SMS/WhatsApp functionality{'\n'}
          5. Start monitoring to receive automatic alerts
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#0f6d00',
  },
  title: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 24,
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#111',
    marginBottom: 12,
  },
  statusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statusSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  weatherLocation: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#111',
  },
  weatherTemp: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 32,
    color: '#0f6d00',
    marginVertical: 4,
  },
  weatherDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherDetail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  monitoringRow: {
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  phoneRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  phoneLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  updateButton: {
    backgroundColor: '#0f6d00',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#0f6d00',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
  testButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  testButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  testButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#fff',
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default WeatherAlertsScreen;