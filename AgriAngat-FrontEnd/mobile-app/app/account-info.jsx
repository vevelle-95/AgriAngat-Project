import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle } from "react-native-svg";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

const { width: screenWidth } = Dimensions.get('window');

export default function AccountInfoScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 912 345 6789",
    address: "Barangay San Jose, Cabanatuan City, Nueva Ecija",
    farmSize: "2.5 hectares",
    cropType: "Rice, Corn",
    joinDate: "January 2023",
    farmerLevel: "Intermediate",
    totalHarvests: "12",
    angatScore: "88",
    successRate: "94%"
  });
  const router = useRouter();

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

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleInputChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert("Account Deleted", "Your account has been successfully deleted.");
    router.push("/login");
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const renderCircularProgress = (score, size = 80) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, score)) / 100;
    const dashOffset = circumference * (1 - progress);
    
    return (
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E5E5"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#4CAF50"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.circularProgressText}>
          <Text style={styles.scoreNumber}>{score}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Fixed Header with Gradient */}
      <LinearGradient
        colors={['#4CAF50', '#66BB6A']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Profile</Text>
          
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)} 
            style={styles.editHeaderButton}
          >
            <Text style={styles.editHeaderButtonText}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card within Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(userInfo.name)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.memberSince}>Member since {userInfo.joinDate}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{userInfo.farmerLevel} Farmer</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content that goes "into the tunnel" */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            {renderCircularProgress(parseInt(userInfo.angatScore), 60)}
            <Text style={styles.angatStatLabel}>AngatScore</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userInfo.totalHarvests}</Text>
            <Text style={styles.statLabel}>Total Harvests</Text>
            <Text style={styles.statIcon}>🌾</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userInfo.successRate}</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
            <Text style={styles.statIcon}>📈</Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userInfo.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <Text style={styles.infoValue}>{userInfo.name}</Text>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userInfo.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{userInfo.email}</Text>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userInfo.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{userInfo.phone}</Text>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, styles.multilineInput]}
                  value={userInfo.address}
                  onChangeText={(value) => handleInputChange("address", value)}
                  placeholder="Enter your address"
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>{userInfo.address}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Farm Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Farm Size</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userInfo.farmSize}
                  onChangeText={(value) => handleInputChange("farmSize", value)}
                  placeholder="Enter farm size"
                />
              ) : (
                <Text style={styles.infoValue}>{userInfo.farmSize}</Text>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Primary Crops</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userInfo.cropType}
                  onChangeText={(value) => handleInputChange("cropType", value)}
                  placeholder="Enter your main crops"
                />
              ) : (
                <Text style={styles.infoValue}>{userInfo.cropType}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionCard}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push("/angatscore-report")}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View AngatScore Report</Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.warningIconContainer}>
                <View style={styles.warningIcon}>
                  <Text style={styles.warningIconText}>⚠️</Text>
                </View>
              </View>
              
              <Text style={styles.modalTitle}>Delete Account</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete your account? This action cannot be undone.
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={confirmDeleteAccount}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.successIconContainer}>
                <Text style={styles.successIcon}>✅</Text>
              </View>
              
              <Text style={styles.modalTitle}>Profile Updated</Text>
              <Text style={styles.modalMessage}>
                Your profile information has been successfully updated.
              </Text>
              
              <TouchableOpacity 
                style={styles.okButton}
                onPress={handleSuccessClose}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  editHeaderButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  editHeaderButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  levelText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#4CAF50",
  },

  scrollContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  viewReportButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  viewReportButtonText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  angatStatLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginTop: 15,
  },
  statIcon: {
    fontSize: 20,
  },
  circularProgress: {
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#4CAF50",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#111",
  },
  infoInput: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#111",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#111",
  },
  actionArrow: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 20,
    maxWidth: 400,
    width: "90%",
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  warningIconContainer: {
    marginBottom: 20,
  },
  warningIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff3cd",
    alignItems: "center",
    justifyContent: "center",
  },
  warningIconText: {
    fontSize: 30,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#111",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#ff3b30",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
  okButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  okButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});