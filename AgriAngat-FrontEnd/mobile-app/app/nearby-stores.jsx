import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function NearbyStoresScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
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

  const stores = [
    {
      id: 1,
      name: "Aling Myrna Sari-sari store",
      distance: "2.5 km",
      needs: "100 kg Rice, 20 kg Tomatoes",
      image: "🏪"
    },
    {
      id: 2,
      name: "Kimilovie Store",
      distance: "1 km",
      needs: "50 kg Corn, 20 kg Onions",
      image: "�"
    },
    {
      id: 3,
      name: "Neyni Store",
      distance: "1 km",
      needs: "50 cabbages, 10 kg Carrots",
      image: "🏪"
    },
    {
      id: 4,
      name: "Cris Talipapa",
      distance: "0.5 km",
      needs: "10 boxes Eggs, 20 kg Onions, 10 kg Carrots",
      image: "🏪"
    },
    {
      id: 5,
      name: "K Mini Mart",
      distance: "0.5 km",
      needs: "100 kg Rice, 100 kg Banana, 50 kg Carrots",
      image: "�"
    }
  ];

  const handleViewStore = (store) => {
    router.push(`/store-contact/${store.id}`);
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.needs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    setShowSearchModal(true);
  };

  const renderStoreCard = (store) => (
    <View key={store.id} style={styles.storeCard}>
      <View style={styles.storeContent}>
        <View style={styles.storeImageContainer}>
          <Image 
            source={require('../assets/images/baskets.png')} 
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
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => handleViewStore(store)}
      >
        <Text style={styles.contactButtonText}>Contact Store</Text>
      </TouchableOpacity>
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
      </View>

      {/* Title and Actions */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Nearby Stores</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/register/welcome-farmer')}
          >
            <Text style={styles.registerButtonText}>Register as Store</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
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
              {searchQuery 
                ? `No stores match "${searchQuery}"`
                : "No nearby stores available at the moment"
              }
            </Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.searchModal}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search Stores</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by store name or products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity 
              style={styles.searchConfirmButton}
              onPress={() => setShowSearchModal(false)}
            >
              <Text style={styles.searchConfirmButtonText}>Search</Text>
            </TouchableOpacity>
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
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 28,
    marginTop: -3,
    marginLeft: 60
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#333",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
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
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    gap: 12,
  },
  categoryButton: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    minWidth: 80,
    height: 70
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
    marginBottom: 10,
    marginTop: -450,
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
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  storesContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  storeCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  storeContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  storeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#fff",
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
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 2,
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
    marginBottom: 2,
  },
  needsText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#111",
  },
  contactButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
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
});
