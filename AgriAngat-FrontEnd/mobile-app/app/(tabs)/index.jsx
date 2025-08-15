import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView } from "react-native";
import * as Font from "expo-font";
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <ImageBackground
          source={agriangatLogo}
          style={styles.image}
          imageStyle={{ resizeMode: "contain" }}
        />

        <Text style={styles.text}>Empower Farmers.</Text>
        <Text style={styles.text}>Intelligently.</Text>
        <Text style={styles.text1}>
          AgriAngat combines climate data, AI, and real-time insights to give Filipino farmers what they’ve long deserved — access, dignity, and opportunity. It's more than an app — it’s a movement rooted in inclusion.
        </Text>

        <Text style={styles.text2}>From Unbanked to Unstoppable.</Text>
        <Text style={styles.text1}>
          With ESG-based insights, AgriAngat helps farmers become creditworthy — no paperwork, no collateral. Just data, transparency, and a clear path to growth.
        </Text>

        <Text style={styles.text2}>Our Ecosystem. Infinite Growth.</Text>
        <Text style={styles.text1}>
          AgriAngat links farmers, retailers, and lenders into a single climate-smart network — making each connection count toward a more sustainable and inclusive future.
        </Text>
      </View>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 25,
  },
  text: {
    color: "black",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  text1: {
    color: "black",
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
  },
  text2: {
    color: "black",
    fontSize: 18,
    fontFamily: "Poppins-ExtraBold",
    marginTop: 15,
  },
});
