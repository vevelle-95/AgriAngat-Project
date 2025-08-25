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
  Modal,
  Pressable,
} from "react-native";
import * as Font from "expo-font";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import CustomDatePicker from "../../components/CustomDatePicker";
import VerificationDialog from "../../components/VerificationDialog";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

const CustomerRegistrationScreen = () => {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [showCivilStatusModal, setShowCivilStatusModal] = useState(false);
  const [birthdate, setBirthdate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSexDropdown, setShowSexDropdown] = useState(false);
  const [nationality, setNationality] = useState("");
  const [sex, setSex] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

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
    placeOfBirth: new Animated.Value(0),
    email: new Animated.Value(0),
    contactNumber: new Animated.Value(0),
    password: new Animated.Value(0),
    storeType: new Animated.Value(0),
    storeSize: new Animated.Value(0),
    storeLocation: new Animated.Value(0),
    address: new Animated.Value(0),
    nationality: new Animated.Value(0),
    civilStatus: new Animated.Value(0),
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
    switch (field) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'placeOfBirth': setPlaceOfBirth(value); break;
      case 'email': setEmail(value); break;
      case 'contactNumber': setContactNumber(value); break;
      case 'password': setPassword(value); break;
      case 'storeType': setStoreType(value); break;
      case 'storeSize': setStoreSize(value); break;
      case 'storeLocation': setStoreLocation(value); break;
      case 'address': setAddress(value); break;
      case 'nationality': setNationality(value); break;
      case 'civilStatus': setCivilStatus(value); break;
    }
    
    // Validate and update errors
    const error = validator ? validator(value) : validateRequired(value, field);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = () => {
    const validationErrors = {
      firstName: validateRequired(firstName, "First name"),
      lastName: validateRequired(lastName, "Last name"),
      placeOfBirth: validateRequired(placeOfBirth, "Place of birth"),
      email: validateEmail(email),
      contactNumber: validatePhoneNumber(contactNumber),
      password: validatePassword(password),
      storeType: validateRequired(storeType, "Store type"),
      storeSize: validateRequired(storeSize, "Store size"),
      storeLocation: validateRequired(storeLocation, "Store location"),
      address: validateRequired(address, "Current address"),
      nationality: validateRequired(nationality, "Nationality"),
      civilStatus: validateRequired(civilStatus, "Civil status"),
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
    
    // Show verification dialog instead of directly submitting
    setShowVerificationDialog(true);
  };

  const handleConfirmSubmit = () => {
    // Close the verification dialog
    setShowVerificationDialog(false);
    
    // Navigate to the welcome screen
    router.replace("/register/welcome-customer");
  };

  if (!fontsLoaded) return null;

  const handleDateChange = (selectedDate) => {
    setBirthdate(selectedDate);
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
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Middle Name (optional)"
              placeholderTextColor="#9aa0a6"
              value={middleName}
              onChangeText={setMiddleName}
            />
          </View>
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
          <Animated.View style={[
            styles.inputWrapper,
            errors.civilStatus && {
              borderColor: borderAnims.civilStatus.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <Pressable
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowCivilStatusModal(true)}
            >
              <Text style={civilStatus ? styles.dateText : styles.placeholderText}>
                {civilStatus || "Civil Status"}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </Pressable>
          </Animated.View>
          {errors.civilStatus ? <Text style={styles.errorText}>{errors.civilStatus}</Text> : null}
          <View style={styles.row}>
            <Animated.View style={[
              styles.inputWrapper,
              styles.rowItem,
              errors.nationality && {
                borderColor: borderAnims.nationality.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#ff4444', '#ff0000']
                })
              }
            ]}>
              <TextInput
                style={[styles.input, errors.nationality && styles.inputError]}
                placeholder="Nationality"
                placeholderTextColor="#9aa0a6"
                value={nationality}
                onChangeText={(value) => handleFieldChange('nationality', value)}
              />
            </Animated.View>
            <View style={[styles.inputWrapper, styles.rowItem]}>
              <TouchableOpacity
                style={[styles.input, styles.dateInput]}
                onPress={() => {
                  setShowSexDropdown(false);
                  setShowDatePicker(true);
                }}
              >
                <Text style={birthdate ? styles.dateText : styles.placeholderText}>
                  {birthdate ? formatDate(birthdate) : "Birthdate"}
                </Text>
                <Text style={styles.dropdownArrow}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
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
            <View style={[styles.inputWrapper, styles.rowItem]}>
              <TouchableOpacity
                style={[styles.input, styles.dateInput]}
                onPress={() => {
                  setShowSexDropdown(true);
                }}
              >
                <Text style={sex ? styles.dateText : styles.placeholderText}>
                  {sex ? (sex === 'male' ? 'Male' : 'Female') : "Select Sex"}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showSexDropdown && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSex('');
                      setShowSexDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownText, styles.placeholderDropdownText]}>Select Sex</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSex('male');
                      setShowSexDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSex('female');
                      setShowSexDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>Female</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}
          <Animated.View style={[
            styles.inputWrapper,
            errors.placeOfBirth && {
              borderColor: borderAnims.placeOfBirth.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.placeOfBirth && styles.inputError]}
              placeholder="Place of Birth"
              placeholderTextColor="#9aa0a6"
              value={placeOfBirth}
              onChangeText={(value) => handleFieldChange('placeOfBirth', value)}
              autoCapitalize="words"
            />
          </Animated.View>
          {errors.placeOfBirth ? <Text style={styles.errorText}>{errors.placeOfBirth}</Text> : null}
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
          <Animated.View style={[
            styles.inputWrapper,
            errors.address && {
              borderColor: borderAnims.address.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              placeholder="Current Address"
              placeholderTextColor="#9aa0a6"
              value={address}
              onChangeText={(value) => handleFieldChange('address', value)}
            />
          </Animated.View>
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

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
          <Animated.View style={[
            styles.inputWrapper,
            errors.storeType && {
              borderColor: borderAnims.storeType.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.storeType && styles.inputError]}
              placeholder="Store Type (e.g., Sari-sari store, Mini mart, Stall)"
              placeholderTextColor="#9aa0a6"
              value={storeType}
              onChangeText={(value) => handleFieldChange('storeType', value)}
            />
          </Animated.View>
          {errors.storeType ? <Text style={styles.errorText}>{errors.storeType}</Text> : null}
          <Animated.View style={[
            styles.inputWrapper,
            errors.storeSize && {
              borderColor: borderAnims.storeSize.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.storeSize && styles.inputError]}
              placeholder="Store Size (e.g., 20 sqm)"
              placeholderTextColor="#9aa0a6"
              value={storeSize}
              onChangeText={(value) => handleFieldChange('storeSize', value)}
            />
          </Animated.View>
          {errors.storeSize ? <Text style={styles.errorText}>{errors.storeSize}</Text> : null}
          <Animated.View style={[
            styles.inputWrapper,
            errors.storeLocation && {
              borderColor: borderAnims.storeLocation.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.storeLocation && styles.inputError]}
              placeholder="Store Location (tap on map to select)"
              placeholderTextColor="#9aa0a6"
              value={storeLocation}
              onChangeText={(value) => handleFieldChange('storeLocation', value)}
            />
          </Animated.View>
          {errors.storeLocation ? <Text style={styles.errorText}>{errors.storeLocation}</Text> : null}
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
        onClose={() => {
          setShowDatePicker(false);
          setShowSexDropdown(false);
        }}
        maximumDate={new Date()}
        placeholder="Birthdate"
      />
      
      {/* Verification Dialog */}
      <VerificationDialog
        visible={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Customer Registration"
        message="Are you sure all the information you provided is correct? Please review before submitting."
      />

      {/* Civil Status Modal */}
      <Modal
        visible={showCivilStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCivilStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Civil Status</Text>
              <Pressable 
                style={styles.modalCloseButton}
                onPress={() => setShowCivilStatusModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.modalOptions}>
              <Pressable
                style={[styles.modalOption, civilStatus === 'Single' && styles.modalOptionSelected]}
                onPress={() => {
                  setCivilStatus('Single');
                  setShowCivilStatusModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, civilStatus === 'Single' && styles.modalOptionTextSelected]}>
                  Single
                </Text>
                {civilStatus === 'Single' && <Text style={styles.modalOptionCheck}>✓</Text>}
              </Pressable>
              <Pressable
                style={[styles.modalOption, civilStatus === 'Married' && styles.modalOptionSelected]}
                onPress={() => {
                  setCivilStatus('Married');
                  setShowCivilStatusModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, civilStatus === 'Married' && styles.modalOptionTextSelected]}>
                  Married
                </Text>
                {civilStatus === 'Married' && <Text style={styles.modalOptionCheck}>✓</Text>}
              </Pressable>
              <Pressable
                style={[styles.modalOption, civilStatus === 'Separated' && styles.modalOptionSelected]}
                onPress={() => {
                  setCivilStatus('Separated');
                  setShowCivilStatusModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, civilStatus === 'Separated' && styles.modalOptionTextSelected]}>
                  Separated
                </Text>
                {civilStatus === 'Separated' && <Text style={styles.modalOptionCheck}>✓</Text>}
              </Pressable>
              <Pressable
                style={[styles.modalOption, civilStatus === 'Widowed' && styles.modalOptionSelected]}
                onPress={() => {
                  setCivilStatus('Widowed');
                  setShowCivilStatusModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, civilStatus === 'Widowed' && styles.modalOptionTextSelected]}>
                  Widowed
                </Text>
                {civilStatus === 'Widowed' && <Text style={styles.modalOptionCheck}>✓</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  dropdownArrow: {
    position: 'absolute',
    right: 12,
    fontSize: 12,
    color: '#666',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginTop: 2,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  customDateText: {
    color: '#007AFF',
    fontFamily: 'Poppins-Bold',
  },
  placeholderDropdownText: {
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  // Civil Status Modal specific styles
  modalOptions: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#007AFF',
    fontFamily: 'Poppins-SemiBold',
  },
  modalOptionCheck: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Poppins-Bold',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#666',
  },
});
