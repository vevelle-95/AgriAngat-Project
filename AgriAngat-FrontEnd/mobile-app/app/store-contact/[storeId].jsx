import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Font from "expo-font";
import { NEARBY_STORES } from "../../data/mockData";

// Get store details from mock data
const getStoreDetails = (id) => {
  return NEARBY_STORES.find(store => store.id === parseInt(id));
};

export default function StoreContactPage() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { storeId } = useLocalSearchParams();
  const router = useRouter();
  const store = getStoreDetails(storeId);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded || !store) return null;

  const handleCall = () => {
    if (store.phone) {
      Linking.openURL(`tel:${store.phone}`);
    } else {
      Alert.alert("Contact Info", "Phone number not available");
    }
  };

  const handleSMS = () => {
    if (store.phone) {
      const message = `Hi ${store.ownerName}, I saw your store "${store.name}" on AgriAngat. I'm interested in your current needs: ${store.needs}. Can we discuss this further?`;
      const smsUrl = Platform.OS === 'ios' 
        ? `sms:${store.phone}&body=${encodeURIComponent(message)}`
        : `sms:${store.phone}?body=${encodeURIComponent(message)}`;
      Linking.openURL(smsUrl);
    } else {
      Alert.alert("Contact Info", "Phone number not available");
    }
  };

  const handleGetDirections = () => {
    if (store.coordinates) {
      const { latitude, longitude } = store.coordinates;
      const label = encodeURIComponent(store.name);
      
      const mapUrls = {
        ios: `maps:0,0?q=${latitude},${longitude}(${label})`,
        android: `geo:0,0?q=${latitude},${longitude}(${label})`,
        web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      };
      
      const url = Platform.OS === 'ios' ? mapUrls.ios : 
                  Platform.OS === 'android' ? mapUrls.android : mapUrls.web;
      
      Linking.openURL(url).catch(() => {
        // Fallback to Google Maps web
        Linking.openURL(mapUrls.web);
      });
    } else {
      // Fallback using address
      const address = encodeURIComponent(store.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Store Info */}
      <View style={styles.storeHeader}>
        <View style={styles.storeImageContainer}>
          <Image 
            source={store.image} 
            style={styles.storeImage} 
            resizeMode="cover"
          />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.distance}>({store.distance} away)</Text>
          <Text style={styles.needsLabel}>Needs:</Text>
          <Text style={styles.needsText}>{store.needs}</Text>
        </View>
      </View>

      {/* Needs Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Needs</Text>
        <View style={styles.needsCard}>
          <Text style={styles.needsText}>{store.needs}</Text>
        </View>
      </View> */}

      {/* Contact Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCall}>
          <Text style={styles.primaryButtonText}>📞 Call Store</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSMS}>
          <Text style={styles.secondaryButtonText}>💬 Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Store Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Owner</Text>
            <Text style={styles.detailValue}>{store.ownerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Business Hours</Text>
            <Text style={styles.detailValue}>{store.businessHours}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{store.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Landmarks</Text>
            <Text style={styles.detailValue}>{store.landmarks}</Text>
          </View>
        </View>
      </View>

      {/* Map/Directions */}
      <TouchableOpacity 
        style={styles.directionsButton} 
        onPress={handleGetDirections}
      >
        <Text style={styles.directionsButtonText}>🗺️ Get Directions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  storeImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  storeImage: {
    width: "100%",
    height: "100%",
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 8,
  },
  needsLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  needsText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#111",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#111",
    marginBottom: 12,
  },
  needsCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  detailsCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  directionsButton: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  directionsButtonText: {
    color: "#333",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
});