import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomPicker from "../../components/CustomPicker";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

const CustomerRegistrationScreen = () => {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nationality, setNationality] = useState("");
  const [sex, setSex] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Store info
  const [storeType, setStoreType] = useState("");
  const [storeSize, setStoreSize] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [pin, setPin] = useState(null);

  const defaultMapRegion = {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const [password, setPassword] = useState("");

  // Validation states
  const [errors, setErrors] = useState({});
  const [borderAnims] = useState({
    firstName: new Animated.Value(0),
    lastName: new Animated.Value(0),
    email: new Animated.Value(0),
    contactNumber: new Animated.Value(0),
    password: new Animated.Value(0),
  });

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

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (!email.trim()) {
      return "Email is required";
    }
    
    if (phoneRegex.test(email.replace(/[\s\-\(\)]/g, ''))) {
      return "Please enter an email address, not a phone number";
    }
    
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return "";
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+63|0)[9][0-9]{9}$/;
    
    if (!phone.trim()) {
      return "Contact number is required";
    }
    
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return "Please enter a valid Philippine mobile number";
    }
    
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return "";
  };

  const validateRequired = (value, fieldName) => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    return "";
  };

  // Animation for red border flash
  const flashBorder = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Real-time validation handlers
  const handleFieldChange = (field, value, validator) => {
    // Update field value
    switch(field) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'email': setEmail(value); break;
      case 'contactNumber': setContactNumber(value); break;
      case 'password': setPassword(value); break;
    }
    
    // Validate and update errors
    const error = validator ? validator(value) : validateRequired(value, field);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = () => {
    const validationErrors = {
      firstName: validateRequired(firstName, "First name"),
      lastName: validateRequired(lastName, "Last name"),
      email: validateEmail(email),
      contactNumber: validatePhoneNumber(contactNumber),
      password: validatePassword(password),
    };
    
    setErrors(validationErrors);
    
    // Flash borders for invalid fields
    Object.keys(validationErrors).forEach(field => {
      if (validationErrors[field] && borderAnims[field]) {
        flashBorder(borderAnims[field]);
      }
    });
    
    const hasErrors = Object.values(validationErrors).some(error => error !== "");
    
    if (hasErrors) {
      Alert.alert("Validation Error", "Please fix the errors below");
      return;
    }
    
    // Additional validation for optional fields
    if (!birthdate) {
      Alert.alert("Missing Information", "Please select your birthdate");
      return;
    }
    
    if (!sex) {
      Alert.alert("Missing Information", "Please select your sex");
      return;
    }
    
    router.replace("/register/welcome-customer");
  };

  if (!fontsLoaded) return null;

  const handleDateChange = (selectedDate) => {
    setBirthdate(selectedDate);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPin({ latitude, longitude });
    // For now, we'll use a placeholder location name
    // In a real app, you'd use reverse geocoding to get the actual address
    setStoreLocation("Selected Location");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top bar with Back and Logo */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backPill}
          >
            <Text style={styles.backPillIcon}>←</Text>
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={agriangatLogo} style={styles.logo} />
            <View>
              <Text style={styles.logoBrand}>AgriAngat</Text>
              <Text style={styles.logoSubtitle}>For Customer/Store</Text>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.sectionTitle}>Your Information</Text>
        <View style={styles.form}>
          {/* Personal Info Inputs */}
          <Animated.View style={[
            styles.inputWrapper,
            errors.firstName && {
              borderColor: borderAnims.firstName.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="First Name"
              placeholderTextColor="#9aa0a6"
              value={firstName}
              onChangeText={(value) => handleFieldChange('firstName', value)}
            />
          </Animated.View>
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Middle Name (optional)"
            placeholderTextColor="#9aa0a6"
            value={middleName}
            onChangeText={setMiddleName}
          />
          <Animated.View style={[
            styles.inputWrapper,
            errors.lastName && {
              borderColor: borderAnims.lastName.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Last Name"
              placeholderTextColor="#9aa0a6"
              value={lastName}
              onChangeText={(value) => handleFieldChange('lastName', value)}
            />
          </Animated.View>
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.input, styles.rowItem, styles.dateInput]}
              onPress={handleDatePress}
            >
              <Text style={birthdate ? styles.dateText : styles.placeholderText}>
                {birthdate ? formatDate(birthdate) : "Birthdate"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.rowItem]}
              placeholder="Nationality"
              placeholderTextColor="#9aa0a6"
              value={nationality}
              onChangeText={setNationality}
            />
          </View>
          <View style={styles.row}>
            <CustomPicker
              selectedValue={sex}
              onValueChange={setSex}
              items={[
                { label: "Select Sex", value: "" },
                { label: "Male", value: "male" },
                { label: "Female", value: "female" }
              ]}
              placeholder="Select Sex"
              style={[styles.rowItem, styles.pickerField]}
            />
            <Animated.View style={[
              styles.inputWrapper,
              styles.rowItem,
              errors.contactNumber && {
                borderColor: borderAnims.contactNumber.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#ff4444', '#ff0000']
                })
              }
            ]}>
              <TextInput
                style={[styles.input, errors.contactNumber && styles.inputError]}
                placeholder="Contact Number"
                placeholderTextColor="#9aa0a6"
                value={contactNumber}
                onChangeText={(value) => handleFieldChange('contactNumber', value, validatePhoneNumber)}
                keyboardType="phone-pad"
              />
            </Animated.View>
          </View>
          {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}
          <Animated.View style={[
            styles.inputWrapper,
            errors.email && {
              borderColor: borderAnims.email.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#9aa0a6"
              value={email}
              onChangeText={(value) => handleFieldChange('email', value, validateEmail)}
              keyboardType="email-address"
            />
          </Animated.View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Current Address"
            placeholderTextColor="#9aa0a6"
            value={address}
            onChangeText={setAddress}
          />

          {/* Store Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 30,
              marginBottom: 8,
            }}
          >
            <Text style={styles.sectionTitleInner}>Your Store Location</Text>
            <Text style={styles.sectionTitleInner2}>(for store owners)</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Store Type (e.g., Sari-sari store, Mini mart, Stall)"
            placeholderTextColor="#9aa0a6"
            value={storeType}
            onChangeText={setStoreType}
          />
          <TextInput
            style={styles.input}
            placeholder="Store Size (e.g., 20 sqm)"
            placeholderTextColor="#9aa0a6"
            value={storeSize}
            onChangeText={setStoreSize}
          />
          <TextInput
            style={styles.input}
            placeholder="Store Location (tap on map to select)"
            placeholderTextColor="#9aa0a6"
            value={storeLocation}
            onChangeText={setStoreLocation}
          />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={defaultMapRegion}
              onPress={handleMapPress}
            >
              {pin && <Marker coordinate={pin} />}
            </MapView>
          </View>

          {/* Password */}
          <Text style={styles.sectionTitleInner}>Set your password</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.password && {
              borderColor: borderAnims.password.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="#9aa0a6"
              value={password}
              onChangeText={(value) => handleFieldChange('password', value, validatePassword)}
              secureTextEntry
            />
          </Animated.View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={styles.disclaimer}>
          By submitting, you agree to share your personal and store information with AgriAngat.
          </Text>
          <Text style={styles.disclaimer}>
            Please ensure that all information provided is true and accurate, as
            incomplete or false details may affect your marketplace trust rating.
          </Text>
          <View style={{ height: 12 }} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingVertical: 12,
                borderRadius: 24,
                alignItems: "center",
                marginRight: 8,
                borderWidth: 2,
                borderColor: "#111",
                marginTop: 60,
              }}
              onPress={() => router.replace("/login")}
            >
              <Text style={{ fontFamily: "Poppins-Bold", color: "#111" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#007AFF",
                paddingVertical: 12,
                borderRadius: 24,
                alignItems: "center",
                marginLeft: 8,
                marginTop: 60,
              }}
              onPress={handleSubmit}
            >
              <Text style={{ fontFamily: "Poppins-Bold", color: "#fff" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Custom Date Picker */}
      <CustomDatePicker
        value={birthdate}
        onChange={handleDateChange}
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        placeholder="Birthdate"
      />
    </KeyboardAvoidingView>
  );
};

export default CustomerRegistrationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingTop: 24, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginTop: -20,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backPillIcon: { fontSize: 14, marginRight: 6, color: "#333" },
  backPillText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Poppins-ExtraBold",
  },
  logoContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginRight: 6,
    marginLeft: 125,
    marginTop: -20,
  },
  logoBrand: {
    fontSize: 18,
    marginLeft: -12,
    marginTop: -20,
    color: "#666",
    fontFamily: "Poppins-ExtraBold",
  },
  logoSubtitle: {
    fontSize: 9,
    color: "#666",
    fontFamily: "Poppins-Regular",
    marginTop: -2,
    marginLeft: -12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 8,
  },
  sectionTitleInner: {
    fontSize: 18,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    marginHorizontal: 0,
    marginTop: 30,
    marginBottom: 2,
  },
  sectionTitleInner2: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginHorizontal: 0,
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
  },
  form: { paddingHorizontal: 20 },
  inputWrapper: {
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    backgroundColor: "transparent",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
    marginLeft: 4,
  },
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  pickerField: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 25,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  map: { width: "100%", height: 160 },
  placeholder: {
    width: 46,
  },
  dateInput: {
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  dateText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#9aa0a6",
  },
  pickerContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: "100%",
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  modalButton: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#007AFF',
  },
});
