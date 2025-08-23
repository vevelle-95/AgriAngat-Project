import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function UpcomingPaymentsScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const router = useRouter();

  // Extended mock data for upcoming payments
  const upcomingPayments = [
    {
      id: "1",
      loanId: "00001",
      loanDate: "Aug 10, 2025",
      amount: 5000,
      dueDate: "Sept 10, 2025",
      status: "due_soon",
      daysUntilDue: 18,
      principalAmount: 4500,
      interestAmount: 500,
      lateFeesAmount: 0,
    },
    {
      id: "2",
      loanId: "00002",
      loanDate: "Aug 10, 2025",
      amount: 5000,
      dueDate: "Oct 10, 2025",
      status: "upcoming",
      daysUntilDue: 48,
      principalAmount: 4500,
      interestAmount: 500,
      lateFeesAmount: 0,
    },
    {
      id: "3",
      loanId: "00003",
      loanDate: "Aug 10, 2025",
      amount: 5000,
      dueDate: "Nov 10, 2025",
      status: "upcoming",
      daysUntilDue: 79,
      principalAmount: 4500,
      interestAmount: 500,
      lateFeesAmount: 0,
    },
    {
      id: "4",
      loanId: "00004",
      loanDate: "Aug 15, 2025",
      amount: 7500,
      dueDate: "Dec 15, 2025",
      status: "upcoming",
      daysUntilDue: 114,
      principalAmount: 7000,
      interestAmount: 500,
      lateFeesAmount: 0,
    },
    {
      id: "5",
      loanId: "00005",
      loanDate: "Sept 1, 2025",
      amount: 3000,
      dueDate: "Jan 1, 2026",
      status: "upcoming",
      daysUntilDue: 131,
      principalAmount: 2800,
      interestAmount: 200,
      lateFeesAmount: 0,
    },
    {
      id: "6",
      loanId: "00006",
      loanDate: "Sept 5, 2025",
      amount: 8000,
      dueDate: "Feb 5, 2026",
      status: "upcoming",
      daysUntilDue: 166,
      principalAmount: 7500,
      interestAmount: 500,
      lateFeesAmount: 0,
    }
  ];

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getFilteredPayments = () => {
    switch (filterType) {
      case "due_soon":
        return upcomingPayments.filter(payment => payment.daysUntilDue <= 30);
      case "next_3_months":
        return upcomingPayments.filter(payment => payment.daysUntilDue <= 90);
      case "all":
      default:
        return upcomingPayments;
    }
  };

  const getStatusBadge = (payment) => {
    if (payment.daysUntilDue <= 7) {
      return { text: "Due Very Soon", style: styles.statusUrgent };
    } else if (payment.daysUntilDue <= 30) {
      return { text: "Due Soon", style: styles.statusSoon };
    } else {
      return { text: "Upcoming", style: styles.statusUpcoming };
    }
  };

  const getTotalAmount = () => {
    return getFilteredPayments().reduce((total, payment) => total + payment.amount, 0);
  };

  const renderPaymentCard = (payment) => {
    const statusBadge = getStatusBadge(payment);
    
    return (
      <View key={payment.id} style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <View style={styles.loanInfo}>
            <Text style={styles.loanId}>Loan: {payment.loanId}</Text>
            <View style={[styles.statusBadge, statusBadge.style]}>
              <Text style={styles.statusText}>{statusBadge.text}</Text>
            </View>
          </View>
          <View style={styles.daysContainer}>
            <Text style={styles.daysNumber}>{payment.daysUntilDue}</Text>
            <Text style={styles.daysLabel}>days left</Text>
          </View>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Date:</Text>
            <Text style={styles.detailValue}>{payment.loanDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date:</Text>
            <Text style={styles.detailValue}>{payment.dueDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Principal:</Text>
            <Text style={styles.detailValue}>{formatAmount(payment.principalAmount)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Interest:</Text>
            <Text style={styles.detailValue}>{formatAmount(payment.interestAmount)}</Text>
          </View>
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{formatAmount(payment.amount)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => router.push("/loan-payment")}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Upcoming Payments</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{getFilteredPayments().length}</Text>
            <Text style={styles.summaryLabel}>Total Loans</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryAmount}>{formatAmount(getTotalAmount())}</Text>
            <Text style={styles.summaryLabel}>Total Amount</Text>
          </View>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === "all" && styles.filterButtonActive]}
          onPress={() => setFilterType("all")}
        >
          <Text style={[styles.filterButtonText, filterType === "all" && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === "due_soon" && styles.filterButtonActive]}
          onPress={() => setFilterType("due_soon")}
        >
          <Text style={[styles.filterButtonText, filterType === "due_soon" && styles.filterButtonTextActive]}>
            Due Soon
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === "next_3_months" && styles.filterButtonActive]}
          onPress={() => setFilterType("next_3_months")}
        >
          <Text style={[styles.filterButtonText, filterType === "next_3_months" && styles.filterButtonTextActive]}>
            Next 3 Months
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payments List */}
      <ScrollView 
        style={styles.paymentsList}
        contentContainerStyle={styles.paymentsListContent}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredPayments().map(renderPaymentCard)}
        
        {getFilteredPayments().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No payments found</Text>
            <Text style={styles.emptyText}>
              No upcoming payments match your current filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 40,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    minHeight: Platform.OS === "ios" ? 60 : 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
  },
  backIcon: {
    fontSize: 20,
    marginRight: 4,
    color: "#1E293B",
  },
  backText: {
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "Poppins-SemiBold",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#1E293B",
    flex: 1,
    textAlign: "center",
    marginRight: 80,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#0EA5E9",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: screenWidth < 350 ? 16 : 18,
    fontFamily: "Poppins-Bold",
    color: "#16A34A",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    minHeight: 40,
  },
  filterButtonActive: {
    backgroundColor: "#0EA5E9",
    borderColor: "#0EA5E9",
  },
  filterButtonText: {
    fontSize: screenWidth < 350 ? 10 : 12,
    fontFamily: "Poppins-SemiBold",
    color: "#64748B",
    textAlign: "center",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  paymentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  paymentsListContent: {
    paddingBottom: 20,
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  loanInfo: {
    flex: 1,
    marginRight: 12,
  },
  loanId: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusUrgent: {
    backgroundColor: "#FEE2E2",
  },
  statusSoon: {
    backgroundColor: "#FEF3C7",
  },
  statusUpcoming: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
  },
  daysContainer: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 70,
  },
  daysNumber: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#0EA5E9",
  },
  daysLabel: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    textAlign: "center",
  },
  paymentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    minHeight: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#1E293B",
    textAlign: "right",
    flex: 1,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#1E293B",
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#16A34A",
  },
  payButton: {
    backgroundColor: "#0EA5E9",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  payButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
