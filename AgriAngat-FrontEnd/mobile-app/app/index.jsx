import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native"; 
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";
import terraces from "../assets/images/rice-terraces.png";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation(); 

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
  }, []);

  if (!fontsLoaded) return null;

  // Logo tap disabled per request

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView style={styles.scroll} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
        {/* Static Logo (not tappable) */}
        <Image
          source={agriangatLogo}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Terraces Image with Text and Blurred Pill Button */}
        <ImageBackground
          source={terraces}
          style={styles.terracesImage}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.overlayRow}>
            <Text style={styles.terracesTextLeft}>
              Get Started with{"\n"}AgriAngat
            </Text>

            {/* Blurred Pill Button */}
            <BlurView intensity={10} tint="light" style={styles.blurButtonWrapper}>
              <TouchableOpacity
                style={styles.pillButton}
                onPress={() => navigation.replace("login")}
              >
                <Text style={styles.pillButtonText}>Log In / Sign In</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </ImageBackground>

        {/* Page Content */}
        <Text style={styles.text}>Empowering Farmers.</Text>
        <Text style={styles.text3}>Intelligently.</Text>
        <Text style={styles.text1}>
          AgriAngat combines climate data, AI, and real-time insights to give
          Filipino farmers what they’ve long deserved — access, dignity, and
          opportunity. It's more than an app — it’s a movement rooted in
          inclusion.
        </Text>

        <Text style={styles.text2}>From Unbanked to Unstoppable.</Text>
        <Text style={styles.text1}>
          With ESG-based insights, AgriAngat helps farmers become creditworthy —
          no paperwork, no collateral. Just data, transparency, and a clear path
          to growth.
        </Text>

        <Text style={styles.text2}>One Ecosystem. Infinite Growth.</Text>
        <Text style={styles.text1}>
          AgriAngat links farmers, retailers, and lenders into a single
          climate-smart network — making each connection count toward a more
          sustainable and inclusive future.
        </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 20,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: -10,
  },
  terracesImage: {
    width: "100%",
    height: 225,
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  overlayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  terracesTextLeft: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  blurButtonWrapper: {
    borderRadius: 25,
    overflow: "hidden",
  },
  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  pillButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  text: {
    color: "black",
    fontSize: 17,
    fontFamily: "Poppins-ExtraBold",
    marginTop: 30,
  },
  text1: {
    color: "black",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
    marginLeft: 2,
  },
  text2: {
    color: "black",
    fontSize: 17,
    fontFamily: "Poppins-ExtraBold",
    marginTop: 25,
  },
  text3: {
    color: "black",
    fontSize: 17,
    fontFamily: "Poppins-ExtraBold",
    marginTop: -5,
  },
});