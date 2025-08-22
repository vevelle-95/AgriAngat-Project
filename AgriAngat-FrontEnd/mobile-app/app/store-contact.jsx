import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function StoreContactScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("info");
  const router = useRouter();
  const { storeId } = useLocalSearchParams();

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

  // Mock store data - in real app, this would be fetched based on storeId
  const storeData = {
    id: 1,
    name: "AgriSupply Central",
    rating: 4.8,
    reviewCount: 127,
    distance: "0.5 km",
    address: "123 Rizal Street, Cabanatuan City, Nueva Ecija",
    phone: "+63 912 345 6789",
    email: "info@agrisupplycentral.com",
    website: "www.agrisupplycentral.com",
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "Closed"
    },
    specialties: ["Seeds", "Fertilizers", "Pesticides", "Garden Tools"],
    verified: true,
    image: "🏪",
    description: "Your trusted partner in agriculture. We provide high-quality seeds, fertilizers, and farming supplies to help you grow better crops.",
    services: [
      "Free delivery for orders over ₱2,000",
      "Agricultural consultation",
      "Bulk order discounts",
      "Equipment rental",
      "Soil testing services"
    ],
    products: [
      { name: "Hybrid Rice Seeds", price: "₱85/kg", stock: "In Stock" },
      { name: "Organic Fertilizer", price: "₱45/bag", stock: "In Stock" },
      { name: "Pesticide Spray", price: "₱120/bottle", stock: "Low Stock" },
      { name: "Garden Hose", price: "₱350/piece", stock: "In Stock" },
      { name: "Hand Cultivator", price: "₱180/piece", stock: "Out of Stock" }
    ],
    reviews: [
      {
        id: 1,
        name: "Maria Santos",
        rating: 5,
        date: "2 days ago",
        comment: "Excellent quality seeds and very helpful staff. My rice harvest was amazing!"
      },
      {
        id: 2,
        name: "Juan dela Cruz",
        rating: 4,
        date: "1 week ago",
        comment: "Good prices and fast delivery. Will definitely order again."
      },
      {
        id: 3,
        name: "Ana Rodriguez",
        rating: 5,
        date: "2 weeks ago",
        comment: "Best agricultural store in the area. They have everything I need for my farm."
      }
    ]
  };

  const handleCall = () => {
    Linking.openURL(`tel:${storeData.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${storeData.email}`);
  };

  const handleWebsite = () => {
    Linking.openURL(`https://${storeData.website}`);
  };

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(storeData.address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("⭐");
    }
    return stars.join("");
  };

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Store Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{storeData.description}</Text>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
          <Text style={styles.contactIcon}>📞</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{storeData.phone}</Text>
          </View>
          <Text style={styles.contactArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
          <Text style={styles.contactIcon}>✉️</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{storeData.email}</Text>
          </View>
          <Text style={styles.contactArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
          <Text style={styles.contactIcon}>🌐</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Website</Text>
            <Text style={styles.contactValue}>{storeData.website}</Text>
          </View>
          <Text style={styles.contactArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={handleDirections}>
          <Text style={styles.contactIcon}>📍</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>{storeData.address}</Text>
          </View>
          <Text style={styles.contactArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Operating Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operating Hours</Text>
        {Object.entries(storeData.hours).map(([day, hours]) => (
          <View key={day} style={styles.hoursItem}>
            <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <Text style={[styles.hoursText, hours === "Closed" && styles.closedText]}>
              {hours}
            </Text>
          </View>
        ))}
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {storeData.services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceIcon}>✓</Text>
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProductsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Featured Products</Text>
      {storeData.products.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>
          <View style={[
            styles.stockBadge,
            product.stock === "In Stock" && styles.inStock,
            product.stock === "Low Stock" && styles.lowStock,
            product.stock === "Out of Stock" && styles.outOfStock
          ]}>
            <Text style={[
              styles.stockText,
              product.stock === "In Stock" && styles.inStockText,
              product.stock === "Low Stock" && styles.lowStockText,
              product.stock === "Out of Stock" && styles.outOfStockText
            ]}>
              {product.stock}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <View style={styles.ratingOverview}>
          <Text style={styles.overallRating}>{storeData.rating}</Text>
          <View style={styles.ratingDetails}>
            <Text style={styles.ratingStars}>{renderStars(storeData.rating)}</Text>
            <Text style={styles.reviewCount}>({storeData.reviewCount} reviews)</Text>
          </View>
        </View>
      </View>

      {storeData.reviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>{review.name}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewRating}>{renderStars(review.rating)}</Text>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
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
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>🤍</Text>
        </TouchableOpacity>
      </View>

      {/* Store Header */}
      <View style={styles.storeHeader}>
        <View style={styles.storeImageContainer}>
          <Text style={styles.storeImage}>{storeData.image}</Text>
        </View>
        <View style={styles.storeInfo}>
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName}>{storeData.name}</Text>
            {storeData.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {storeData.rating}</Text>
            <Text style={styles.reviewCount}>({storeData.reviewCount} reviews)</Text>
            <Text style={styles.distance}>📍 {storeData.distance}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleCall}>
          <Text style={styles.quickActionIcon}>📞</Text>
          <Text style={styles.quickActionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleDirections}>
          <Text style={styles.quickActionIcon}>🗺️</Text>
          <Text style={styles.quickActionText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleWebsite}>
          <Text style={styles.quickActionIcon}>🌐</Text>
          <Text style={styles.quickActionText}>Website</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>💬</Text>
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { id: "info", name: "Info" },
          { id: "products", name: "Products" },
          { id: "reviews", name: "Reviews" }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>
        {selectedTab === "info" && renderInfoTab()}
        {selectedTab === "products" && renderProductsTab()}
        {selectedTab === "reviews" && renderReviewsTab()}
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
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  storeHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  storeImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  storeImage: {
    fontSize: 32,
  },
  storeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  storeName: {
    fontSize: 22,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    flex: 1,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    backgroundColor: "#0f6d00",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 14,
    color: "#fff",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rating: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  distance: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
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
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  activeTabText: {
    color: "#0f6d00",
    fontFamily: "Poppins-Bold",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 24,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  contactArrow: {
    fontSize: 16,
    color: "#999",
  },
  hoursItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  hoursText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  closedText: {
    color: "#ff3b30",
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  serviceIcon: {
    fontSize: 16,
    color: "#0f6d00",
    marginRight: 12,
  },
  serviceText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    flex: 1,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#0f6d00",
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inStock: {
    backgroundColor: "#e8f5e8",
  },
  lowStock: {
    backgroundColor: "#fff3e0",
  },
  outOfStock: {
    backgroundColor: "#ffebee",
  },
  stockText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  inStockText: {
    color: "#0f6d00",
  },
  lowStockText: {
    color: "#f57c00",
  },
  outOfStockText: {
    color: "#d32f2f",
  },
  reviewsHeader: {
    marginBottom: 20,
  },
  ratingOverview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  overallRating: {
    fontSize: 36,
    fontFamily: "Poppins-ExtraBold",
    color: "#0f6d00",
  },
  ratingDetails: {
    flex: 1,
  },
  ratingStars: {
    fontSize: 16,
    marginBottom: 4,
  },
  reviewItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  reviewRating: {
    fontSize: 14,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 18,
  },
});
