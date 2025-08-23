import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function LoanPaymentScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const router = useRouter();

  // Sample loan data
  const loanData = {
    id: "LN001",
    totalAmount: 25000,
    paidAmount: 15000,
    remainingBalance: 10000,
    monthlyPayment: 5000,
    nextDueDate: "2025-09-20",
    interestRate: 8.5,
  };

  const paymentMethods = [
    { id: "gcash", name: "GCash", icon: "📱" },
    { id: "paymaya", name: "PayMaya", icon: "💳" },
    { id: "bank", name: "Bank Transfer", icon: "🏦" },
    { id: "cash", name: "Cash Payment", icon: "💵" },
  ];

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePayment = () => {
    if (!paymentAmount) {
      Alert.alert("Error", "Please enter payment amount");
      return;
    }
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select payment method");
      return;
    }
    if (parseFloat(paymentAmount) <= 0) {
      Alert.alert("Error", "Payment amount must be greater than 0");
      return;
    }
    if (parseFloat(paymentAmount) > loanData.remainingBalance) {
      Alert.alert("Error", "Payment amount cannot exceed remaining balance");
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `Pay ${formatAmount(parseFloat(paymentAmount))} using ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pay Now", onPress: processPayment }
      ]
    );
  };

  const processPayment = () => {
    // Simulate payment processing
    Alert.alert(
      "Payment Successful",
      "Your loan payment has been processed successfully!",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const setQuickAmount = (amount) => {
    setPaymentAmount(amount.toString());
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Pay Loan</Text>
        {/* Loan Summary */}
        <View style={styles.loanSummaryCard}>
          <Text style={styles.sectionTitle}>Loan Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Loan ID:</Text>
            <Text style={styles.summaryValue}>{loanData.id}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining Balance:</Text>
            <Text style={[styles.summaryValue, styles.balanceAmount]}>
              {formatAmount(loanData.remainingBalance)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Payment:</Text>
            <Text style={styles.summaryValue}>
              {formatAmount(loanData.monthlyPayment)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Next Due Date:</Text>
            <Text style={styles.summaryValue}>
              {formatDate(loanData.nextDueDate)}
            </Text>
          </View>
        </View>

        {/* Payment Amount */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Amount</Text>
          
          <View style={styles.quickAmountButtons}>
            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => setQuickAmount(loanData.monthlyPayment)}
            >
              <Text style={styles.quickAmountText}>Monthly Payment</Text>
              <Text style={styles.quickAmountValue}>
                {formatAmount(loanData.monthlyPayment)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => setQuickAmount(loanData.remainingBalance)}
            >
              <Text style={styles.quickAmountText}>Full Balance</Text>
              <Text style={styles.quickAmountValue}>
                {formatAmount(loanData.remainingBalance)}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.amountInput}
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              <View style={styles.radioButton}>
                {selectedPaymentMethod === method.id && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Number (if needed) */}
        {(selectedPaymentMethod === "gcash" || 
          selectedPaymentMethod === "paymaya" || 
          selectedPaymentMethod === "bank") && (
          <View style={styles.accountSection}>
            <Text style={styles.sectionTitle}>
              {selectedPaymentMethod === "bank" ? "Account Number" : "Mobile Number"}
            </Text>
            <TextInput
              style={styles.accountInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder={
                selectedPaymentMethod === "bank" 
                  ? "Enter account number" 
                  : "Enter mobile number"
              }
              keyboardType={selectedPaymentMethod === "bank" ? "numeric" : "phone-pad"}
            />
          </View>
        )}

        {/* Payment Button */}
        <TouchableOpacity
          style={[
            styles.payButton,
            (!paymentAmount || !selectedPaymentMethod) && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!paymentAmount || !selectedPaymentMethod}
        >
          <Text style={styles.payButtonText}>
            Pay {paymentAmount ? formatAmount(parseFloat(paymentAmount) || 0) : "Amount"}
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
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
    fontSize: 18,
    marginRight: 6,
    color: "#333",
  },
  backText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 15,
  },
  loanSummaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#DC2626",
  },
  paymentSection: {
    marginBottom: 25,
  },
  quickAmountButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  quickAmountButton: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 15,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0EA5E9",
  },
  quickAmountText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#0EA5E9",
    marginBottom: 5,
  },
  quickAmountValue: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#0EA5E9",
  },
  amountInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
  },
  paymentMethodSection: {
    marginBottom: 25,
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  selectedPaymentMethod: {
    backgroundColor: "#F0F9FF",
    borderColor: "#0EA5E9",
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0EA5E9",
  },
  accountSection: {
    marginBottom: 25,
  },
  accountInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
  },
  payButton: {
    backgroundColor: "#1E40AF",
    borderRadius: 25,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  payButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});
