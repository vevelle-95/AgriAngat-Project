import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { useTheme } from "../../context/ThemeContext";
// @ts-ignore
import agriangatLogo from "../../assets/images/agriangat-nobg-logo.png";

export default function AccountScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("Gcash");
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const router = useRouter();

  // Mock transaction data
  const transactions = [
    { id: 1, type: "Sale", item: "Saging (5kg)", amount: "+₱250", date: "Aug 20, 2025", status: "Completed" },
    { id: 2, type: "Purchase", item: "Fertilizer", amount: "-₱150", date: "Aug 18, 2025", status: "Completed" },
    { id: 3, type: "Sale", item: "Mangga (3kg)", amount: "+₱180", date: "Aug 15, 2025", status: "Completed" },
    { id: 4, type: "Sale", item: "Orange (2kg)", amount: "+₱120", date: "Aug 12, 2025", status: "Pending" },
  ];

  const paymentMethods = ["Gcash", "Maya", "BPI", "Cash"];

  const getThemeDisplayText = () => {
    if (themeMode === 'system') return 'System';
    return themeMode === 'dark' ? 'Dark' : 'Light';
  };

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

  const handleHelpCenter = () => {
    Alert.alert(
      "Help Center",
      "Contact our support team:\n\n📧 Email: support@agriangat.com\n📞 Phone: +63 2 8123 4567\n💬 Live Chat: Available 24/7",
      [{ text: "OK" }]
    );
  };

  const handleTermsOfUse = () => {
    Alert.alert(
      "Terms of Use",
      "AgriAngat Terms of Service:\n\n• Use the platform responsibly\n• Provide accurate product information\n• Respect other users\n• Follow all applicable laws\n\nFor full terms, visit our website.",
      [{ text: "OK" }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "We protect your privacy:\n\n• Your data is encrypted and secure\n• We don't share personal info\n• You control your data visibility\n• Transparent data practices\n\nFor full policy, visit our website.",
      [{ text: "OK" }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => router.replace("/login") }
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }} // Add padding to avoid navbar overlap
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Image source={agriangatLogo} style={styles.brandIcon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile card */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.border }]}>
          <Text style={[styles.avatarText, { color: colors.text }]}>JD</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>Juan Dela Cruz</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>Verified profile — July 25, 2025</Text>
        </View>
        <TouchableOpacity
          style={[styles.viewBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/account-info")}
        >
          <Text style={[styles.viewBtnText, { color: isDark ? colors.background : '#fff' }]}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Settings list */}
      <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => setShowPaymentsModal(true)}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/payments.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Payments</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>{selectedPayment} →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => setShowTransactionsModal(true)}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/refresh.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Transactions</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* APP Section */}
      <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>APP</Text>
      <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => setShowThemeModal(true)}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/theme.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Theme</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>{getThemeDisplayText()} →</Text>
        </TouchableOpacity>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/language.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Language</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>English</Text>
        </View>
      </View>

      {/* ABOUT Section */}
      <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>ABOUT</Text>
      <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={handleHelpCenter}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/help.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Help Center</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={handleTermsOfUse}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/terms-of-use.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Terms of Use</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={handlePrivacyPolicy}>
          <View style={styles.rowLeft}>
            <Image source={require("../../assets/images/privacy.png")} style={[styles.rowIcon, { tintColor: colors.textSecondary }]} />
            <Text style={[styles.rowText, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.textTertiary }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Spacing before logout */}
      <View style={styles.logoutSpacing} />

      {/* Logout */}
      <TouchableOpacity
        style={[styles.row, styles.logoutRow, { borderTopColor: colors.border }]}
        onPress={handleLogout}
      >
        <View style={styles.rowLeft}>
          <Image source={require("../../assets/images/logout.png")} style={[styles.rowIcon, { tintColor: "#c0392b" }]} />
          <Text
            style={[
              styles.rowText,
              { color: "#c0392b", fontFamily: "Poppins-Bold" },
            ]}
          >
            Logout
          </Text>
        </View>
        <Text style={styles.rowSub}> </Text>
      </TouchableOpacity>

      {/* Modals */}
      {/* Theme Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Theme</Text>
              <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.themeOptions}>
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { borderColor: colors.border, backgroundColor: themeMode === 'system' ? colors.surface : 'transparent' }
                ]}
                onPress={() => {
                  setThemeMode('system');
                  setShowThemeModal(false);
                }}
              >
                <Text style={[styles.themeOptionText, { color: colors.text }]}>⚙️ System</Text>
                {themeMode === 'system' && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.themeOption,
                  { borderColor: colors.border, backgroundColor: themeMode === 'light' ? colors.surface : 'transparent' }
                ]}
                onPress={() => {
                  setThemeMode('light');
                  setShowThemeModal(false);
                }}
              >
                <Text style={[styles.themeOptionText, { color: colors.text }]}>☀️ Light Mode</Text>
                {themeMode === 'light' && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.themeOption,
                  { borderColor: colors.border, backgroundColor: themeMode === 'dark' ? colors.surface : 'transparent' }
                ]}
                onPress={() => {
                  setThemeMode('dark');
                  setShowThemeModal(false);
                }}
              >
                <Text style={[styles.themeOptionText, { color: colors.text }]}>🌙 Dark Mode</Text>
                {themeMode === 'dark' && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payments Modal */}
      <Modal
        visible={showPaymentsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Payment Methods</Text>
              <TouchableOpacity onPress={() => setShowPaymentsModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentOptions}>
              {paymentMethods.map((method) => (
                <TouchableOpacity 
                  key={method}
                  style={[
                    styles.paymentOption,
                    { borderColor: colors.border, backgroundColor: selectedPayment === method ? colors.surface : 'transparent' }
                  ]}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentsModal(false);
                  }}
                >
                  <Text style={[styles.paymentOptionText, { color: colors.text }]}>{method}</Text>
                  {selectedPayment === method && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Transactions Modal */}
      <Modal
        visible={showTransactionsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTransactionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.transactionModal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setShowTransactionsModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={[styles.transactionItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionType, { color: colors.text }]}>{transaction.type}</Text>
                    <Text style={[styles.transactionItemName, { color: colors.textSecondary }]}>{transaction.item}</Text>
                    <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{transaction.date}</Text>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      transaction.type === 'Sale' ? styles.positiveAmount : styles.negativeAmount
                    ]}>
                      {transaction.amount}
                    </Text>
                    <Text style={[
                      styles.transactionStatus,
                      transaction.status === 'Completed' ? styles.completedStatus : styles.pendingStatus
                    ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* In-screen quick nav removed (tab bar already present) */}
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
  headerTitle: { fontFamily: "Poppins-ExtraBold", fontSize: 23, color: "#111", marginTop: 45, marginLeft: 197 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dcdcdc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#666",
  },
  name: { fontFamily: "Poppins-Bold", fontSize: 14, color: "#111" },
  meta: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: "#111",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  viewBtnText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 12 },
  sectionHeader: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: "#9a9a9a",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  list: {
    marginTop: 4,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: "#666",
  },
  rowText: { fontFamily: "Poppins-Regular", fontSize: 14, color: "#111" },
  rowSub: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#9a9a9a" },
  logoutSpacing: {
    height: 20,
  },
  logoutRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '60%',
  },
  transactionModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#111',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  themeOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  checkmark: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  paymentOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  transactionsList: {
    maxHeight: 400,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#111',
    marginBottom: 2,
  },
  transactionItemName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  positiveAmount: {
    color: '#0f6d00',
  },
  negativeAmount: {
    color: '#c0392b',
  },
  transactionStatus: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedStatus: {
    color: '#0f6d00',
    backgroundColor: '#e8f5e8',
  },
  pendingStatus: {
    color: '#f39c12',
    backgroundColor: '#fef9e7',
  },
});
