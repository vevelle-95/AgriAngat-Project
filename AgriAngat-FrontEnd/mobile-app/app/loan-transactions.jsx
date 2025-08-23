import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function LoanTransactionsScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  // Extended loan transaction data with history
  const [allTransactions] = useState([
    {
      id: 1,
      date: "2025-08-20",
      amount: 5000,
      type: "Payment",
      status: "Completed",
      loanId: "LN001",
      description: "Monthly loan payment",
      paymentMethod: "GCash",
    },
    {
      id: 2,
      date: "2025-07-20",
      amount: 5000,
      type: "Payment",
      status: "Completed",
      loanId: "LN001",
      description: "Monthly loan payment",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 3,
      date: "2025-06-20",
      amount: 5000,
      type: "Payment",
      status: "Completed",
      loanId: "LN001",
      description: "Monthly loan payment",
      paymentMethod: "Cash",
    },
    {
      id: 4,
      date: "2025-05-20",
      amount: 5000,
      type: "Payment",
      status: "Completed",
      loanId: "LN001",
      description: "Monthly loan payment",
      paymentMethod: "PayMaya",
    },
    {
      id: 5,
      date: "2025-04-20",
      amount: 25000,
      type: "Disbursement",
      status: "Completed",
      loanId: "LN001",
      description: "Initial loan disbursement",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 6,
      date: "2025-08-15",
      amount: 3000,
      type: "Payment",
      status: "Pending",
      loanId: "LN002",
      description: "Partial payment - Crop loan",
      paymentMethod: "GCash",
    },
    {
      id: 7,
      date: "2025-08-01",
      amount: 15000,
      type: "Disbursement",
      status: "Completed",
      loanId: "LN002",
      description: "Crop loan disbursement",
      paymentMethod: "Bank Transfer",
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

  const filterTransactions = () => {
    switch (activeFilter) {
      case "payments":
        return allTransactions.filter(t => t.type === "Payment");
      case "disbursements":
        return allTransactions.filter(t => t.type === "Disbursement");
      case "pending":
        return allTransactions.filter(t => t.status === "Pending");
      case "completed":
        return allTransactions.filter(t => t.status === "Completed");
      default:
        return allTransactions;
    }
  };

  const transactions = filterTransactions();

  const getTotalPayments = () => {
    return allTransactions
      .filter(t => t.type === "Payment" && t.status === "Completed")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getOutstandingBalance = () => {
    const totalDisbursed = allTransactions
      .filter(t => t.type === "Disbursement" && t.status === "Completed")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPaid = getTotalPayments();
    return totalDisbursed - totalPaid;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <Text style={styles.title}>Loan Transactions</Text>

          {/* Transaction Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Transaction Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Payments:</Text>
              <Text style={styles.summaryValue}>{formatAmount(getTotalPayments())}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Outstanding Balance:</Text>
              <Text style={styles.balanceAmount}>{formatAmount(getOutstandingBalance())}</Text>
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
                { key: "payments", label: "Payments" },
                { key: "disbursements", label: "Disbursements" },
                { key: "completed", label: "Completed" },
                { key: "pending", label: "Pending" },
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
          </View>

        <View style={styles.transactionsList}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
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
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'Disbursement' ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {transaction.type === 'Disbursement' ? '+' : '-'}{formatAmount(transaction.amount)}
                </Text>
              </View>
              
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.loanId}>Loan ID: {transaction.loanId}</Text>
              {Boolean(transaction.paymentMethod) && (
                <Text style={styles.paymentMethod}>Method: {transaction.paymentMethod}</Text>
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
  balanceAmount: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
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
    marginBottom: 10,
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
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
  },
  transactionAmount: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  positiveAmount: {
    color: "#16A34A",
  },
  negativeAmount: {
    color: "#DC2626",
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    marginBottom: 5,
  },
  loanId: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#94A3B8",
  },
  paymentMethod: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#0EA5E9",
    marginTop: 4,
  },
});
