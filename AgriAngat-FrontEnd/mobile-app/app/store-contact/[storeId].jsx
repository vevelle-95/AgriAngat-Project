import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Font from "expo-font";

// This would come from your API/database in a real app
const getStoreDetails = (id) => {
  const stores = {
    "1": {
      id: 1,
      name: "Aling Myrna Sari-sari store",
      distance: "2.5 km",
      needs: "100 kg Rice, 20 kg Tomatoes",
      image: "🏪",
      address: "123 Main Street, Cabanatuan City",
      phone: "+63 912 345 6789",
      email: "alingmyrna@gmail.com",
      ownerName: "Myrna Santos",
      businessHours: "7:00 AM - 9:00 PM",
      landmarks: "Near Central School"
    },
    "2": {
      id: 2,
      name: "Kimilovie Store",
      distance: "1 km",
      needs: "50 kg Corn, 20 kg Onions",
      image: "🏪",
      address: "456 Maharlika Highway, Cabanatuan City",
      phone: "+63 917 123 4567",
      email: "kimiloviestore@gmail.com",
      ownerName: "Kim Santos",
      businessHours: "6:00 AM - 8:00 PM",
      landmarks: "Beside Mercury Drug"
    },
    "3": {
      id: 3,
      name: "Neyni Store",
      distance: "1 km",
      needs: "50 cabbages, 10 kg Carrots",
      image: "🏪",
      address: "789 Liberty Street, Cabanatuan City",
      phone: "+63 918 765 4321",
      email: "neynistore@gmail.com",
      ownerName: "Neil Garcia",
      businessHours: "8:00 AM - 7:00 PM",
      landmarks: "Near Public Market"
    },
    "4": {
      id: 4,
      name: "Cris Talipapa",
      distance: "0.5 km",
      needs: "10 boxes Eggs, 20 kg Onions, 10 kg Carrots",
      image: "🏪",
      address: "321 Freedom Road, Cabanatuan City",
      phone: "+63 919 999 8888",
      email: "cristalipapa@gmail.com",
      ownerName: "Cristina Reyes",
      businessHours: "5:00 AM - 6:00 PM",
      landmarks: "Corner of Freedom and Liberty"
    },
    "5": {
      id: 5,
      name: "K Mini Mart",
      distance: "0.5 km",
      needs: "100 kg Rice, 100 kg Banana, 50 kg Carrots",
      image: "🏪",
      address: "567 Progress Street, Cabanatuan City",
      phone: "+63 915 777 6666",
      email: "kminimart@gmail.com",
      ownerName: "Karen Cruz",
      businessHours: "7:00 AM - 10:00 PM",
      landmarks: "Across from the Church"
    }
  };
  return stores[id];
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
    Linking.openURL(`tel:${store.phone}`);
  };

  const handleGetDirections = () => {
    // In a real app, this would open maps with the store's coordinates
    console.log("Opening directions to:", store.address);
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
            source={require('../../assets/images/baskets.png')} 
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
          <Text style={styles.primaryButtonText}>Contact Store</Text>
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
