import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";
// @ts-ignore
import terraces from "../../assets/images/rice-terraces.png";
const MOCK_PRODUCTS = [
  { id: "1", name: "Saba Banana", price: "₱50", image: terraces },
  { id: "2", name: "Papaya", price: "₱80", image: terraces },
  { id: "3", name: "Lemon", price: "₱30", image: terraces },
  { id: "4", name: "Pakwan", price: "₱60", image: terraces },
  { id: "5", name: "Manga", price: "₱40", image: terraces },
  { id: "6", name: "Strawberry", price: "₱90", image: terraces },
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

  const renderListHeader = () => (
    <>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Promo card */}
      <View style={styles.promoCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.promoTitle}>
            Grow more than crops. Grow your chances.
          </Text>
          <Text style={styles.promoSub}>
            Boost your AngatScore by paying loans on time.
          </Text>
        </View>
        <Image source={terraces} style={styles.promoImage} />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesRow}>
        {["Fruits", "Milk & egg", "Beverages", "Vegetables"].map((cat) => (
          <View key={cat} style={styles.categoryPill}>
            <View style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{cat}</Text>
          </View>
        ))}
      </View>

      {/* Today's picks */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Today's picks</Text>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
      data={MOCK_PRODUCTS}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderProductItem}
      ListHeaderComponent={renderListHeader}
    />
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
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 23, color: "#111", marginTop: 45, marginLeft: 148 },

  promoCard: {
    flexDirection: "row",
    backgroundColor: "#EBFBEA",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  promoTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "#111" },
  promoSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  promoImage: { width: 90, height: 70, borderRadius: 10, marginLeft: 8 },

  sectionTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
    color: "#111",
    marginTop: 14,
    marginBottom: 8,
  },
  categoriesRow: { flexDirection: "row", gap: 10 },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#d1d1d1",
    marginRight: 8,
  },
  categoryText: { fontFamily: "Poppins-Bold", fontSize: 12, color: "#333" },

  card: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 90 },
  cardBody: { padding: 10 },
  cardName: { fontFamily: "Poppins-Bold", fontSize: 13, color: "#111" },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  star: { fontFamily: "Poppins-Regular", fontSize: 10, color: "#666" },
  plusBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginTop: -1,
  },
  cardPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#0f6d00",
    marginTop: 4,
  },
});
