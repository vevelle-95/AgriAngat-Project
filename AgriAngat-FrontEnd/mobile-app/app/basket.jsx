import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get('window');

export default function BasketScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  // Sample basket data
  const [basketItems, setBasketItems] = useState([
    {
      id: 1,
      name: "Organic Rice",
      price: 45,
      quantity: 2,
      unit: "kg",
      seller: "Rice Farm Co.",
      image: require("../assets/images/rice-terraces.png"),
    },
    {
      id: 2,
      name: "Fresh Mangoes",
      price: 80,
      quantity: 1,
      unit: "kg",
      seller: "Tropical Fruits",
      image: require("../assets/images/mango.png"),
    },
    {
      id: 3,
      name: "Bell Peppers",
      price: 120,
      quantity: 3,
      unit: "kg",
      seller: "Veggie Garden",
      image: require("../assets/images/bell-pepper.png"),
    },
  ]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }
    setBasketItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItemFromBasket = (id) => {
    setBasketItems(items => items.filter(item => item.id !== id));
  };

  const handleRemoveItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your basket?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => removeItemFromBasket(id)
        }
      ]
    );
  };

  const getTotalAmount = () => {
    return basketItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return basketItems.reduce((total, item) => total + item.quantity, 0);
  };

  const processOrderSuccess = () => {
    Alert.alert("Order Placed", "Your order has been placed successfully!");
    setBasketItems([]);
  };

  const handleCheckout = () => {
    if (basketItems.length === 0) {
      Alert.alert("Empty Basket", "Please add items to your basket before checkout.");
      return;
    }
    
    Alert.alert(
      "Proceed to Checkout",
      `Total: ${formatAmount(getTotalAmount())}\nItems: ${getTotalItems()}`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { 
          text: "Checkout", 
          onPress: processOrderSuccess
        }
      ]
    );
  };

  if (basketItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Basket</Text>
        </View>

        <View style={styles.emptyBasketContainer}>
          <Text style={styles.emptyBasketIcon}>🛒</Text>
          <Text style={styles.emptyBasketTitle}>Your basket is empty</Text>
          <Text style={styles.emptyBasketText}>
            Browse the marketplace to find fresh products from local farmers
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)/marketplace")}
          >
            <Text style={styles.browseButtonText}>Browse Marketplace</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Basket</Text>
        <View style={styles.basketCount}>
          <Text style={styles.basketCountText}>{getTotalItems()}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {basketItems.map((item) => (
          <View key={item.id} style={styles.basketItem}>
            <Image source={item.image} style={styles.productImage} />
            
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.sellerName}>by {item.seller}</Text>
              <Text style={styles.productPrice}>
                {formatAmount(item.price)} per {item.unit}
              </Text>
            </View>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>
                {item.quantity} {item.unit}
              </Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.itemActions}>
              <Text style={styles.itemTotal}>
                {formatAmount(item.price * item.quantity)}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({getTotalItems()}):</Text>
          <Text style={styles.summaryValue}>{formatAmount(getTotalAmount())}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee:</Text>
          <Text style={styles.summaryValue}>₱50.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            {formatAmount(getTotalAmount() + 50)}
          </Text>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Checkout • {formatAmount(getTotalAmount() + 50)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    minHeight: Platform.OS === "ios" ? 60 : 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  title: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    flex: 2,
    textAlign: "center",
  },
  basketCount: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
    alignItems: "flex-end",
  },
  basketCountText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  basketItem: {
    flexDirection: screenWidth < 350 ? "column" : "row",
    alignItems: screenWidth < 350 ? "stretch" : "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    marginRight: screenWidth < 350 ? 0 : 10,
    marginBottom: screenWidth < 350 ? 12 : 0,
  },
  productName: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#28a745",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: screenWidth < 350 ? 0 : 10,
    marginBottom: screenWidth < 350 ? 12 : 0,
    justifyContent: screenWidth < 350 ? "center" : "flex-start",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: "center",
  },
  itemActions: {
    alignItems: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    fontSize: 18,
  },
  orderSummary: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#28a745",
  },
  checkoutContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  checkoutButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  emptyBasketContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyBasketIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyBasketTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyBasketText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});
