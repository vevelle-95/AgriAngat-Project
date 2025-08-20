import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

export default function AccountScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Juan Dela Cruz</Text>
          <Text style={styles.meta}>Verified profile — July 25, 2025</Text>
        </View>
        <View style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View More</Text>
        </View>
      </View>

      {/* Chips */}
      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>AgriAngat Score</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>My Seller Account</Text>
        </View>
      </View>

      {/* Settings list */}
      <View style={styles.list}>
        {[
          "Email",
          "Payments",
          "Transactions",
          "Theme",
          "Language",
          "Help Center",
          "Terms of Use",
          "Privacy Policy",
        ].map((row) => (
          <View key={row} style={styles.row}>
            <Text style={styles.rowText}>{row}</Text>
            <Text style={styles.rowSub}>System</Text>
          </View>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.row, { borderTopWidth: 1, borderTopColor: "#eee" }]}
        onPress={() => router.replace("/login")}
      >
        <Text
          style={[
            styles.rowText,
            { color: "#c0392b", fontFamily: "Poppins-Bold" },
          ]}
        >
          Logout
        </Text>
        <Text style={styles.rowSub}> </Text>
      </TouchableOpacity>

      {/* In-screen quick nav removed (tab bar already present) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  brandIcon: { width: 50, height: 50, borderRadius: 6, marginTop: 46 },
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 23, color: "#111", marginTop: 45, marginLeft: 197 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 14,
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dcdcdc",
    marginRight: 10,
  },
  name: { fontFamily: "Poppins-Bold", fontSize: 14, color: "#111" },
  meta: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: "#111",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  viewBtnText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 12 },

  chipsRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  chip: {
    backgroundColor: "#f3f3f3",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipText: { fontFamily: "Poppins-Bold", fontSize: 12, color: "#111" },

  list: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowText: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#111" },
  rowSub: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#9a9a9a" },
});
