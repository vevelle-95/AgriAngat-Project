import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Modal, TextInput, FlatList } from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { NEARBY_STORES, USER_LISTINGS } from "../../data/mockData";
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
  { id: "1", name: "Saba Banana", price: "₱50", image: banana, category: "1" },
  { id: "2", name: "Papaya", price: "₱80", image: papaya, category: "1" },
  { id: "3", name: "Lemon", price: "₱30", image: lemon, category: "1" },
  { id: "4", name: "Pakwan", price: "₱60", image: pakwan, category: "1" },
  { id: "5", name: "Mangga", price: "₱40", image: mangga, category: "1" },
  { id: "6", name: "Strawberry", price: "₱90", image: strawberry, category: "1" },
  { id: "7", name: "Fresh Milk", price: "₱120", image: dairy, category: "2" },
  { id: "8", name: "Farm Eggs", price: "₱180", image: dairy, category: "2" },
  { id: "9", name: "Natural Juice", price: "₱85", image: beverages, category: "3" },
  { id: "10", name: "Herbal Tea", price: "₱65", image: beverages, category: "3" },
  { id: "11", name: "Fresh Lettuce", price: "₱45", image: vegetables, category: "4" },
  { id: "12", name: "Organic Tomatoes", price: "₱55", image: vegetables, category: "4" },
];

const CATEGORIES = [
  { id: "1", name: "Fruits", image: fruits },
  { id: "2", name: "Milk & egg", image: dairy },
  { id: "3", name: "Beverages", image: beverages },
  { id: "4", name: "Vegetables", image: vegetables },
];

const ProductCard = memo(function ProductCard({ item, onOpenModal }) {
  const handlePress = useCallback(() => {
    onOpenModal?.(item);
  }, [item, onOpenModal]);

  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardRow}>
          <Text style={styles.star}>★ 4.8 (287)</Text>
          <TouchableOpacity 
            style={styles.plusBtn}
            onPress={handlePress}
          >
            <Text style={styles.plusText}>＋</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
    </View>
  );
});

// Empty category component
const EmptyCategoryComponent = memo(function EmptyCategoryComponent({ categoryName }) {
  return (
    <View style={styles.emptyCategory}>
      <Text style={styles.emptyCategoryIcon}>📦</Text>
      <Text style={styles.emptyCategoryTitle}>No products available</Text>
      <Text style={styles.emptyCategoryText}>
        Check back later for new {categoryName?.toLowerCase()} products
      </Text>
    </View>
  );
});

EmptyCategoryComponent.propTypes = {
  categoryName: PropTypes.string,
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.any,
  }).isRequired,
  onOpenModal: PropTypes.func,
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
  
  // Memoize dimensions to avoid recalculation
  const CARD_WIDTH = useMemo(() => Dimensions.get("window").width - 32, []);
  const promoSlides = 3;
  const [promoIndex, setPromoIndex] = useState(0);
  const promoScrollRef = useRef(null);

  // Modal states for add to basket
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Category filtering states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryView, setIsCategoryView] = useState(false);

  // Basket functionality
  const [basketItems, setBasketItems] = useState([
    {
      id: 1,
      name: "Organic Rice",
      price: 45,
      quantity: 2,
      unit: "kg",
      seller: "Rice Farm Co.",
      image: require("../../assets/images/rice-terraces.png"),
    },
    {
      id: 2,
      name: "Fresh Mangoes",
      price: 80,
      quantity: 1,
      unit: "kg",
      seller: "Tropical Fruits",
      image: require("../../assets/images/mango.png"),
    },
    {
      id: 3,
      name: "Bell Peppers",
      price: 120,
      quantity: 3,
      unit: "kg",
      seller: "Veggie Garden",
      image: require("../../assets/images/bell-pepper.png"),
    },
  ]);

  // Basket helper functions - memoized for performance
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setBasketItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setBasketItems(items => items.filter(item => item.id !== id));
  }, []);

  const getTotalAmount = useCallback(() => {
    return basketItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [basketItems]);

  const getTotalItems = useCallback(() => {
    return basketItems.reduce((total, item) => total + item.quantity, 0);
  }, [basketItems]);

  const handleCheckout = () => {
    if (basketItems.length === 0) {
      return;
    }
    
    // Show success alert
    const totalAmount = getTotalAmount() + 50;
    alert(`Order placed successfully!\nTotal: ${formatAmount(totalAmount)}\n\nYour order will be delivered within 2-3 business days.`);
    
    // Clear basket
    setBasketItems([]);
    
    // Optionally navigate to a different screen
    // router.push('/order-confirmation');
  };

  const addToBasket = useCallback((product, quantity = 1) => {
    // Convert price string to number (remove ₱ symbol)
    const price = parseInt(product.price.replace('₱', ''));
    
    // Check if item already exists in basket
    const existingItem = basketItems.find(item => item.id === parseInt(product.id));
    
    if (existingItem) {
      // Update quantity if item exists
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      // Add new item to basket
      const newItem = {
        id: basketItems.length + 1,
        name: product.name,
        price: price,
        quantity: quantity,
        unit: "kg",
        seller: "Local Farm",
        image: product.image,
      };
      setBasketItems(prev => [...prev, newItem]);
    }
    
    // Show success message
    alert(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to basket!`);
  }, [basketItems, updateQuantity]);

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setModalQuantity(1);
  }, []);

  const handleModalAddToBasket = useCallback(() => {
    if (selectedProduct && modalQuantity > 0) {
      addToBasket(selectedProduct, modalQuantity);
      closeModal();
    }
  }, [selectedProduct, modalQuantity, addToBasket, closeModal]);

  const updateModalQuantity = useCallback((newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setModalQuantity(newQuantity);
    }
  }, []);

  const handleCategoryPress = useCallback((category) => {
    setSelectedCategory(category);
    setIsCategoryView(true);
  }, []);

  const getFilteredProducts = useMemo(() => {
    if (!selectedCategory) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(product => product.category === selectedCategory.id);
  }, [selectedCategory]);

  // Memoized render functions for FlatList
  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.gridItem}>
      <ProductCard item={item} onOpenModal={openProductModal} />
    </View>
  ), [openProductModal]);

  const keyExtractor = useCallback((item) => item.id, []);

  // Memoized product data for explore view
  const exploreProducts = useMemo(() => MOCK_PRODUCTS.slice(0, 6), []);

  const goBackToExplore = useCallback(() => {
    setIsCategoryView(false);
    setSelectedCategory(null);
  }, []);

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
          <Text style={styles.statNumber}>{NEARBY_STORES.length}</Text>
          <Text style={styles.statLabel}>Stores Nearby</Text>
          <TouchableOpacity 
            style={styles.statButton}
            onPress={() => router.push("/nearby-stores")}
          >
            <Text style={styles.statButtonText}>Look Nearby Stores</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{USER_LISTINGS.active.length}</Text>
          <Text style={styles.statLabel}>Active Listing{USER_LISTINGS.active.length !== 1 ? 's' : ''}</Text>
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
          <Text style={styles.reviewCount}>(2 reviews)</Text>
        </View>
        <View style={styles.ratingBars}>
          {[
            { star: 5, count: 0, percentage: 0 },
            { star: 4, count: 2, percentage: 100 },
            { star: 3, count: 0, percentage: 0 },
            { star: 2, count: 0, percentage: 0 },
            { star: 1, count: 0, percentage: 0 }
          ].map((rating) => (
            <View key={rating.star} style={styles.ratingBarRow}>
              <Text style={styles.ratingLabel}>{rating.star}</Text>
              <Text style={styles.starIcon}>★</Text>
              <View style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.barFill, 
                      rating.percentage > 0 ? styles.barYellow : styles.barGray,
                      { width: `${rating.percentage}%` }
                    ]} 
                  />
                </View>
              </View>
              <Text style={styles.ratingCount}>{rating.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Transactions Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <TouchableOpacity 
          style={styles.outlineBtn2}
          onPress={() => router.push("/sales-transactions")}
        >
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
            <Text style={styles.txAmount}>₱300.00</Text>
            <Text style={styles.txDate}>Dec 14, 2024</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderBasketContent = () => (
    <View style={styles.basketContent}>
      {basketItems.length === 0 ? (
        <View style={styles.emptyBasket}>
          <Text style={styles.emptyBasketIcon}>🛒</Text>
          <Text style={styles.emptyBasketTitle}>Your basket is empty</Text>
          <Text style={styles.emptyBasketText}>Add products from the Explore tab to get started</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => setActiveTab("Explore")}
          >
            <Text style={styles.exploreButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.basketHeader}>
            <Text style={styles.basketTitle}>My Basket</Text>
            <Text style={styles.itemCount}>{getTotalItems()} items</Text>
          </View>
          
          <ScrollView style={styles.basketItemsList} showsVerticalScrollIndicator={false}>
            {basketItems.map((item) => (
              <View key={item.id} style={styles.basketItem}>
                <Image source={item.image} style={styles.basketItemImage} />
                <View style={styles.basketItemInfo}>
                  <Text style={styles.basketItemName}>{item.name}</Text>
                  <Text style={styles.basketItemSeller}>by {item.seller}</Text>
                  <Text style={styles.basketItemPrice}>{formatAmount(item.price)}/{item.unit}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.basketSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatAmount(getTotalAmount())}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee:</Text>
              <Text style={styles.summaryValue}>{formatAmount(50)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatAmount(getTotalAmount() + 50)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
        <View style={[styles.alertCard, { width: CARD_WIDTH, backgroundColor: "#E0FFE0", position: 'relative', marginLeft: 0, marginRight: 0 }]}>
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
        <View style={[styles.alertCard, { width: CARD_WIDTH, backgroundColor: "#FFDB24", marginLeft: 0, marginRight: 0 }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.alertTitle, { fontFamily: "Poppins-ExtraBold" }]}>Rainy Season Alert: Farm with Caution</Text>
            <Text style={[styles.alertSub, { color: "#0a0b0a" }]}>PAGASA forecasts up to 16 tropical cyclones from AUG to DEC. Ensure to prepare or stock before weather disrupts supply chains.</Text>
          </View>
          <View style={styles.alertIconContainer}>
            <Image source={redsky} style={[styles.alertIcon, { width: 130, height: 150, marginTop: 0, marginRight: -20 }]} />
          </View>
        </View>
        <View style={[styles.alertCard, { width: CARD_WIDTH, backgroundColor: "#0ca201", marginLeft: 0, marginRight: 0 }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.alertTitle, { color: "#ffffff", marginTop: -20 }]}>Sell fresh, buy fresh.</Text>
            <Text style={[styles.alertSub, { color: "#ffffff", marginBottom: 40 }]}>
              With our Marketplace, farmers connect directly to stores and buyers nearby. No extra layers, no unfair markups
            </Text>
            <View style={styles.serviceLogo}>
              <Image source={marketplace} style={styles.logoIcon} />
            </View>
          </View>
          <View style={styles.alertIconContainer}>
            <Image source={greenbag} style={{ width: 125, height: 142, marginTop: 10, marginRight: -20 }} />
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
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={styles.categoryIcon}>
              <Image source={category.image} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's picks */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Today's picks</Text>
    </>
  );

  const renderCategoryContent = () => (
    <>
      {/* Category Header */}
      <View style={styles.categoryHeader}>
        <TouchableOpacity onPress={goBackToExplore} style={styles.categoryBackButton}>
          <Text style={styles.categoryBackIcon}>←</Text>
          <Text style={styles.categoryBackText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.categoryTitleSection}>
          <Image source={selectedCategory?.image} style={styles.categoryHeaderImage} />
          <Text style={styles.categoryTitle}>{selectedCategory?.name}</Text>
        </View>
      </View>

      {/* Category Products Grid */}
      <FlatList
        data={getFilteredProducts}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.productsRow}
        contentContainerStyle={styles.categoryProductsGrid}
        scrollEnabled={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        windowSize={5}
        ListEmptyComponent={<EmptyCategoryComponent categoryName={selectedCategory?.name} />}
      />
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Sell":
        return renderSellContent();
      case "Basket":
        return renderBasketContent();
      default:
        return isCategoryView ? renderCategoryContent() : renderExploreContent();
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
            {tab === "Basket" && getTotalItems() > 0 && (
              <View style={styles.basketBadge}>
                <Text style={styles.basketBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}

      {/* Products Grid for Explore tab (only show in regular explore view) */}
      {activeTab === "Explore" && !isCategoryView && (
        <FlatList
          data={exploreProducts}
          renderItem={renderProductItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.productsRow}
          contentContainerStyle={styles.productsGrid}
          scrollEnabled={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
          windowSize={5}
        />
      )}

      {/* Add to Basket Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add to Basket</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalProductInfo}>
                  <Image source={selectedProduct.image} style={styles.modalProductImage} />
                  <View style={styles.modalProductDetails}>
                    <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                    <Text style={styles.modalProductPrice}>{selectedProduct.price}/kg</Text>
                    <Text style={styles.modalProductSeller}>by Local Farm</Text>
                  </View>
                </View>

                <View style={styles.quantitySection}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.modalQuantityButton}
                      onPress={() => updateModalQuantity(modalQuantity - 1)}
                    >
                      <Text style={styles.modalQuantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      value={modalQuantity.toString()}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 1;
                        updateModalQuantity(num);
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                      textAlign="center"
                    />
                    <TouchableOpacity 
                      style={styles.modalQuantityButton}
                      onPress={() => updateModalQuantity(modalQuantity + 1)}
                    >
                      <Text style={styles.modalQuantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalSummary}>
                  <Text style={styles.modalSummaryText}>
                    Total: {new Intl.NumberFormat('en-PH', {
                      style: 'currency',
                      currency: 'PHP'
                    }).format(parseInt(selectedProduct.price.replace('₱', '')) * modalQuantity)}
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.modalCancelButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalAddButton}
                    onPress={handleModalAddToBasket}
                  >
                    <Text style={styles.modalAddButtonText}>Add to Basket</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    position: "relative",
  },
  tabButtonActive: {
    backgroundColor: "#0f6d00",
  },
  tabText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#333",
  },
  tabTextActive: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  basketBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  basketBadgeText: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: "#fff",
  },

  // Promo cards
  promoScroll: {
    paddingHorizontal: 0,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  backgroundRingsContainer: {
    position: 'absolute',
    top: 20,
    right: -20,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    zIndex: 1,
  },
  backgroundRings: {
    width: 170,
    height: 170,
    borderRight: 80,
    top: 0,
    resizeMode: 'contain',

  },
  basketImageInside: {
    position: 'absolute',
    width: 150,
    height: 150,
    left: 10,
    bottom: -10,
    resizeMode: 'contain',
  },
  welcomeContentContainer: {
    flex: 1,
    zIndex: 2,
    paddingRight: 120,
  },
  alertTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 16,
    color: "#111",
    marginBottom: 0,
  },
  alertSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  alertIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  serviceLogo: {
    marginTop: 10,
  },
  logoIcon: {
    width: 140,
    height: 140,
    marginTop: -80,
    marginBottom: -370,
    resizeMode: 'contain',
  },

  dotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  dotActive: {
    backgroundColor: "#0f6d00",
  },

  // Categories
  sectionTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 18,
    color: "#111",
    marginBottom: 10,
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  categoryText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#111",
    textAlign: "center",
  },

  // Products
  productsGrid: {
    justifyContent: "space-between",
    marginTop: 10,
  },
  gridItem: { width: "48%" },
  productsRow: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111",
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  star: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#666",
  },
  plusBtn: {
    backgroundColor: "#0f6d00",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  cardPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#0f6d00",
  },

  // Sell tab styles
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#111",
    marginBottom: 4,
  },
  userSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
  },

  sellButton: {
    backgroundColor: "#0f6d00",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  sellButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statNumber: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 24,
    color: "#0f6d00",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  statButton: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  statButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#007AFF",
    textAlign: "center",
  },

  ratingSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#111",
  },
  ratingScore: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 24,
    color: "#0f6d00",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stars: {
    fontSize: 16,
    marginRight: 8,
  },
  reviewCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
  },
  ratingBars: {
    gap: 8,
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#111",
    width: 10,
  },
  starIcon: {
    fontSize: 12,
    color: "#FFD700",
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  barYellow: {
    backgroundColor: "#FFD700",
  },
  barGray: {
    backgroundColor: "#e0e0e0",
  },
  ratingCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#111",
    width: 20,
    textAlign: "right",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  outlineBtn2: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  outlineBtnText2: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#007AFF",
  },

  txCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111",
    marginBottom: 4,
  },
  txSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
  },
  txAmount: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#0f6d00",
    textAlign: "right",
    marginBottom: 4,
  },
  txDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },

  basketImageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  basketImage: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },

  // Basket tab styles
  basketContent: {
    flex: 1,
  },
  emptyBasket: {
    alignItems: "center",
    paddingVertical: 60,
    marginTop: 50,
  },
  emptyBasketIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyBasketTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#111",
    marginBottom: 8,
  },
  emptyBasketText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#0f6d00",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  exploreButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#fff",
  },

  basketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  basketTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 20,
    color: "#111",
  },
  itemCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
  },

  basketItemsList: {
    flex: 1,
    marginBottom: 20,
  },
  basketItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  basketItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  basketItemInfo: {
    flex: 1,
  },
  basketItemName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
  },
  basketItemSeller: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  basketItemPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: "#0f6d00",
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
  },
  quantityText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#111",
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },

  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff4444",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
  },

  basketSummary: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111",
  },
  totalRow: {
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#111",
  },
  totalValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#0f6d00",
  },
  checkoutButton: {
    backgroundColor: "#0f6d00",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
  },

  // Category View Styles
  categoryHeader: {
    marginBottom: 20,
  },
  categoryBackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  categoryBackIcon: {
    fontSize: 20,
    marginRight: 8,
    color: "#333",
  },
  categoryBackText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  categoryTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 24,
    color: "#111",
  },
  categoryProductsGrid: {
    justifyContent: "space-between",
    marginTop: 10,
  },
  emptyCategory: {
    alignItems: "center",
    paddingVertical: 60,
    marginTop: 50,
  },
  emptyCategoryIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyCategoryTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#111",
    marginBottom: 8,
  },
  emptyCategoryText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: 350,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#111",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#666",
  },
  modalProductInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
  },
  modalProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  modalProductDetails: {
    flex: 1,
  },
  modalProductName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#111",
    marginBottom: 2,
  },
  modalProductPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#0f6d00",
    marginBottom: 2,
  },
  modalProductSeller: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666",
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#111",
    marginBottom: 12,
  },
  modalQuantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalQuantityButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
  },
  quantityInput: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#111",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 15,
    minWidth: 60,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalSummary: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalSummaryText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#0f6d00",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#666",
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: "#0f6d00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalAddButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#fff",
  },
});
