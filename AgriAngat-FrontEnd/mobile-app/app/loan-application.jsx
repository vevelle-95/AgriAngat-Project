import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function LoanApplicationScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: "",
    purpose: "",
    farmSize: "",
    cropType: "",
    monthlyIncome: "",
    repaymentPeriod: "12",
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [borderAnims] = useState({
    loanAmount: new Animated.Value(0),
    farmSize: new Animated.Value(0),
    cropType: new Animated.Value(0),
    monthlyIncome: new Animated.Value(0),
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
  const validateAmount = (amount) => {
    if (!amount || !amount.trim()) {
      return "Loan amount is required";
    }
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      return "Please enter a valid amount";
    }
    if (numAmount < 5000) {
      return "Minimum loan amount is ₱5,000";
    }
    if (numAmount > 500000) {
      return "Maximum loan amount is ₱500,000";
    }
    return "";
  };

  const validateFarmSize = (size) => {
    if (!size || !size.trim()) {
      return "Farm size is required";
    }
    const numSize = parseFloat(size);
    if (isNaN(numSize) || numSize <= 0) {
      return "Please enter a valid farm size";
    }
    if (numSize > 100) {
      return "Farm size seems unusually large. Please verify.";
    }
    return "";
  };

  const validateCropType = (crop) => {
    if (!crop || !crop.trim()) {
      return "Primary crop type is required";
    }
    if (crop.length < 2) {
      return "Please enter a valid crop type";
    }
    return "";
  };

  const validateMonthlyIncome = (income) => {
    if (!income || !income.trim()) {
      return "Monthly income is required";
    }
    const numIncome = parseFloat(income.replace(/,/g, ''));
    if (isNaN(numIncome) || numIncome <= 0) {
      return "Please enter a valid income amount";
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
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (validator) {
      const error = validator(value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = {
      loanAmount: validateAmount(formData.loanAmount),
      farmSize: validateFarmSize(formData.farmSize),
      cropType: validateCropType(formData.cropType),
      monthlyIncome: validateMonthlyIncome(formData.monthlyIncome),
    };
    
    // Check if purpose is selected
    if (!formData.purpose) {
      Alert.alert("Missing Information", "Please select a loan purpose");
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
    
    // Calculate debt-to-income ratio for additional validation
    const loanAmount = parseFloat(formData.loanAmount.replace(/,/g, ''));
    const monthlyIncome = parseFloat(formData.monthlyIncome.replace(/,/g, ''));
    const monthlyPayment = (loanAmount * 1.085) / parseInt(formData.repaymentPeriod);
    const debtRatio = (monthlyPayment / monthlyIncome) * 100;
    
    if (debtRatio > 40) {
      Alert.alert(
        "High Debt Ratio", 
        `Your monthly payment would be ${debtRatio.toFixed(1)}% of your income. Consider a smaller loan amount or longer repayment period.`,
        [
          { text: "Adjust", style: "cancel" },
          { text: "Continue Anyway", onPress: () => router.push("/loan-application-success") }
        ]
      );
      return;
    }
    
    console.log("Loan application submitted:", formData);
    router.push("/loan-application-success");
  };

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
      <Text style={styles.title}>Application for Loan</Text>

      {/* Loan Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Desired Loan Amount</Text>
        <Animated.View style={[
          styles.inputContainer,
          errors.loanAmount && {
            borderColor: borderAnims.loanAmount.interpolate({
              inputRange: [0, 1],
              outputRange: ['#ff4444', '#ff0000']
            })
          }
        ]}>
          <Text style={styles.currencySymbol}>₱</Text>
          <TextInput
            style={[styles.amountInput, errors.loanAmount && styles.inputError]}
            value={formData.loanAmount}
            onChangeText={(value) => handleInputChange("loanAmount", value, validateAmount)}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </Animated.View>
        {errors.loanAmount ? <Text style={styles.errorText}>{errors.loanAmount}</Text> : null}
      </View>

      {/* Loan Purpose */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Purpose of Loan</Text>
        <View style={styles.purposeOptions}>
          {["Seeds & Fertilizer", "Equipment", "Land Expansion", "Working Capital", "Other"].map((purpose) => (
            <TouchableOpacity
              key={purpose}
              style={[
                styles.purposeOption,
                formData.purpose === purpose && styles.purposeOptionSelected
              ]}
              onPress={() => handleInputChange("purpose", purpose)}
            >
              <Text style={[
                styles.purposeText,
                formData.purpose === purpose && styles.purposeTextSelected
              ]}>
                {purpose}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Farm Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farm Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Farm Size (hectares)</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.farmSize && {
              borderColor: borderAnims.farmSize.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.textInput, errors.farmSize && styles.inputError]}
              value={formData.farmSize}
              onChangeText={(value) => handleInputChange("farmSize", value, validateFarmSize)}
              placeholder="Enter farm size"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </Animated.View>
          {errors.farmSize ? <Text style={styles.errorText}>{errors.farmSize}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Primary Crop Type</Text>
          <Animated.View style={[
            styles.inputWrapper,
            errors.cropType && {
              borderColor: borderAnims.cropType.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <TextInput
              style={[styles.textInput, errors.cropType && styles.inputError]}
              value={formData.cropType}
              onChangeText={(value) => handleInputChange("cropType", value, validateCropType)}
              placeholder="e.g., Rice, Corn, Vegetables"
              placeholderTextColor="#999"
            />
          </Animated.View>
          {errors.cropType ? <Text style={styles.errorText}>{errors.cropType}</Text> : null}
        </View>
      </View>

      {/* Financial Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Monthly Income</Text>
          <Animated.View style={[
            styles.inputContainer,
            errors.monthlyIncome && {
              borderColor: borderAnims.monthlyIncome.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ff4444', '#ff0000']
              })
            }
          ]}>
            <Text style={styles.currencySymbol}>₱</Text>
            <TextInput
              style={[styles.amountInput, errors.monthlyIncome && styles.inputError]}
              value={formData.monthlyIncome}
              onChangeText={(value) => handleInputChange("monthlyIncome", value, validateMonthlyIncome)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </Animated.View>
          {errors.monthlyIncome ? <Text style={styles.errorText}>{errors.monthlyIncome}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Preferred Repayment Period</Text>
          <View style={styles.repaymentOptions}>
            {["6", "12", "18", "24"].map((months) => (
              <TouchableOpacity
                key={months}
                style={[
                  styles.repaymentOption,
                  formData.repaymentPeriod === months && styles.repaymentOptionSelected
                ]}
                onPress={() => handleInputChange("repaymentPeriod", months)}
              >
                <Text style={[
                  styles.repaymentText,
                  formData.repaymentPeriod === months && styles.repaymentTextSelected
                ]}>
                  {months} months
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Loan Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Loan Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Loan Amount:</Text>
          <Text style={styles.summaryValue}>₱{formData.loanAmount || "0.00"}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Interest Rate:</Text>
          <Text style={styles.summaryValue}>8.5% per annum</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Repayment Period:</Text>
          <Text style={styles.summaryValue}>{formData.repaymentPeriod} months</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTotalLabel}>Monthly Payment:</Text>
          <Text style={styles.summaryTotalValue}>
            ₱{formData.loanAmount ? (parseFloat(formData.loanAmount) * 1.085 / parseInt(formData.repaymentPeriod)).toFixed(2) : "0.00"}
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Application</Text>
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.termsText}>
        By submitting this application, you agree to our Terms and Conditions and Privacy Policy.
      </Text>
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
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 10,
    marginTop: 20
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
    height: 50,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
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
  currencySymbol: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  purposeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  purposeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  purposeOptionSelected: {
    backgroundColor: "#0f6d00",
    borderColor: "#0f6d00",
  },
  purposeText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  purposeTextSelected: {
    color: "#fff",
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
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
    backgroundColor: "transparent",
  },
  repaymentOptions: {
    flexDirection: "row",
    gap: 10,
  },
  repaymentOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  repaymentOptionSelected: {
    backgroundColor: "#0f6d00",
    borderColor: "#0f6d00",
  },
  repaymentText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  repaymentTextSelected: {
    color: "#fff",
  },
  summaryCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
    marginTop: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  summaryTotalValue: {
    fontSize: 16,
    fontFamily: "Poppins-ExtraBold",
    color: "#0f6d00",
  },
  submitButton: {
    marginHorizontal: 20,
    backgroundColor: "#0f6d00",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  termsText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});
