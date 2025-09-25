import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

// Custom hook for form state management
const useProductForm = () => {
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

  const [errors, setErrors] = useState({});
  
  const [borderAnims] = useState({
    name: new Animated.Value(0),
    price: new Animated.Value(0),
    quantity: new Animated.Value(0),
    harvestDate: new Animated.Value(0),
    description: new Animated.Value(0),
  });

  const handleInputChange = (field, value, validator) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (validator) {
      const error = validator(value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  return {
    productData,
    setProductData,
    errors,
    setErrors,
    borderAnims,
    handleInputChange
  };
};

export default function AddProductScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const router = useRouter();
  
  const {
    productData,
    errors,
    setErrors,
    borderAnims,
    handleInputChange
  } = useProductForm();

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

  const handleProductImageUpload = () => {
    Alert.alert(
      "Add Product Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takeProductPhoto(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => pickProductImage(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const takeProductPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileSize = result.assets[0].fileSize || 0;
        if (fileSize > 10 * 1024 * 1024) { // 10MB limit
          Alert.alert('File too large', 'Please choose an image smaller than 10MB.');
          return;
        }
        setProductImages([...productImages, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickProductImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileSize = result.assets[0].fileSize || 0;
        if (fileSize > 10 * 1024 * 1024) { // 10MB limit
          Alert.alert('File too large', 'Please choose an image smaller than 10MB.');
          return;
        }
        setProductImages([...productImages, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeProductImage = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
  };

  // Validation helper functions
  const validateProductName = (name) => {
    if (!name?.trim()) {
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
    if (!price?.trim()) {
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
    if (!quantity?.trim()) {
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

  const validateDescription = (description) => {
    if (!description?.trim()) {
      return "Description is required";
    }
    if (description.length < 10) {
      return "Description must be at least 10 characters";
    }
    if (description.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const validateHarvestDate = (date) => {
    if (!date?.trim()) {
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

  const performValidation = () => {
    const validationErrors = {
      name: validateProductName(productData.name),
      price: validatePrice(productData.price),
      quantity: validateQuantity(productData.quantity),
      description: validateDescription(productData.description),
      harvestDate: validateHarvestDate(productData.harvestDate),
    };
    
    // Check if category is selected
    if (!productData.category) {
      Alert.alert("Missing Information", "Please select a product category");
      return null;
    }
    
    return validationErrors;
  };

  const handleValidationErrors = (validationErrors) => {
    setErrors(validationErrors);
    
    // Flash borders for invalid fields
    Object.keys(validationErrors).forEach(field => {
      if (validationErrors[field] && borderAnims[field]) {
        flashBorder(borderAnims[field]);
      }
    });
    
    Alert.alert("Validation Error", "Please fix the errors below");
  };

  const submitProduct = () => {
    console.log("Product added:", productData);
    Alert.alert("Success", "Product added successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  const handleAddProduct = () => {
    const validationErrors = performValidation();
    if (!validationErrors) return;
    
    const hasErrors = Object.values(validationErrors).some(error => error !== "");
    
    if (hasErrors) {
      handleValidationErrors(validationErrors);
      return;
    }
    
    submitProduct();
  };

  const renderCategorySelection = () => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, {marginLeft: 25}]}>Category*</Text>
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
  );

  const renderFormHeader = () => (
    <View>
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
        {productImages.length > 0 ? (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {productImages.map((image, index) => (
                <View key={index} style={styles.uploadedImageContainer}>
                  <Image 
                    source={{ uri: image.uri }} 
                    style={styles.uploadedProductImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeProductImage(index)}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {productImages.length < 5 && (
                <TouchableOpacity style={styles.addMoreButton} onPress={handleProductImageUpload}>
                  <Text style={styles.addMoreIcon}>+</Text>
                  <Text style={styles.addMoreText}>Add More</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            <Text style={styles.imageCountText}>{productImages.length}/5 images</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.imageUpload} onPress={handleProductImageUpload}>
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Add Photos</Text>
              <Text style={styles.uploadSubtext}>Tap to upload product images</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderUnitDropdown = () => (
    <View style={[styles.inputGroup, styles.halfWidth]}>
      <Text style={styles.inputLabel}>Unit</Text>
      <View style={styles.unitDropdownContainer}>
        <TouchableOpacity 
          style={styles.unitDropdownButton}
          onPress={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
        >
          <Text style={styles.unitDropdownText}>
            {productData.unit || "Select Unit"}
          </Text>
          <Text style={styles.dropdownArrow}>
            {isUnitDropdownOpen ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        
        {isUnitDropdownOpen && (
          <View style={styles.unitDropdownList}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={styles.unitDropdownItem}
                onPress={() => {
                  handleInputChange("unit", unit);
                  setIsUnitDropdownOpen(false);
                }}
              >
                <Text style={styles.unitDropdownItemText}>{unit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const categories = ["Vegetables", "Fruits", "Grains", "Herbs", "Livestock", "Dairy"];
  const units = ["kg", "pieces", "bundles", "sacks", "liters"];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {renderFormHeader()}

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
        </View>

        {renderCategorySelection()}

        {/* Description Field */}
<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Description *</Text>
  <Animated.View
    style={[
      styles.inputWrapper,
      errors.description && {
        borderColor: borderAnims.description.interpolate({
          inputRange: [0, 1],
          outputRange: ["#ff4444", "#ff0000"],
        }),
      },
    ]}
  >
    <TextInput
      style={[
        styles.textInput,
        styles.multilineInput, // add this for height + vertical align
        errors.description && styles.inputError,
      ]}
      value={productData.description}
      onChangeText={(value) =>
        handleInputChange("description", value, validateDescription)
      }
      placeholder="Enter product details, quality, or usage info..."
      placeholderTextColor="#999"
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  </Animated.View>
  {errors.description ? (
    <Text style={styles.errorText}>{errors.description}</Text>
  ) : null}
</View>


      {/* Pricing & Quantity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing & Quantity</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>Price*</Text>
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

          {renderUnitDropdown()}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Available Quantity*</Text>
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
          <View style={styles.inputWrapper}>
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
            {productImages.length > 0 ? (
              <Image 
                source={{ uri: productImages[0].uri }} 
                style={styles.previewProductImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.previewImageText}>📷</Text>
            )}
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
    </View>
    </ScrollView>
  );
};

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
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
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
    fontFamily: "Poppins-SemiBold",
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
  imageScroll: {
    marginBottom: 10,
  },
  uploadedImageContainer: {
    marginRight: 10,
    position: "relative",
  },
  uploadedProductImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  addMoreButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  addMoreIcon: {
    fontSize: 24,
    color: "#666",
    marginBottom: 4,
  },
  addMoreText: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  imageCountText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
    marginLeft: 20,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 20,
    width: "90%", // Make all inputs same width as description
    alignSelf: "center",
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
      minHeight: 120,
      textAlignVertical: "top",
      paddingHorizontal: 12,
      paddingTop: 12,
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",  // align left
    gap: 10,
    marginLeft: 28
  }
  ,
  categoryOption: {
    paddingHorizontal: 11,
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
  unitDropdownContainer: {
    position: "relative",
  },
  unitDropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
  },
  unitDropdownText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins-Bold",
  },
  unitDropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 4,
    zIndex: 1000,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  unitDropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  unitDropdownItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
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
  previewProductImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
