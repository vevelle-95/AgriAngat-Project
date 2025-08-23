import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SalesTransactionsScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  // Extended sales transaction data with history
  const [allTransactions] = useState([
    {
      id: 1,
      date: "2025-08-22",
      product: "Organic Rice",
      quantity: "50 kg",
      unitPrice: 45,
      totalAmount: 2250,
      buyer: "Manila Rice Store",
      status: "Completed",
      paymentMethod: "Bank Transfer",
      image: require("../assets/images/rice-terraces.png"),
    },
    {
      id: 2,
      date: "2025-08-20",
      product: "Fresh Mangoes",
      quantity: "20 kg",
      unitPrice: 80,
      totalAmount: 1600,
      buyer: "Fruit Paradise",
      status: "Completed",
      paymentMethod: "Cash",
      image: require("../assets/images/mango.png"),
    },
    {
      id: 3,
      date: "2025-08-18",
      product: "Bell Peppers",
      quantity: "15 kg",
      unitPrice: 120,
      totalAmount: 1800,
      buyer: "Fresh Market Co.",
      status: "Pending",
      paymentMethod: "GCash",
      image: require("../assets/images/bell-pepper.png"),
    },
    {
      id: 4,
      date: "2025-08-15",
      product: "Organic Bananas",
      quantity: "30 kg",
      unitPrice: 60,
      totalAmount: 1800,
      buyer: "Healthy Foods Inc.",
      status: "Completed",
      paymentMethod: "PayMaya",
      image: require("../assets/images/banana.png"),
    },
    {
      id: 5,
      date: "2025-08-10",
      product: "Cherry Tomatoes",
      quantity: "25 kg",
      unitPrice: 100,
      totalAmount: 2500,
      buyer: "Metro Supermarket",
      status: "Completed",
      paymentMethod: "Bank Transfer",
      image: require("../assets/images/bell-pepper.png"),
    },
    {
      id: 6,
      date: "2025-08-08",
      product: "Organic Rice",
      quantity: "40 kg",
      unitPrice: 45,
      totalAmount: 1800,
      buyer: "Rice Hub",
      status: "Completed",
      paymentMethod: "Cash",
      image: require("../assets/images/rice-terraces.png"),
    },
    {
      id: 7,
      date: "2025-08-05",
      product: "Fresh Mangoes",
      quantity: "15 kg",
      unitPrice: 80,
      totalAmount: 1200,
      buyer: "Fruit Garden",
      status: "Cancelled",
      paymentMethod: "GCash",
      image: require("../assets/images/mango.png"),
    },
    {
      id: 8,
      date: "2025-08-01",
      product: "Mixed Vegetables",
      quantity: "35 kg",
      unitPrice: 90,
      totalAmount: 3150,
      buyer: "Green Valley Store",
      status: "Pending",
      paymentMethod: "Bank Transfer",
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filterTransactions = () => {
    switch (activeFilter) {
      case "completed":
        return allTransactions.filter(t => t.status === "Completed");
      case "pending":
        return allTransactions.filter(t => t.status === "Pending");
      case "cancelled":
        return allTransactions.filter(t => t.status === "Cancelled");
      case "cash":
        return allTransactions.filter(t => t.paymentMethod === "Cash");
      case "digital":
        return allTransactions.filter(t => 
          t.paymentMethod === "GCash" || 
          t.paymentMethod === "PayMaya" || 
          t.paymentMethod === "Bank Transfer"
        );
      default:
        return allTransactions;
    }
  };

  const transactions = filterTransactions();

  const totalSales = allTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const pendingSales = allTransactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const cancelledSales = allTransactions
    .filter(t => t.status === 'Cancelled')
    .reduce((sum, t) => sum + t.totalAmount, 0);

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
          <Text style={styles.title}>Sales Transactions</Text>

          {/* Sales Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Sales Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Sales:</Text>
              <Text style={[styles.summaryValue, styles.positiveAmount]}>
                {formatAmount(totalSales)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pending Sales:</Text>
              <Text style={styles.summaryValue}>
                {formatAmount(pendingSales)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cancelled Sales:</Text>
              <Text style={[styles.summaryValue, styles.negativeAmount]}>
                {formatAmount(cancelledSales)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Transactions:</Text>
              <Text style={styles.summaryValue}>{allTransactions.length}</Text>
            </View>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Filter Transactions</Text>
            <View style={styles.filterButtons}>
              {[
                { key: "all", label: "All" },
                { key: "completed", label: "Completed" },
                { key: "pending", label: "Pending" },
                { key: "cancelled", label: "Cancelled" },
                { key: "cash", label: "Cash" },
                { key: "digital", label: "Digital" },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    activeFilter === filter.key && styles.filterButtonActive
                  ]}
                  onPress={() => setActiveFilter(filter.key)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    activeFilter === filter.key && styles.filterButtonTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>        <View style={styles.transactionsList}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.productInfo}>
                  <Image source={transaction.image} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{transaction.product}</Text>
                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge, 
                  transaction.status === 'Completed' ? styles.completedStatus : styles.pendingStatus
                ]}>
                  <Text style={[
                    styles.statusText,
                    transaction.status === 'Completed' ? styles.completedText : styles.pendingText
                  ]}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>{transaction.quantity}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Unit Price:</Text>
                  <Text style={styles.detailValue}>{formatAmount(transaction.unitPrice)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={[styles.detailValue, styles.totalAmount]}>
                    {formatAmount(transaction.totalAmount)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerLabel}>Buyer:</Text>
                <Text style={styles.buyerName}>{transaction.buyer}</Text>
              </View>
              {Boolean(transaction.paymentMethod) && (
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodLabel}>Payment Method:</Text>
                  <Text style={styles.paymentMethodValue}>{transaction.paymentMethod}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
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
  summaryCard: {
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
  positiveAmount: {
    color: "#16A34A",
  },
  negativeAmount: {
    color: "#DC2626",
  },
  filterSection: {
    marginBottom: 25,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterButtonActive: {
    backgroundColor: "#0EA5E9",
    borderColor: "#0EA5E9",
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#64748B",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  transactionsList: {
    marginBottom: 20,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedStatus: {
    backgroundColor: "#DCFCE7",
  },
  pendingStatus: {
    backgroundColor: "#FEF3C7",
  },
  cancelledStatus: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  completedText: {
    color: "#16A34A",
  },
  pendingText: {
    color: "#D97706",
  },
  cancelledText: {
    color: "#DC2626",
  },
  transactionDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#16A34A",
  },
  buyerInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginBottom: 8,
  },
  buyerLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    marginRight: 8,
  },
  buyerName: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
  },
  paymentMethodInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    marginRight: 8,
  },
  paymentMethodValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#0EA5E9",
  },
});
