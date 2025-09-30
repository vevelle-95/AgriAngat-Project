import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Font from 'expo-font';

const WeatherAlertPanel = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [alertPreferences, setAlertPreferences] = useState({
    sms_enabled: true,
    whatsapp_enabled: false,
    phone_number: '+639123456789',
    city: 'manila',
    alert_types: ['severe_weather', 'temperature_extreme', 'heavy_rain', 'strong_wind']
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastAlert, setLastAlert] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  // Backend API base URL - using your computer's IP address
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
    
    // Load initial preferences and status
    loadAlertStatus();
  }, []);

  const loadAlertStatus = async () => {
    try {
      setLoading(true);
      
      // Get alert preferences
      const prefsResponse = await fetch(`${API_BASE_URL}/api/alerts/preferences`);
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        if (prefsData.success) {
          setAlertPreferences(prefsData.preferences);
        }
      }

      // Get alert service status
      const statusResponse = await fetch(`${API_BASE_URL}/api/alerts/status`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setIsMonitoring(statusData.status.is_running);
          setLastAlert(statusData.status.preferences.last_alert_sent);
        }
      }

      // Get current weather
      const weatherResponse = await fetch(`${API_BASE_URL}/api/weather/${alertPreferences.city}`);
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        if (weatherData.success) {
          setCurrentWeather(weatherData.weatherData);
        }
      }

    } catch (error) {
      console.error('Error loading alert status:', error);
      Alert.alert('Connection Error', 'Could not connect to weather alert service. Make sure the Python server is running.');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/alerts/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      const data = await response.json();
      
      if (data.success) {
        setAlertPreferences(data.preferences);
        Alert.alert('Success', 'Alert preferences updated successfully!');
      } else {
        Alert.alert('Error', data.error || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Could not update preferences. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMonitoring = async () => {
    try {
      setLoading(true);
      
      const endpoint = isMonitoring ? '/api/alerts/stop' : '/api/alerts/start';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setIsMonitoring(!isMonitoring);
        Alert.alert(
          'Success', 
          isMonitoring ? 'Weather monitoring stopped' : 'Weather monitoring started'
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to toggle monitoring');
      }
    } catch (error) {
      console.error('Error toggling monitoring:', error);
      Alert.alert('Error', 'Could not toggle monitoring. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const testAlert = async (type = 'sms') => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/test/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: alertPreferences.phone_number,
          message: `Test ${type.toUpperCase()} from AgriAngat Weather Alert System 🌤️`
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Success', `Test ${type.toUpperCase()} sent successfully!`);
      } else {
        Alert.alert('Error', data.error || `Failed to send test ${type.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Error sending test ${type}:`, error);
      Alert.alert('Error', `Could not send test ${type.toUpperCase()}. Check your connection.`);
    } finally {
      setLoading(false);
    }
  };

  const manualWeatherCheck = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/alerts/check`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.alert_sent) {
          Alert.alert('Alert Sent', 'Weather conditions triggered an alert. Check your phone!');
        } else {
          Alert.alert('No Alert Needed', 'Current weather conditions are normal.');
        }
        
        // Update current weather display
        if (data.current_weather) {
          setCurrentWeather({
            location: data.current_weather.city,
            temperature: Math.round(data.current_weather.temperature_c),
            description: data.current_weather.description,
            humidity: data.current_weather.humidity_pct
          });
        }
      } else {
        Alert.alert('Error', data.error || 'Failed to check weather');
      }
    } catch (error) {
      console.error('Error checking weather:', error);
      Alert.alert('Error', 'Could not check weather. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0f6d00" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Weather Alerts</Text>
      
      {/* Current Weather Display */}
      {currentWeather && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherLocation}>{currentWeather.location}</Text>
          <Text style={styles.weatherTemp}>{currentWeather.temperature}°C</Text>
          <Text style={styles.weatherDesc}>{currentWeather.description}</Text>
          <Text style={styles.weatherHumidity}>Humidity: {currentWeather.humidity}%</Text>
        </View>
      )}

      {/* Monitoring Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Weather Monitoring</Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isMonitoring ? '#4CAF50' : '#FF5722' }]} />
            <Text style={styles.statusText}>{isMonitoring ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.toggleButton, { backgroundColor: isMonitoring ? '#FF5722' : '#4CAF50' }]}
          onPress={toggleMonitoring}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.toggleButtonText}>
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Alert Preferences */}
      <View style={styles.preferencesCard}>
        <Text style={styles.cardTitle}>Alert Settings</Text>
        
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>SMS Alerts</Text>
          <Switch
            value={alertPreferences.sms_enabled}
            onValueChange={(value) => updatePreferences({ sms_enabled: value })}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={alertPreferences.sms_enabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>WhatsApp Alerts</Text>
          <Switch
            value={alertPreferences.whatsapp_enabled}
            onValueChange={(value) => updatePreferences({ whatsapp_enabled: value })}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={alertPreferences.whatsapp_enabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <Text style={styles.phoneNumber}>📱 {alertPreferences.phone_number}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={manualWeatherCheck}
          disabled={loading}
        >
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

      {/* Last Alert Info */}
      {lastAlert && (
        <View style={styles.lastAlertCard}>
          <Text style={styles.lastAlertLabel}>Last Alert Sent:</Text>
          <Text style={styles.lastAlertTime}>
            {new Date(lastAlert).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 20,
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherLocation: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
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
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherHumidity: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#111',
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
  statusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
  preferencesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#111',
    marginBottom: 12,
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
  phoneNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButtons: {
    marginBottom: 16,
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
  lastAlertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  lastAlertLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  lastAlertTime: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#111',
    marginTop: 4,
  },
});

export default WeatherAlertPanel;