import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import CustomDatePicker from "../../components/CustomDatePicker";
import VerificationDialog from "../../components/VerificationDialog";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

const FarmerRegistrationScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSexDropdown, setShowSexDropdown] = useState(false);
  const [nationality, setNationality] = useState("");
  const [sex, setSex] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  // Farm info
  const [farmType, setFarmType] = useState("");
  const [landSize, setLandSize] = useState("");
  const [landLocation, setLandLocation] = useState("");
  const [pin, setPin] = useState(null);
  
  // Auth info
  const [password, setPassword] = useState("");
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [borderAnims] = useState({
    firstName: new Animated.Value(0),
    lastName: new Animated.Value(0),
    email: new Animated.Value(0),
    contactNumber: new Animated.Value(0),
    password: new Animated.Value(0),
    farmType: new Animated.Value(0),
    landSize: new Animated.Value(0),
    landLocation: new Animated.Value(0),
    address: new Animated.Value(0),
    nationality: new Animated.Value(0),
  });
  
  const defaultMapRegion = {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

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

  if (!fontsLoaded) return null;

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[1-9]\d{0,15}$/;

    if (!email.trim()) {
      return "Email is required";
    }

    if (phoneRegex.test(email.replace(/[\s\-()]/g, ''))) {
      return "Please enter an email address, not a phone number";
    }

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+63|0)9\d{9}$/;

    if (!phone.trim()) {
      return "Contact number is required";
    }

    if (!phoneRegex.test(phone.replace(/[\s\-()]/g, ''))) {
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
    if (!value?.trim()) {
      return `${fieldName} is required`;
    }
    return "";
  };

  const validateLandSize = (size) => {
    if (!size.trim()) {
      return "Land size is required";
    }
    if (!/^\d+(\.\d+)?\s*(hectare|hectares|ha|sqm|sq\s*m|square\s*meter)s?$/i.test(size)) {
      return "Please specify size with unit (e.g., '2 hectares', '5000 sqm')";
    }
    return "";
  };

  // Animation for red border flash

  if (!fontsLoaded) return null;

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

  // Field update helper
  const updateFieldValue = (field, value) => {
    const setters = {
      firstName: setFirstName,
      lastName: setLastName,
      email: setEmail,
      contactNumber: setContactNumber,
      password: setPassword,
      farmType: setFarmType,
      landSize: setLandSize,
      landLocation: setLandLocation,
      address: setAddress,
      nationality: setNationality,
    };
    setters[field]?.(value);
  };

  // Real-time validation handlers
  const handleFieldChange = (field, value, validator) => {
    updateFieldValue(field, value);
    const error = validator ? validator(value) : validateRequired(value, field);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBack = () => router.back();

  const validateAllFields = () => {
    return {
      firstName: validateRequired(firstName, "First name"),
      lastName: validateRequired(lastName, "Last name"),
      email: validateEmail(email),
      contactNumber: validatePhoneNumber(contactNumber),
      password: validatePassword(password),
      farmType: validateRequired(farmType, "Farm type"),
      landSize: validateLandSize(landSize),
      landLocation: validateRequired(landLocation, "Land location"),
      address: validateRequired(address, "Current address"),
      nationality: validateRequired(nationality, "Nationality"),
    };
  };

  const handleValidationErrors = (validationErrors) => {
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
    }
    return hasErrors;
  };

  const validateRequiredSelections = () => {
    if (!birthdate) {
      Alert.alert("Missing Information", "Please select your birthdate");
      return false;
    }

    if (!sex) {
      Alert.alert("Missing Information", "Please select your sex");
      return false;
    }
    return true;
  };

  const processFormSubmission = () => {
    const validationErrors = validateAllFields();
    
    if (handleValidationErrors(validationErrors)) {
      return false;
    }

    if (!validateRequiredSelections()) {
      return false;
    }

    setShowVerificationDialog(true);
    return true;
  };

  const handleSubmit = () => {
    processFormSubmission();
  };

  const handleConfirmSubmit = () => {
    // Close the verification dialog
    setShowVerificationDialog(false);
    
    // Navigate to the welcome screen
    router.replace("/register/welcome-farmer");
  };

  const handleDatePickerOpen = () => {
    setShowSexDropdown(false);
    setShowDatePicker(true);
  };

  const handleSexDropdownToggle = () => {
    setShowSexDropdown(true);
  };

  const handleSexSelection = (selectedSex) => {
    setSex(selectedSex);
    setShowSexDropdown(false);
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPin({ latitude, longitude });
    setLandLocation("Selected Location");
  };

  const handleDateChange = (selectedDate) => {
    setBirthdate(selectedDate);
  };

  const getSexDisplayText = () => {
    if (!sex) return "Select Sex";
    return sex === 'male' ? 'Male' : 'Female';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
    setShowSexDropdown(false);
  };

  const handleVerificationDialogClose = () => {
    setShowVerificationDialog(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header (Back pill on left, brand on right) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backPill}>
            <Text style={styles.backPillIcon}>←</Text>
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={agriangatLogo} style={styles.logo} />
            <View>
              <Text style={styles.logoBrand}>AgriAngat</Text>
              <Text style={styles.logoSubtitle}>For Farmer</Text>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.sectionTitle}>Your Information</Text>
        <View style={styles.form}>
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
          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.rowItem]}>
              <TouchableOpacity
                style={[styles.input, styles.dateInput]}
                onPress={handleDatePickerOpen}
              >
                <Text style={birthdate ? styles.dateText : styles.placeholderText}>
                  {birthdate ? formatDate(birthdate) : "Birthdate"}
                </Text>
                <Text style={styles.dropdownArrow}>📅</Text>
              </TouchableOpacity>
            </View>
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
          </View>
          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.rowItem]}>
              <TouchableOpacity
                style={[styles.input, styles.dateInput]}
                onPress={handleSexDropdownToggle}
              >
                <Text style={sex ? styles.dateText : styles.placeholderText}>
                  {getSexDisplayText()}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showSexDropdown && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSexSelection('')}
                  >
                    <Text style={[styles.dropdownText, styles.placeholderDropdownText]}>Select Sex</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSexSelection('male')}
                  >
                    <Text style={styles.dropdownText}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSexSelection('female')}
                  >
                    <Text style={styles.dropdownText}>Female</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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

          <Text style={styles.sectionTitleInner}>Your Land Information</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.farmType && {
              borderColor: borderAnims.farmType.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.farmType && styles.inputError]}
              placeholder="Farm Type (e.g., Rice, Corn, Mixed Vegetables)"
              placeholderTextColor="#9aa0a6"
              value={farmType}
              onChangeText={(value) => handleFieldChange('farmType', value)}
            />
          </Animated.View>
          {errors.farmType ? <Text style={styles.errorText}>{errors.farmType}</Text> : null}
          <Animated.View style={[
            styles.inputWrapper,
            errors.landSize && {
              borderColor: borderAnims.landSize.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.landSize && styles.inputError]}
              placeholder="Land Size (e.g., 2 hectares, 5000 sqm)"
              placeholderTextColor="#9aa0a6"
              value={landSize}
              onChangeText={(value) => handleFieldChange('landSize', value, validateLandSize)}
            />
          </Animated.View>
          {errors.landSize ? <Text style={styles.errorText}>{errors.landSize}</Text> : null}
          <Animated.View style={[
            styles.inputWrapper,
            errors.landLocation && {
              borderColor: borderAnims.landLocation.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.input, errors.landLocation && styles.inputError]}
              placeholder="Land Location (tap on map to select)"
              placeholderTextColor="#9aa0a6"
              value={landLocation}
              onChangeText={(value) => handleFieldChange('landLocation', value)}
            />
          </Animated.View>
          {errors.landLocation ? <Text style={styles.errorText}>{errors.landLocation}</Text> : null}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={defaultMapRegion}
              onPress={handleMapPress}
            >
              {pin && <Marker coordinate={pin} />}
            </MapView>
          </View>

          <Text style={styles.sectionTitleInner2}>Set your password</Text>
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
            By submitting, you agree to share your personal and farm information with AgriAngat and its partner banks for the purpose of evaluating and processing your AngatScore and loan applications in the future.
          </Text>
          <Text style={styles.disclaimer}>
            Please ensure that all information provided is true and accurate, as incomplete or false details may affect your AngatScore and loan eligibility.
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleBack}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Custom Date Picker */}
      <CustomDatePicker
        value={birthdate}
        onChange={handleDateChange}
        visible={showDatePicker}
        onClose={handleDatePickerClose}
        maximumDate={new Date()}
        placeholder="Birthdate"
      />
      
      {/* Verification Dialog */}
      <VerificationDialog
        visible={showVerificationDialog}
        onClose={handleVerificationDialogClose}
        onConfirm={handleConfirmSubmit}
        title="Confirm Farmer Registration"
        message="Are you sure all the information you provided is correct? Please review before submitting."
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
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
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backPillIcon: {
    fontSize: 20,
    marginRight: 6,
    color: "#333",
  },
  backPillText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginRight: 6,
    marginLeft: 122,
    marginTop: 4,
  },
  logoBrand: {
    fontSize: 18,
    marginLeft: -12,
    marginTop: 4,
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
  placeholder: {
    width: 46,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 8,
  },
  sectionTitleInner: {
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    marginHorizontal: 0,
    marginTop: 50,
    marginBottom: 8,
  },
  sectionTitleInner2: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginHorizontal: 0,
    marginTop: 45,
    marginBottom: 8,
  },
  form: {
    paddingHorizontal: 20,
  },
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  pickerField: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    marginRight: 10,
    marginTop: 60,
    borderWidth: 2,
    borderColor: "#111",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    marginLeft: 10,
    marginTop: 60,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  cancelText: {
    color: "#111",
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
  map: {
    width: "100%",
    height: 160,
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
  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0FFE0",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundRingsContainer: {
    position: 'absolute',
    top: -20,
    right: -40,
    bottom: -20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backgroundRings: {
    width: 300,
    height: 500,
    marginTop: -20,
    marginRight: -100,
    transform: [{ rotate: "100deg" }],
  },
  welcomeContentContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  welcomeTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
    marginBottom: 0,
  },
  welcomeSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#174c1a",
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
});

export default FarmerRegistrationScreen;