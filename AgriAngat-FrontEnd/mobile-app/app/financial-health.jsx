import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Checkbox } from 'expo-checkbox';
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

export default function FinancialHealth() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [hasNotebook, setHasNotebook] = useState(false);
  const [hasHindi, setHasHindi] = useState(false);
  
  // Expenses checkboxes
  const [binhi, setBinhi] = useState(false);
  const [pataba, setPataba] = useState(false);
  const [paggawa, setPaggawa] = useState(false);
  const [kagamitan, setKagamitan] = useState(false);
  
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
          <Text style={styles.mainTitle}>Financial Health</Text>
          
          {/* Monthly Income Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {fontSize: 16}]}>Benta mula sa Pagasaka kada Buwan (₱):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. ₱18,000"
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              keyboardType="numeric"
            />
          </View>

          {/* Monthly Expenses Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {fontSize: 16}]}>Gastos sa Pagasaka kada Buwan (₱):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. ₱18,000"
              value={monthlyExpenses}
              onChangeText={setMonthlyExpenses}
              keyboardType="numeric"
            />
          </View>

          {/* Expenses Breakdown */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {marginBottom: -12}]}>Expenses</Text>
            <Text style={styles.subtitle}>Pangunahing Gastos sa Pagasaka</Text>
            <Text style={styles.description}>Pindutin ang tsek box ng lahat ng puwedeng iugnay:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={binhi} 
                  onValueChange={setBinhi}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Binhi at mga punla</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={pataba} 
                  onValueChange={setPataba}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Pataba at Pesticide</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={paggawa} 
                  onValueChange={setPaggawa}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Paggawa (Labor)</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={kagamitan} 
                  onValueChange={setKagamitan}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Upa ng Kagamitan</Text>
              </View>
            </View>
          </View>

          {/* Additional Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            <Text style={styles.questionText}>
              Sumusulat ka ba ng mga benta at gastos?
            </Text>
            <Text style={styles.smallText}>
              Halimbawa: Notebook, app, atbp.
            </Text>
            <Text style={styles.smallText}>
              Pindutin ang tsek box ng iyong nais isagot:
            </Text>
            
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={hasNotebook} 
                  onValueChange={setHasNotebook}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Oo</Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <Checkbox 
                  value={hasHindi} 
                  onValueChange={setHasHindi}
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
              <View style={[styles.progressDot, styles.activeDot]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>

            {/* Next Button - Right */}
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => router.push("/farming-practices")}
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginTop: 20,
    marginBottom: 3,
    marginLeft: 10
  },
  description: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 15,
    marginLeft: 10
  },
  questionText: {
    fontSize: 14,
    fontFamily: "Poppins-ExtraBold",
    color: "#000",
    marginBottom: 3,
    marginLeft: 10
  },
  smallText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 2,
    marginLeft: 10
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#f9f9f9",
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
    borderRadius: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
    flex: 1,
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
