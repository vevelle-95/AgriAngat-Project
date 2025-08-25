import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Checkbox } from 'expo-checkbox';
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

export default function FarmingPractices() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Irrigation methods
  const [umaasa, setUmaasa] = useState(false);
  const [patubig, setPatubig] = useState(false);
  const [patubigDaluyano, setPatubigDaluyano] = useState(false);
  
  // Fertilizer types
  const [kemikal, setKemikal] = useState(false);
  const [organiko, setOrganiko] = useState(false);
  const [pinaghalo, setPinaghalo] = useState(false);
  
  // Crop rotation
  const [oo, setOo] = useState(false);
  const [hindi, setHindi] = useState(false);
  
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
    loadFonts();
  }, []);

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
          <Text style={styles.mainTitle}>Farming Practices</Text>
          
          {/* Irrigation Section */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>Paano kayo nagdidilig ng inyong mga pananim?</Text>
            <Text style={styles.description}>Pindutin ang tsek box ng lahat ng puwedeng iugnay:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={umaasa} 
                  onValueChange={setUmaasa}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Umaasa sa ulan</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={patubig} 
                  onValueChange={setPatubig}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Patubig (Flood Irrigation)</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={patubigDaluyano} 
                  onValueChange={setPatubigDaluyano}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Patubig-daluyan o patubig-ambon{'\n'}(Drip o Sprinkler System)</Text>
              </View>
            </View>
          </View>

          {/* Fertilizer Section */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>Anong uri ng pataba ang pangunahing ginagamit?</Text>
            <Text style={styles.description}>Pindutin ang tsek box ng lahat ng puwedeng iugnay:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={kemikal} 
                  onValueChange={setKemikal}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Kemikal / Sintetiko</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={organiko} 
                  onValueChange={setOrganiko}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Organiko (hal., compost, dumi ng hayop)</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={pinaghalo} 
                  onValueChange={setPinaghalo}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Pinaghalo</Text>
              </View>
            </View>
          </View>

          {/* Crop Rotation Section */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>Nagsasagawa ba kayo ng crop rotation o nagtatanim ng iba't ibang pananim?</Text>
            <Text style={styles.description}>Pindutin ang tsek box ng iyong nais isagot:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={oo} 
                  onValueChange={setOo}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Oo</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={hindi} 
                  onValueChange={setHindi}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Hindi</Text>
              </View>
            </View>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            {/* Progress Dots - Left */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDot} />
              <View style={[styles.progressDot, styles.activeDot]} />
              <View style={styles.progressDot} />
            </View>

            {/* Next Button - Right */}
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => router.push("/community-links")}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Text style={styles.nextArrow}>→</Text>
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
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: 15,
    marginTop: 25,
  },
  section: {
    marginBottom: 40,
  },
  questionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: 1,
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
    marginLeft: 20,
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
    color: "#333",
    flex: 1,
    lineHeight: 20,
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
  nextButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 9999,
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  nextArrow: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});
