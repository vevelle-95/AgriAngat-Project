import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Checkbox } from 'expo-checkbox';
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

export default function CommunityLinks() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Community Links checkboxes
  const [palengke, setPalengke] = useState(false);
  const [tindahan, setTindahan] = useState(false);
  const [kooperatiba, setKooperatiba] = useState(false);
  const [middleman, setMiddleman] = useState(false);
  
  // Additional Info checkboxes
  const [binhi, setBinhi] = useState(false);
  const [kagamitan, setKagamitan] = useState(false);
  const [pagsasaka, setPagsasaka] = useState(false);
  const [pagproseso, setPagproseso] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleImageUpload = () => {
    Alert.alert(
      "Upload ID Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => pickImage(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileSize = result.assets[0].fileSize || 0;
        if (fileSize > 10 * 1024 * 1024) { // 10MB limit
          Alert.alert('File too large', 'Please choose an image smaller than 10MB.');
          return;
        }
        setUploadedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileSize = result.assets[0].fileSize || 0;
        if (fileSize > 10 * 1024 * 1024) { // 10MB limit
          Alert.alert('File too large', 'Please choose an image smaller than 10MB.');
          return;
        }
        setUploadedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image source={agriangatLogo} style={styles.logo} />
          <View>
            <Text style={styles.logoBrand}>AgriAngat</Text>
            <Text style={styles.logoSubtitle}>For Farmer</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* Community Links Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Links</Text>
            <Text style={styles.questionTitle}>Kanino ninyo ibinebenta ang inyong mga ani?</Text>
            <Text style={styles.description}>Pindutin ang tsek box ng lahat ng puwedeng iugnay:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={palengke} 
                  onValueChange={setPalengke}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Sa Palengke / Mga Kapitbahay</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={tindahan} 
                  onValueChange={setTindahan}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Sa Isang Tindahan o Tagabili</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={kooperatiba} 
                  onValueChange={setKooperatiba}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Sa Isang Kooperatiba</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={middleman} 
                  onValueChange={setMiddleman}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Sa Isang Middleman</Text>
              </View>
            </View>
          </View>

          {/* Additional Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            <Text style={styles.questionTitle}>Para saan niyo gagamitin ang pautang kung sakali?</Text>
            <Text style={styles.description}>Pindutin ang tsek box ng lahat ng puwedeng iugnay:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={binhi} 
                  onValueChange={setBinhi}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Pamili ng Binhi/Pataba</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={kagamitan} 
                  onValueChange={setKagamitan}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Pamili ng Kagamitan</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={pagsasaka} 
                  onValueChange={setPagsasaka}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Palawakin ang Sakahan</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={pagproseso} 
                  onValueChange={setPagproseso}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Pantustos sa Pagpapatakbo</Text>
              </View>
            </View>
          </View>

          {/* Verification Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <Text style={styles.verificationTitle}>Identification Image (ID)</Text>
            <Text style={styles.verificationSubtitle}>Please upload a clear photo of your valid ID (Philhealth, Driver's License, etc.)</Text>
            
            <View style={styles.uploadContainer}>
              {uploadedImage ? (
                <View style={styles.uploadedImageContainer}>
                  <Image 
                    source={{ uri: uploadedImage.uri }} 
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.uploadedImageName}>
                    {uploadedImage.fileName || 'ID Photo'}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>👤</Text>
                  </View>
                  <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                    <Text style={styles.uploadButtonText}>Upload Image</Text>
                  </TouchableOpacity>
                  <Text style={styles.uploadNote}>Accepts .jpg, .png files; Max file size: 10MB</Text>
                </>
              )}
            </View>

            <Text style={[styles.disclaimerText, { marginTop: 40 }]}>
              Sa pagpasa ng impormasyong ito, ikaw ay pumapayag na ibahagi ito sa AgriAngat at aming mga partner na bangko upang mapataas ang accuracy ng iyong AngatScore at matukoy ang mga posibleng alok ng pautang para sa iyo.
            </Text>
            
            <Text style={styles.disclaimerText}>
              Pakitiyak na tama at totoo ang lahat ng impormasyon. Ang hindi kumpleto o maling detalye ay magpapababa ng iyong AngatScore at maaapektuhan ang iyong eligibility para sa pautang.
            </Text>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            {/* Progress Dots - Left */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
              <View style={[styles.progressDot, styles.activeDot]} />
            </View>

            {/* Submit Button - Right */}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => router.push("/increase-success")}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
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
    marginLeft: 70,
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
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: 15,
  },
  questionTitle: {
    fontSize: 14,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: -2,
    lineHeight: 22,
    marginLeft: 10
  },
  description: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#666",
    marginBottom: 15,
    marginLeft: 10
  },
  checkboxContainer: {
    marginTop: 5,
    marginLeft: 10
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingRight: 20,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
    borderRadius: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#000",
    flex: 1,
    lineHeight: 20,
  },
  verificationTitle: {
    fontSize: 16,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: 5,
    marginLeft: 10
  },
  verificationSubtitle: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBoldItalic",
    color: "#666",
    marginLeft: 10,
    marginTop: -3,
    marginBottom: 20,
  },
  uploadContainer: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  uploadIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#e0e0e0",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  uploadIconText: {
    fontSize: 24,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  uploadNote: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  uploadedImageContainer: {
    alignItems: "center",
    position: "relative",
  },
  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 75,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  uploadedImageName: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
  },
  disclaimerText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
    marginLeft: 10
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 30,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 22,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#000",
    width: 38
  },
  submitButton: {
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});
