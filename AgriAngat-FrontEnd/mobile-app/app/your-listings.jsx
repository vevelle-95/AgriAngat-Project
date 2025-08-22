import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function YourListingsScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const router = useRouter();

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

  const mockListings = {
    active: [
      {
        id: 1,
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: "45.00",
        unit: "kg",
        quantity: "50",
        views: 24,
        inquiries: 3,
        status: "active",
        image: "🍅"
      },
      {
        id: 2,
        name: "Organic Rice",
        category: "Grains",
        price: "65.00",
        unit: "kg",
        quantity: "100",
        views: 18,
        inquiries: 5,
        status: "active",
        image: "🌾"
      },
      {
        id: 3,
        name: "Sweet Corn",
        category: "Vegetables",
        price: "35.00",
        unit: "pieces",
        quantity: "200",
        views: 31,
        inquiries: 7,
        status: "active",
        image: "🌽"
      }
    ],
    sold: [
      {
        id: 4,
        name: "Cabbage",
        category: "Vegetables",
        price: "25.00",
        unit: "pieces",
        quantity: "30",
        soldQuantity: "30",
        status: "sold",
        image: "🥬"
      },
      {
        id: 5,
        name: "Carrots",
        category: "Vegetables",
        price: "40.00",
        unit: "kg",
        quantity: "20",
        soldQuantity: "20",
        status: "sold",
        image: "🥕"
      }
    ],
    expired: [
      {
        id: 6,
        name: "Lettuce",
        category: "Vegetables",
        price: "30.00",
        unit: "pieces",
        quantity: "15",
        status: "expired",
        image: "🥬"
      }
    ]
  };

  const handleEditListing = (listing) => {
    Alert.alert("Edit Listing", `Edit ${listing.name}?`);
  };

  const handleDeleteListing = (listing) => {
    Alert.alert(
      "Delete Listing",
      `Are you sure you want to delete ${listing.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Deleted") }
      ]
    );
  };

  const renderListingCard = (listing) => (
    <View key={listing.id} style={styles.listingCard}>
      <View style={styles.listingImageContainer}>
        <Text style={styles.listingImage}>{listing.image}</Text>
      </View>
      
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingName}>{listing.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, 
              listing.status === 'active' && styles.statusActive,
              listing.status === 'sold' && styles.statusSold,
              listing.status === 'expired' && styles.statusExpired
            ]}>
              {listing.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.listingCategory}>{listing.category}</Text>
        <Text style={styles.listingPrice}>₱{listing.price} per {listing.unit}</Text>
        
        {listing.status === 'active' && (
          <View style={styles.listingStats}>
            <Text style={styles.statText}>{listing.quantity} {listing.unit} available</Text>
            <Text style={styles.statText}>👁 {listing.views} views</Text>
            <Text style={styles.statText}>💬 {listing.inquiries} inquiries</Text>
          </View>
        )}
        
        {listing.status === 'sold' && (
          <Text style={styles.soldText}>
            Sold {listing.soldQuantity} {listing.unit} of {listing.quantity} {listing.unit}
          </Text>
        )}
        
        <View style={styles.listingActions}>
          {listing.status === 'active' && (
            <>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditListing(listing)}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteListing(listing)}
              >
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
          
          {listing.status === 'expired' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => console.log("Relist")}
            >
              <Text style={styles.actionButtonText}>Relist</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/add-product")}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Your Listings</Text>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockListings.active.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockListings.sold.length}</Text>
          <Text style={styles.statLabel}>Sold</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockListings.expired.length}</Text>
          <Text style={styles.statLabel}>Expired</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockListings.active.reduce((sum, item) => sum + item.views, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["active", "sold", "expired"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({mockListings[tab].length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listings */}
      <ScrollView style={styles.listingsContainer} contentContainerStyle={styles.scrollContent}>
        {mockListings[activeTab].length > 0 ? (
          mockListings[activeTab].map(renderListingCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No {activeTab} listings</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? "Start selling by adding your first product"
                : `You don't have any ${activeTab} listings yet`
              }
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push("/add-product")}
              >
                <Text style={styles.emptyButtonText}>Add Product</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    marginRight: 8,
    color: "#333",
  },
  backText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  addButton: {
    backgroundColor: "#0f6d00",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold",
    color: "#0f6d00",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0f6d00",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  activeTabText: {
    color: "#0f6d00",
    fontFamily: "Poppins-Bold",
  },
  listingsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listingCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    gap: 15,
  },
  listingImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listingImage: {
    fontSize: 32,
  },
  listingContent: {
    flex: 1,
  },
  listingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  listingName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
    color: "#666",
  },
  statusActive: {
    color: "#0f6d00",
  },
  statusSold: {
    color: "#007AFF",
  },
  statusExpired: {
    color: "#ff3b30",
  },
  listingCategory: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#0f6d00",
    marginBottom: 8,
  },
  listingStats: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  statText: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  soldText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 10,
  },
  listingActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#0f6d00",
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  deleteButtonText: {
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#0f6d00",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
});
