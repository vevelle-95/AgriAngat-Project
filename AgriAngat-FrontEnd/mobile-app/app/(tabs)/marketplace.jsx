import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
import banana from "../../assets/images/banana.png";
import papaya from "../../assets/images/papaya.png";
import lemon from "../../assets/images/lemon.png";
import pakwan from "../../assets/images/watermelon.png";
import mangga from "../../assets/images/mango.png";
import strawberry from "../../assets/images/strawberry.png";
import fruits from "../../assets/images/fruits.png";
import dairy from "../../assets/images/dairy.png";
import beverages from "../../assets/images/beverages.png";
import vegetables from "../../assets/images/vegetables.png";
import rings from "../../assets/images/riring.png";
import basket from "../../assets/images/baskets.png";
import redsky from "../../assets/images/skyhalf-red.png";
import marketplace from "../../assets/images/aa-marketplace.png";
import greenbag from "../../assets/images/green-bag.png";

const MOCK_PRODUCTS = [
  { id: "1", name: "Saba Banana", price: "₱50", image: banana },
  { id: "2", name: "Papaya", price: "₱80", image: papaya },
  { id: "3", name: "Lemon", price: "₱30", image: lemon },
  { id: "4", name: "Pakwan", price: "₱60", image: pakwan },
  { id: "5", name: "Mangga", price: "₱40", image: mangga },
  { id: "6", name: "Strawberry", price: "₱90", image: strawberry },
];

const CATEGORIES = [
  { id: "1", name: "Fruits", image: fruits },
  { id: "2", name: "Milk & egg", image: dairy },
  { id: "3", name: "Beverages", image: beverages },
  { id: "4", name: "Vegetables", image: vegetables },
];

function ProductCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardRow}>
          <Text style={styles.star}>★ 4.8 (287)</Text>
          <TouchableOpacity style={styles.plusBtn}>
            <Text style={styles.plusText}>＋</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
    </View>
  );
}

ProductCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.any,
  }).isRequired,
};

function renderProductItem({ item }) {
  return <ProductCard item={item} />;
}

function ItemSeparator() {
  return <View style={{ height: 12 }} />;
}

export default function MarketplaceScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const router = useRouter();
  const CARD_WIDTH = Dimensions.get("window").width - 32;
  const promoSlides = 3;
  const [promoIndex, setPromoIndex] = useState(0);
  const promoScrollRef = useRef(null);

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

  useEffect(() => {
    if (!promoScrollRef.current) return;
    const id = setInterval(() => {
      const next = (promoIndex + 1) % promoSlides;
      promoScrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
      setPromoIndex(next);
    }, 4000);
    return () => clearInterval(id);
  }, [promoIndex, promoSlides, CARD_WIDTH]);

  if (!fontsLoaded) return null;

  const renderSellContent = () => (
    <>
      {/* User Profile Card */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>👤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Juan Dela Cruz</Text>
          <Text style={styles.userSubtitle}>Seller since 2024</Text>
        </View>
      </View>

      {/* Sell Product Button */}
      <TouchableOpacity 
        style={styles.sellButton}
        onPress={() => router.push("/add-product")}
      >
        <Text style={styles.sellButtonText}>Sell Product</Text>
      </TouchableOpacity>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>Stores Nearby</Text>
          <TouchableOpacity 
            style={styles.statButton}
            onPress={() => router.push("/nearby-stores")}
          >
            <Text style={styles.statButtonText}>Look Nearby Stores</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Active Listing</Text>
          <TouchableOpacity 
            style={styles.statButton}
            onPress={() => router.push("/your-listings")}
          >
            <Text style={styles.statButtonText}>Your Listings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        <View style={styles.ratingHeader}>
          <Text style={styles.ratingTitle}>Your Rating</Text>
          <Text style={styles.ratingScore}>4.0</Text>
        </View>
        <View style={styles.starsRow}>
          <Text style={styles.stars}>★★★★☆</Text>
        </View>
        <View style={styles.ratingBars}>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>5</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.barGray, { width: '10%' }]} />
            </View>
            <Text style={styles.ratingCount}>0</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>4</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.barYellow, { width: '60%' }]} />
            </View>
            <Text style={styles.ratingCount}>2</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>3</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.barGray, { width: '10%' }]} />
            </View>
            <Text style={styles.ratingCount}>0</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>2</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.barGray, { width: '10%' }]} />
            </View>
            <Text style={styles.ratingCount}>0</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>1</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, styles.barGray, { width: '10%' }]} />
            </View>
            <Text style={styles.ratingCount}>0</Text>
          </View>
        </View>
      </View>

      {/* Transactions Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <TouchableOpacity style={styles.outlineBtn2}>
          <Text style={styles.outlineBtnText2}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.txCard}>
        <View style={styles.txRow}>
          <View>
            <Text style={styles.txTitle}>Transaction 1</Text>
            <Text style={styles.txSub}>Completed</Text>
          </View>
          <View>
            <Text style={styles.txAmount}>₱500.00</Text>
            <Text style={styles.txDate}>Dec 15, 2024</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.txRow}>
          <View>
            <Text style={styles.txTitle}>Transaction 2</Text>
            <Text style={styles.txSub}>Pending</Text>
          </View>
          <View>
            <Text style={styles.txAmount}>₱750.00</Text>
            <Text style={styles.txDate}>Dec 14, 2024</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderBasketContent = () => (
    <View style={styles.basketContainer}>
      <Text style={styles.basketText}>Basket</Text>
    </View>
  );

  const renderExploreContent = () => (
    <>
      {/* Promo cards carousel */}
      <ScrollView
        ref={promoScrollRef}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setPromoIndex(index);
        }}
        contentContainerStyle={styles.promoScroll}
      >
        <View style={[styles.alertCard, { width: CARD_WIDTH, backgroundColor: "#E0FFE0", position: 'relative' }]}>
          {/* Background rings with basket inside */}
          <View style={styles.backgroundRingsContainer}>
            <Image source={rings} style={styles.backgroundRings} />
            <Image source={basket} style={styles.basketImageInside} />
          </View>

          {/* Content on left */}
          <View style={styles.welcomeContentContainer}>
            <Text style={[styles.alertTitle, { marginTop: -10 }]}>Grow more than </Text>
            <Text style={styles.alertTitle}>crops. Grow your</Text>
            <Text style={[styles.alertTitle, { marginBottom: 10 }]}>chances.</Text>
            <Text style={[styles.alertSub, { color: "#0f6d00", marginTop: 0 }]}>Boost your </Text>
            <Text style={[styles.alertSub, { color: "#0f6d00", marginTop: 0 }]}>
              <Text style={[styles.alertSub, { fontFamily: "Poppins-Bold", color: "#0f6d00", marginTop: 0 }]}>AngatScore</Text> by
            </Text>
            <Text style={[styles.alertSub, { color: "#0f6d00", marginTop: 0 }]}>farming smarter and</Text>
            <Text style={[styles.alertSub, { color: "#0f6d00", marginTop: 0 }]}>paying loans on time.</Text>
          </View>
        </View>
        <View style={[styles.alertCard, { width: CARD_WIDTH, backgroundColor: "#FFDB24" }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.alertTitle, { fontFamily: "Poppins-ExtraBold" }]}>Rainy Season Alert: Farm with Caution</Text>
            <Text style={[styles.alertSub, { color: "#0a0b0a" }]}>PAGASA forecasts up to 16 tropical cyclones from AUG to DEC. Ensure to prepare or stock before weather disrupts supply chains.</Text>
          </View>
          <View style={styles.alertIconContainer}>
            <Image source={redsky} style={[styles.alertIcon, { width: 130, height: 150, marginTop: 0, marginRight: -20 }]} />
          </View>
        </View>
        <View style={[styles.alertCard, { width: CARD_WIDTH, backgroundColor: "#0ca201" }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.alertTitle, { color: "#ffffff", marginTop: 10 }]}>Sell fresh, buy fresh.</Text>
            <Text style={[styles.alertSub, { color: "#ffffff" }]}>
              With our Marketplace, farmers connect directly to stores and buyers nearby. No extra layers, no unfair markups
            </Text>
            <View style={styles.serviceLogo}>
              <Image source={marketplace} style={styles.logoIcon} />
            </View>
          </View>
          <View style={styles.alertIconContainer}>
            <Image source={greenbag} style={[styles.alertIcon, { width: 90, marginTop: 10 }]} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.dotsWrap}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === promoIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesRow}>
        {CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Image source={category.image} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </View>

      {/* Today's picks */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Today's picks</Text>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Sell":
        return renderSellContent();
      case "Basket":
        return renderBasketContent();
      default:
        return renderExploreContent();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {["Sell", "Explore", "Basket"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}

      {/* Products Grid for Explore tab */}
      {activeTab === "Explore" && (
        <View style={styles.productsGrid}>
          {MOCK_PRODUCTS.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <ProductCard item={item} />
            </View>
          ))}
        </View>
      )}
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
    marginTop: -10,
  },
  brandIcon: { width: 50, height: 50, borderRadius: 6, marginTop: 46 },
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 23, color: "#111", marginTop: 45, marginLeft: 148 },

  tabContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 10,
    backgroundColor: "transparent",
    borderRadius: 22,
    paddingVertical: 4,
    marginTop: -15,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#111",
  },
  tabTextActive: {
    color: "#fff",
  },

  alertCard: {
    flexDirection: "row",
    backgroundColor: "#ffdb24",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 10,
    height: 170
  },
  alertTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
    color: "#111",
    marginBottom: 0,
  },
  alertSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#111",
    marginTop: 10,
  },
  alertIconContainer: {
    position: "relative",
  },
  alertIcon: {
    width: 120,
    height: 130,
    marginLeft: 12,
  },
  promoScroll: { paddingBottom: 6 },
  promoTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
    marginBottom: 6,
  },
  promoSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#174c1a",
  },
  promoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginLeft: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  promoScroll: { paddingBottom: 6 },
  dotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#cfd8cf", marginTop: -10 },
  dotActive: { width: 18, backgroundColor: "#0f6d00", borderRadius: 3 },

  sectionTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 20,
    color: "#111",
    marginTop: 10,
    marginBottom: 8,
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginRight: 12,
  },
  categoryItem: {
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f6f6f6",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  categoryText: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },

  card: {
    width: "100%",
    height: 250,
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  cardImage: { width: "100%", height: 150, marginLeft: -1, marginTop: -2, marginBottom: 10, backgroundColor: "#e8e8e8", borderRadius: 12, overflow: "hidden" },
  cardBody: { padding: 10, backgroundColor: "#f6f6f6" },
  cardName: { fontFamily: "Poppins-Bold", fontSize: 16, color: "#111", marginTop: -10 },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  star: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#FBB400", marginTop: -40, },
  plusBtn: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3
  },
  plusText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginTop: -1,
  },
  cardPrice: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 25,
    color: "#0f6d00",
    marginTop: -28,
  },
  backgroundRingsContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: 30,
    right: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backgroundRings: {
    width: 150,
    height: 155,
    marginLeft: 48,
    marginBottom: -5,
    transform: [{ rotate: "360deg" }],
  },
  basketImageInside: {
    position: 'absolute',
    width: 140,
    height: 140,
    top: 9,
    left: 19,
    zIndex: 2,
  },
  welcomeContentContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    zIndex: 2,
  },
  serviceLogo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: "60%",
    height: 50,
    marginRight: 18,
    marginTop: 5,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d1d1d1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userAvatarText: { fontSize: 20 },
  userInfo: {
    flex: 1,
  },
  userName: { fontFamily: "Poppins-Bold", fontSize: 14, color: "#111" },
  userSubtitle: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#666" },
  sellButton: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  sellButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
  },
  statLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  statButton: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  statButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  ratingSection: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingTitle: { fontFamily: "Poppins-Bold", fontSize: 14, color: "#111" },
  ratingScore: { fontFamily: "Poppins-ExtraBold", fontSize: 18, color: "#111" },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  stars: { fontSize: 18, color: "#FBB400" },
  ratingBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  ratingBar: {
    alignItems: "center",
  },
  ratingLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  barContainer: {
    width: 100,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
  barGray: { backgroundColor: "#e0e0e0" },
  barYellow: { backgroundColor: "#ffd700" },
  ratingCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  outlineBtn2: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#111",
  },
  outlineBtnText2: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: "#111",
  },
  txCard: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 12,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  txTitle: { fontFamily: "Poppins-Bold", fontSize: 14, color: "#111" },
  txSub: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#666" },
  txAmount: { fontFamily: "Poppins-Bold", fontSize: 14, color: "#0f6d00" },
  txDate: { fontFamily: "Poppins-Regular", fontSize: 11, color: "#666" },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  basketContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 20,
  },
  basketText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#111",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  gridItem: { width: "48%" },
});
