import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function AddProductScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    unit: "kg",
    description: "",
    harvestDate: "",
    location: "",
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [borderAnims] = useState({
    name: new Animated.Value(0),
    price: new Animated.Value(0),
    quantity: new Animated.Value(0),
    harvestDate: new Animated.Value(0),
  });
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

  // Validation helper functions
  const validateProductName = (name) => {
    if (!name || !name.trim()) {
      return "Product name is required";
    }
    if (name.length < 2) {
      return "Product name must be at least 2 characters";
    }
    if (name.length > 50) {
      return "Product name must be less than 50 characters";
    }
    return "";
  };

  const validatePrice = (price) => {
    if (!price || !price.trim()) {
      return "Price is required";
    }
    const numPrice = parseFloat(price.replace(/,/g, ''));
    if (isNaN(numPrice) || numPrice <= 0) {
      return "Please enter a valid price";
    }
    if (numPrice > 10000) {
      return "Price seems unusually high. Please verify.";
    }
    return "";
  };

  const validateQuantity = (quantity) => {
    if (!quantity || !quantity.trim()) {
      return "Quantity is required";
    }
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return "Please enter a valid quantity";
    }
    if (numQuantity > 10000) {
      return "Quantity seems unusually high. Please verify.";
    }
    return "";
  };

  const validateHarvestDate = (date) => {
    if (!date || !date.trim()) {
      return ""; // Optional field
    }
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
    if (!dateRegex.test(date)) {
      return "Please use MM/DD/YYYY format";
    }
    const inputDate = new Date(date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    if (inputDate > today) {
      return "Harvest date cannot be in the future";
    }
    if (inputDate < oneYearAgo) {
      return "Harvest date seems too old";
    }
    return "";
  };

  // Animation for red border flash
  const flashBorder = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  if (!fontsLoaded) return null;

  const handleInputChange = (field, value, validator) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (validator) {
      const error = validator(value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleAddProduct = () => {
    const validationErrors = {
      name: validateProductName(productData.name),
      price: validatePrice(productData.price),
      quantity: validateQuantity(productData.quantity),
      harvestDate: validateHarvestDate(productData.harvestDate),
    };
    
    // Check if category is selected
    if (!productData.category) {
      Alert.alert("Missing Information", "Please select a product category");
      return;
    }
    
    setErrors(validationErrors);
    
    // Flash borders for invalid fields
    Object.keys(validationErrors).forEach(field => {
      if (validationErrors[field] && borderAnims[field]) {
        flashBorder(borderAnims[field]);
      }
    });
    
    const hasErrors = Object.values(validationErrors).some(error => error !== "");
    
    if (hasErrors) {
      Alert.alert("Validation Error", "Please fix the errors below");
      return;
    }
    
    // Handle product submission
    console.log("Product added:", productData);
    Alert.alert("Success", "Product added successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  const categories = ["Vegetables", "Fruits", "Grains", "Herbs", "Livestock", "Dairy"];
  const units = ["kg", "pieces", "bundles", "sacks", "liters"];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Add New Product</Text>
      <Text style={styles.subtitle}>List your fresh produce for sale</Text>

      {/* Product Image Upload */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Photos</Text>
        <TouchableOpacity style={styles.imageUpload}>
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>Add Photos</Text>
            <Text style={styles.uploadSubtext}>Tap to upload product images</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Product Name *</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.name && {
              borderColor: borderAnims.name.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={productData.name}
              onChangeText={(value) => handleInputChange("name", value, validateProductName)}
              placeholder="e.g., Fresh Tomatoes, Organic Rice"
              placeholderTextColor="#999"
            />
          </Animated.View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category *</Text>
          <View style={styles.categoryOptions}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  productData.category === category && styles.categoryOptionSelected
                ]}
                onPress={() => handleInputChange("category", category)}
              >
                <Text style={[
                  styles.categoryText,
                  productData.category === category && styles.categoryTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={productData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            placeholder="Describe your product quality, farming method, etc."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Pricing & Quantity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing & Quantity</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>Price *</Text>
            <Animated.View style={[
              styles.priceInputContainer,
              errors.price && {
                borderColor: borderAnims.price.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#ff4444', '#ff0000']
                })
              }
            ]}>
              <Text style={styles.currencySymbol}>₱</Text>
              <TextInput
                style={[styles.priceInput, errors.price && styles.inputError]}
                value={productData.price}
                onChangeText={(value) => handleInputChange("price", value, validatePrice)}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </Animated.View>
            {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>Unit</Text>
            <View style={styles.unitOptions}>
              {units.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitOption,
                    productData.unit === unit && styles.unitOptionSelected
                  ]}
                  onPress={() => handleInputChange("unit", unit)}
                >
                  <Text style={[
                    styles.unitText,
                    productData.unit === unit && styles.unitTextSelected
                  ]}>
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Available Quantity *</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.quantity && {
              borderColor: borderAnims.quantity.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.textInput, errors.quantity && styles.inputError]}
              value={productData.quantity}
              onChangeText={(value) => handleInputChange("quantity", value, validateQuantity)}
              placeholder="Enter quantity available"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </Animated.View>
          {errors.quantity ? <Text style={styles.errorText}>{errors.quantity}</Text> : null}
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Harvest Date</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.harvestDate && {
              borderColor: borderAnims.harvestDate.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.textInput, errors.harvestDate && styles.inputError]}
              value={productData.harvestDate}
              onChangeText={(value) => handleInputChange("harvestDate", value, validateHarvestDate)}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#999"
            />
          </Animated.View>
          {errors.harvestDate ? <Text style={styles.errorText}>{errors.harvestDate}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Farm Location</Text>
          <TextInput
            style={styles.textInput}
            value={productData.location}
            onChangeText={(value) => handleInputChange("location", value)}
            placeholder="City, Province"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Preview Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewImagePlaceholder}>
            <Text style={styles.previewImageText}>📷</Text>
          </View>
          <View style={styles.previewContent}>
            <Text style={styles.previewName}>
              {productData.name || "Product Name"}
            </Text>
            <Text style={styles.previewCategory}>
              {productData.category || "Category"}
            </Text>
            <Text style={styles.previewPrice}>
              ₱{productData.price || "0.00"} per {productData.unit}
            </Text>
            <Text style={styles.previewQuantity}>
              {productData.quantity || "0"} {productData.unit} available
            </Text>
          </View>
        </View>
      </View>

      {/* Add Product Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Product to Marketplace</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
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
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 15,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
    backgroundColor: "transparent",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 5,
    marginLeft: 4,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  categoryOptionSelected: {
    backgroundColor: "#0f6d00",
    borderColor: "#0f6d00",
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
    height: 50,
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  unitOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  unitOptionSelected: {
    backgroundColor: "#0f6d00",
    borderColor: "#0f6d00",
  },
  unitText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  unitTextSelected: {
    color: "#fff",
  },
  previewCard: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
    gap: 15,
  },
  previewImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImageText: {
    fontSize: 24,
  },
  previewContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  previewName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  previewCategory: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  previewPrice: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#0f6d00",
  },
  previewQuantity: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  addButton: {
    marginHorizontal: 20,
    backgroundColor: "#0f6d00",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
});
