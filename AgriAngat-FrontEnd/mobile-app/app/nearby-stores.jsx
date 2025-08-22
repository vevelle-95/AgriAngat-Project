import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function NearbyStoresScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  const categories = [
    { id: "all", name: "All", icon: "🏪" },
    { id: "seeds", name: "Seeds", icon: "🌱" },
    { id: "fertilizer", name: "Fertilizer", icon: "🧪" },
    { id: "tools", name: "Tools", icon: "🔧" },
    { id: "equipment", name: "Equipment", icon: "🚜" },
    { id: "feed", name: "Animal Feed", icon: "🌾" }
  ];

  const stores = [
    {
      id: 1,
      name: "AgriSupply Central",
      category: "seeds",
      rating: 4.8,
      distance: "0.5 km",
      address: "123 Rizal Street, Cabanatuan City",
      phone: "+63 912 345 6789",
      hours: "8:00 AM - 6:00 PM",
      specialties: ["Seeds", "Fertilizers", "Pesticides"],
      verified: true,
      image: "🏪"
    },
    {
      id: 2,
      name: "Green Thumb Farm Store",
      category: "tools",
      rating: 4.6,
      distance: "1.2 km",
      address: "456 Maharlika Highway, Cabanatuan City",
      phone: "+63 918 765 4321",
      hours: "7:00 AM - 7:00 PM",
      specialties: ["Hand Tools", "Irrigation", "Garden Supplies"],
      verified: true,
      image: "🌿"
    },
    {
      id: 3,
      name: "Farmers Choice Equipment",
      category: "equipment",
      rating: 4.7,
      distance: "2.1 km",
      address: "789 General Luna St, Cabanatuan City",
      phone: "+63 925 123 4567",
      hours: "8:00 AM - 5:00 PM",
      specialties: ["Tractors", "Plows", "Harvesters"],
      verified: false,
      image: "🚜"
    },
    {
      id: 4,
      name: "Organic Fertilizer Hub",
      category: "fertilizer",
      rating: 4.9,
      distance: "1.8 km",
      address: "321 Nueva Ecija St, Cabanatuan City",
      phone: "+63 917 888 9999",
      hours: "6:00 AM - 8:00 PM",
      specialties: ["Organic Fertilizer", "Compost", "Bio-pesticides"],
      verified: true,
      image: "🧪"
    },
    {
      id: 5,
      name: "Livestock Feed Center",
      category: "feed",
      rating: 4.5,
      distance: "3.0 km",
      address: "654 Burgos Avenue, Cabanatuan City",
      phone: "+63 920 555 7777",
      hours: "7:00 AM - 6:00 PM",
      specialties: ["Pig Feed", "Chicken Feed", "Cattle Feed"],
      verified: true,
      image: "🐄"
    },
    {
      id: 6,
      name: "Seed Specialist Store",
      category: "seeds",
      rating: 4.4,
      distance: "2.5 km",
      address: "987 Del Pilar St, Cabanatuan City",
      phone: "+63 919 333 2222",
      hours: "8:00 AM - 6:00 PM",
      specialties: ["Vegetable Seeds", "Rice Seeds", "Flower Seeds"],
      verified: false,
      image: "🌱"
    }
  ];

  const filteredStores = stores.filter(store => {
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    return matchesCategory && matchesSearch;
  });

  const handleCallStore = (phone) => {
    console.log("Calling:", phone);
  };

  const handleGetDirections = (address) => {
    console.log("Getting directions to:", address);
  };

  const handleViewStore = (store) => {
    router.push(`/store-contact?storeId=${store.id}`);
  };

  const renderStoreCard = (store) => (
    <TouchableOpacity 
      key={store.id} 
      style={styles.storeCard}
      onPress={() => handleViewStore(store)}
    >
      <View style={styles.storeHeader}>
        <View style={styles.storeImageContainer}>
          <Text style={styles.storeImage}>{store.image}</Text>
        </View>
        <View style={styles.storeInfo}>
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName}>{store.name}</Text>
            {store.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {store.rating}</Text>
            <Text style={styles.distance}>📍 {store.distance}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.storeAddress}>{store.address}</Text>
      <Text style={styles.storeHours}>🕒 {store.hours}</Text>

      <View style={styles.specialtiesContainer}>
        <Text style={styles.specialtiesLabel}>Specialties:</Text>
        <View style={styles.specialtiesTags}>
          {store.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.storeActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCallStore(store.phone)}
        >
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleGetDirections(store.address)}
        >
          <Text style={styles.actionButtonText}>🗺️ Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => handleViewStore(store)}
        >
          <Text style={[styles.actionButtonText, styles.primaryButtonText]}>View Store</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>🔍 Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Nearby Stores</Text>
      <Text style={styles.subtitle}>Find agricultural supplies near you</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores or products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonSelected
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextSelected
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredStores.length} stores found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Sort by Distance ↕️</Text>
        </TouchableOpacity>
      </View>

      {/* Stores List */}
      <ScrollView 
        style={styles.storesContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredStores.length > 0 ? (
          filteredStores.map(renderStoreCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyTitle}>No stores found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or category filter
            </Text>
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
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    minWidth: 80,
  },
  categoryButtonSelected: {
    backgroundColor: "#0f6d00",
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  categoryButtonTextSelected: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  resultsText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  sortButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  storesContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  storeCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  storeHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  storeImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  storeImage: {
    fontSize: 24,
  },
  storeInfo: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  storeName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    flex: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    backgroundColor: "#0f6d00",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: "#fff",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  rating: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  distance: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  storeAddress: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  storeHours: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 12,
  },
  specialtiesContainer: {
    marginBottom: 15,
  },
  specialtiesLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 6,
  },
  specialtiesTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#0f6d00",
  },
  storeActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0f6d00",
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#666",
  },
  primaryButtonText: {
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
  },
});
