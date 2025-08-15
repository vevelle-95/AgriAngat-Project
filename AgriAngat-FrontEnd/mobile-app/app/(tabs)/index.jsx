import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";

import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

const App = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={agriangatLogo}
        resizeMode="center"
        style={styles.image}
      ></ImageBackground>
        <Text style={styles.text}>Empower Farmers</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "left",
    justifyContent: "bottom",
  },

  text: {
    color: "white",
    fontSize: 100,
    fontWeight: "bold",
    textAlign: "center",
  },
});
