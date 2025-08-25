import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { USER_LISTINGS } from "../data/mockData";

export default function YourListingsScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { colors, isDark } = useTheme();
  const [listings, setListings] = useState(USER_LISTINGS);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
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

  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setEditedName(listing.name);
    setEditedPrice(listing.price);
    setEditedDescription(listing.description);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editedName.trim() || !editedPrice.trim()) {
      Alert.alert("Error", "Name and price are required");
      return;
    }

    setListings(prevListings => {
      const updatedActive = prevListings.active.map(item => 
        item.id === editingListing.id 
          ? { ...item, name: editedName, price: editedPrice, description: editedDescription }
          : item
      );
      return { ...prevListings, active: updatedActive };
    });

    setEditModalVisible(false);
    setEditingListing(null);
    Alert.alert("Success", "Listing updated successfully!");
  };

  const handleDeleteListing = (listing) => {
    Alert.alert(
      "Delete Listing",
      `Are you sure you want to delete ${listing.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            setListings(prevListings => {
              const updatedActive = prevListings.active.filter(item => item.id !== listing.id);
              return { ...prevListings, active: updatedActive };
            });
            Alert.alert("Success", "Listing deleted successfully!");
          }
        }
      ]
    );
  };

  const handleMarkAsSold = (listing) => {
    Alert.alert(
      "Mark as Sold",
      `Mark ${listing.name} as sold?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Mark as Sold", 
          onPress: () => {
            setListings(prevListings => {
              const soldListing = { ...listing, status: "Sold" };
              const updatedActive = prevListings.active.filter(item => item.id !== listing.id);
              const updatedSold = [...prevListings.sold, soldListing];
              return { ...prevListings, active: updatedActive, sold: updatedSold };
            });
            Alert.alert("Success", `${listing.name} marked as sold!`);
          }
        }
      ]
    );
  };

  const filteredListings = listings[activeTab].filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    setShowSearchModal(true);
  };

  const renderListingCard = (listing) => {
    const isSold = listing.status === "Sold";
    
    return (
      <View key={listing.id} style={[styles.listingCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.listingContent}>
          <View style={styles.listingInfo}>
            <Image 
              source={listing.image} 
              style={styles.listingImage} 
              resizeMode="contain"
            />
            <View style={styles.listingDetails}>
              <Text style={[styles.listingName, { color: colors.textPrimary }]}>{listing.name}</Text>
              <Text style={[styles.listingPrice, { color: colors.primary }]}>{listing.price}</Text>
            </View>
            <Text style={[
              styles.statusText, 
              { color: colors.textSecondary }, 
              isSold && [styles.soldStatusText, { color: "#dc3545" }]
            ]}>
              {listing.status}
            </Text>
          </View>
          
          <View style={styles.listingActions}>
            <TouchableOpacity 
              style={[
                styles.markSoldButton, 
                { backgroundColor: isSold ? colors.disabled : "#28a745" },
                isSold && styles.disabledButton
              ]}
              onPress={() => !isSold && handleMarkAsSold(listing)}
              disabled={isSold}
            >
              <Text style={[
                styles.markSoldButtonText, 
                { color: isSold ? colors.disabledText : "#ffffff" },
                isSold && styles.disabledButtonText
              ]}>
                {isSold ? "Sold" : "Mark as Sold"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.editButton,
                { backgroundColor: isSold ? colors.disabled : colors.primary },
                isSold && styles.disabledButton
              ]}
              onPress={() => !isSold && handleEditListing(listing)}
              disabled={isSold}
            >
              <Text style={[
                styles.editButtonText, 
                { color: isSold ? colors.disabledText : "#ffffff" },
                isSold && styles.disabledButtonText
              ]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.deleteButton, 
                { backgroundColor: isSold ? colors.disabled : "#dc3545" },
                isSold && styles.disabledButton
              ]}
              onPress={() => !isSold && handleDeleteListing(listing)}
              disabled={isSold}
            >
              <Text style={[
                styles.deleteButtonText, 
                { color: isSold ? colors.disabledText : "#ffffff" },
                isSold && styles.disabledButtonText
              ]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title and Action Buttons */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.text }]}>Your Listings</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.sellProductsButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/add-product")}
          >
            <Text style={[styles.sellProductsButtonText, { color: isDark ? colors.background : '#fff' }]}>Sell Products</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors.card, borderColor: colors.text }]}
            onPress={handleSearch}
          >
            <Text style={[styles.searchButtonText, { color: colors.text }]}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "active" && [styles.activeTabText, { color: "#0f6d00" }]]}>
            Active ({listings.active.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "sold" && styles.activeTab]}
          onPress={() => setActiveTab("sold")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "sold" && [styles.activeTabText, { color: "#0f6d00" }]]}>
            Sold ({listings.sold.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "expired" && styles.activeTab]}
          onPress={() => setActiveTab("expired")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "expired" && [styles.activeTabText, { color: "#0f6d00" }]]}>
            Expired ({listings.expired.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listings */}
      <ScrollView style={styles.listingsContainer} contentContainerStyle={styles.scrollContent}>
        {filteredListings.length > 0 ? (
          filteredListings.map(renderListingCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No {activeTab} listings</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.searchModal, { backgroundColor: colors.card }]}>
            <View style={styles.searchModalHeader}>
              <Text style={[styles.searchModalTitle, { color: colors.textPrimary }]}>Search Listings</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Search by product name..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity 
              style={[styles.searchConfirmButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowSearchModal(false)}
            >
              <Text style={[styles.searchConfirmButtonText, { color: isDark ? colors.background : '#fff' }]}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.editModal, { backgroundColor: colors.card }]}>
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: colors.textPrimary }]}>Edit Listing</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Product Name</Text>
            <TextInput
              style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter product name"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Price</Text>
            <TextInput
              style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={editedPrice}
              onChangeText={setEditedPrice}
              placeholder="Enter price (e.g. P50)"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Description</Text>
            <TextInput
              style={[styles.editInput, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Enter description"
              placeholderTextColor={colors.textSecondary}
              multiline={true}
              numberOfLines={3}
            />
            
            <View style={styles.editModalButtons}>
              <TouchableOpacity 
                style={[styles.cancelEditButton, { backgroundColor: colors.surface }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.cancelEditButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveEditButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.saveEditButtonText, { color: isDark ? colors.background : '#fff' }]}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: "Poppins-SemiBold",
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 28,
    marginTop: -3,
    marginLeft: 75
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  sellProductsButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  sellProductsButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#333",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsContent: {
    paddingHorizontal: 16,
    gap: 12,
    flexDirection: "row",
  },
  statCard: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 100,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
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
    paddingBottom: 20,
  },
  listingCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  listingContent: {
    flex: 1,
  },
  listingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  listingImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  listingDetails: {
    flex: 1,
  },
  listingName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#0f6d00",
  },
  soldStatusText: {
    color: "#666",
  },
  listingActions: {
    flexDirection: "row",
    gap: 8,
  },
  markSoldButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  markSoldButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  editButtonText: {
    color: "#333",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    borderColor: "#ccc",
    opacity: 0.6,
  },
  disabledButtonText: {
    color: "#999",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#111',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 16,
  },
  searchConfirmButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchConfirmButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  editModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#111',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#111',
    marginBottom: 8,
    marginTop: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    color: '#666',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveEditButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
