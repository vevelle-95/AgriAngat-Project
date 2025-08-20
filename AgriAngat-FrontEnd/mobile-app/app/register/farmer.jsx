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
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
// Maps
import MapView, { Marker } from "react-native-maps";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

const FarmerRegistrationScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [nationality, setNationality] = useState("");
  const [sex, setSex] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Farm info
  const [farmType, setFarmType] = useState("");
  const [landSize, setLandSize] = useState("");
  const [landLocation, setLandLocation] = useState("");
  const [pin, setPin] = useState(null);
  const defaultMapRegion = {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  const [password, setPassword] = useState("");

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

  const handleBack = () => router.replace("/login");
  const handleSubmit = () => {
    // Placeholder submission handler; wire to API later
    router.replace("/register/welcome-farmer");
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPin({ latitude, longitude });
    setLandLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
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
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#9aa0a6"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Middle Name (optional)"
            placeholderTextColor="#9aa0a6"
            value={middleName}
            onChangeText={setMiddleName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#9aa0a6"
            value={lastName}
            onChangeText={setLastName}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowItem]}
              placeholder="Birthdate"
              placeholderTextColor="#9aa0a6"
              value={birthdate}
              onChangeText={setBirthdate}
            />
            <TextInput
              style={[styles.input, styles.rowItem]}
              placeholder="Nationality"
              placeholderTextColor="#9aa0a6"
              value={nationality}
              onChangeText={setNationality}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowItem]}
              placeholder="Sex"
              placeholderTextColor="#9aa0a6"
              value={sex}
              onChangeText={setSex}
            />
            <TextInput
              style={[styles.input, styles.rowItem]}
              placeholder="Contact Number"
              placeholderTextColor="#9aa0a6"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9aa0a6"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Current Address"
            placeholderTextColor="#9aa0a6"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.sectionTitleInner}>Your Land Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Farm Type (e.g., Rice, Corn, Mixed Vegetables)"
            placeholderTextColor="#9aa0a6"
            value={farmType}
            onChangeText={setFarmType}
          />
          <TextInput
            style={styles.input}
            placeholder="Land Size (e.g., 2 hectares)"
            placeholderTextColor="#9aa0a6"
            value={landSize}
            onChangeText={setLandSize}
          />
          <TextInput
            style={styles.input}
            placeholder="Land Location (enter or pin on map)"
            placeholderTextColor="#9aa0a6"
            value={landLocation}
            onChangeText={setLandLocation}
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

          <Text style={styles.sectionTitleInner2}>Set your password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9aa0a6"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

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
    </KeyboardAvoidingView>
  );
};

export default FarmerRegistrationScreen;

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
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
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
});
