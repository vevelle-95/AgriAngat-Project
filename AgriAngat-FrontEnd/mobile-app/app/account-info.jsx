import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

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
    // Save user info logic here
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    // Simulate account deletion process
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate back to login or home screen
    router.replace("/");
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

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>
        <Text style={styles.userName}>{userInfo.name}</Text>
        <Text style={styles.memberSince}>Member since {userInfo.joinDate}</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoInput}
              value={userInfo.name}
              onChangeText={(value) => handleInputChange("name", value)}
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
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.infoValue}>{userInfo.address}</Text>
          )}
        </View>
      </View>

      {/* Farm Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farm Information</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Farm Size</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoInput}
              value={userInfo.farmSize}
              onChangeText={(value) => handleInputChange("farmSize", value)}
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
            />
          ) : (
            <Text style={styles.infoValue}>{userInfo.cropType}</Text>
          )}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.DeleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.DeleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.backButtonModal}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.backIconModal}>←</Text>
              <Text style={styles.backTextModal}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.modalContent}>
              <View style={styles.warningIconContainer}>
                <View style={styles.warningIcon}>
                  <Text style={styles.warningIconText}>👤</Text>
                </View>
              </View>
              
              <Text style={styles.modalTitle}>Are you sure you want</Text>
              <Text style={styles.modalTitle}>to DELETE your account?</Text>
              
              <TouchableOpacity 
                style={styles.deleteConfirmButton}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successContent}>
              <View style={styles.successIconContainer}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              
              <Text style={styles.successTitle}>Thank You!</Text>
              <Text style={styles.successMessage}>Your account has been deleted</Text>
              
              <TouchableOpacity 
                style={styles.exitButton}
                onPress={handleSuccessClose}
              >
                <Text style={styles.exitButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
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
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  bottomButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 15,
  },
  editButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#0f6d00",
    borderRadius: 9999,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    marginTop: -15
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0f6d00",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
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
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  infoInput: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginRight: 8,
  },
  settingArrow: {
    fontSize: 18,
    color: "#999",
  },
  DeleteButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#ff3b30",
    borderRadius: 9999,
    alignItems: "center",
  },
  DeleteButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    maxWidth: 400,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  backButtonModal: {
    flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignSelf: "flex-start",
  },
  backIconModal: {
    fontSize: 18,
    marginRight: 8,
    color: "#333",
  },
  backTextModal: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  modalContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  warningIconContainer: {
    marginBottom: 30,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  warningIconText: {
    fontSize: 40,
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  deleteConfirmButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 30,
  },
  deleteConfirmButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  
  // Success Modal Styles
  successContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  successIconContainer: {
    marginBottom: 30,
  },
  successIcon: {
    fontSize: 60,
    color: "#4CAF50",
    fontFamily: "Poppins-Bold",
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  exitButton: {
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  exitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
});
