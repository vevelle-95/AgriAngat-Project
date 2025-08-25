import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Pressable, Modal } from 'react-native';
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import VerificationDialog from "../components/VerificationDialog";

const LoanApplication = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [formData, setFormData] = useState({
        loanType: '',
        loanAmount: '',
        purpose: '',
        installmentPlan: '',
        homeAddressOwnership: '',
        mothersMaidenName: '',
        registeredBusinessName: '',
        yearsInOperation: '',
        sourceOfFunds: '',
        primaryCropType: ''
    });
    const [showLoanTypeDropdown, setShowLoanTypeDropdown] = useState(false);
    const [showInstallmentDropdown, setShowInstallmentDropdown] = useState(false);
    const [showYearsInOperationDropdown, setShowYearsInOperationDropdown] = useState(false);
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);
    const loanTypeRef = useRef(null);
    const installmentRef = useRef(null);

    const router = useRouter();

    const loanTypes = [
        'Agricultural Loan',
        'Equipment Loan',
        'Crop Loan',
        'Disaster Recovery Loan'
    ];

    const installmentOptions = [
        { label: 'Daily', description: 'Pay a small amount every day. Best for those with daily income from selling goods.' },
        { label: 'Bi-weekly', description: 'Pay every 2 weeks. Good for semi-monthly sales.' },
        { label: 'Monthly', description: 'Pay once a month, the most common option.' },
        { label: 'Seasonal', description: 'Pay during harvest season only (every 3–6 months).' }
    ];

    const yearsInOperationOptions = [
        'Less than 1 year',
        '1-2 years',
        '3-5 years',
        '6-10 years',
        'More than 10 years'
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Validate form data
        if (!formData.loanType) {
            Alert.alert("Error", "Please select a loan type");
            return;
        }
        if (!formData.loanAmount) {
            Alert.alert("Error", "Please enter the desired loan amount");
            return;
        }
        if (!formData.purpose) {
            Alert.alert("Error", "Please enter the purpose of the loan");
            return;
        }
        if (!formData.installmentPlan) {
            Alert.alert("Error", "Please select an installment plan");
            return;
        }
        if (!formData.homeAddressOwnership) {
            Alert.alert("Error", "Please enter home address ownership information");
            return;
        }
        if (!formData.mothersMaidenName) {
            Alert.alert("Error", "Please enter mother's maiden name");
            return;
        }
        if (!formData.registeredBusinessName) {
            Alert.alert("Error", "Please enter registered business name");
            return;
        }
        if (!formData.yearsInOperation) {
            Alert.alert("Error", "Please select years in operation");
            return;
        }
        if (!formData.sourceOfFunds) {
            Alert.alert("Error", "Please enter source of funds");
            return;
        }
        if (!formData.primaryCropType) {
            Alert.alert("Error", "Please enter primary crop type");
            return;
        }

        // Show verification dialog instead of directly submitting
        setShowVerificationDialog(true);
    };

    const handleConfirmSubmit = () => {
        // Close the verification dialog
        setShowVerificationDialog(false);
        
        // Navigate to the success page
        router.replace("/loan-application-success");
    };

    const handleCancel = () => {
        router.back();
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
                    <Text style={styles.title}>Application for Loan</Text>

                    {/* Type of Loan */}
                    <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Type of Loan</Text>
                        <TouchableOpacity
                            ref={loanTypeRef}
                            style={[styles.selectField, formData.loanType && styles.selectFieldActive]}
                            onPress={() => {
                                setShowLoanTypeDropdown(!showLoanTypeDropdown);
                                setShowInstallmentDropdown(false);
                            }}
                        >
                            <Text style={[styles.selectText, !formData.loanType && styles.placeholderText]}>
                                {formData.loanType || 'Select Loan Type'}
                            </Text>
                            <Text style={styles.selectArrow}>▼</Text>
                        </TouchableOpacity>
                        {showLoanTypeDropdown && (
                          <Modal
                            transparent
                            visible={showLoanTypeDropdown}
                            animationType="fade"
                            onRequestClose={() => setShowLoanTypeDropdown(false)}
                          >
                            <View style={styles.modalOverlay}>
                              <Pressable
                                style={StyleSheet.absoluteFill}
                                onPress={() => setShowLoanTypeDropdown(false)}
                              />
                              <View style={styles.modalCard}>
                                <Text style={styles.modalTitle}>Select Loan Type</Text>
                                {loanTypes.map((type, index) => (
                                  <TouchableOpacity
                                    key={type}
                                    style={index === loanTypes.length - 1 ? styles.modalOptionLast : styles.modalOption}
                                    onPress={() => {
                                        setFormData(prev => ({ ...prev, loanType: type }));
                                        setTimeout(() => setShowLoanTypeDropdown(false), 0);
                                    }}
                                    activeOpacity={0.7}
                                  >
                                    <Text style={[
                                      styles.modalOptionText,
                                      formData.loanType === type && styles.modalOptionTextSelected
                                    ]}>
                                      {type}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                          </Modal>
                        )}
                    </View>

                    {/* Desired Loan Amount */}
                    <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Desired Loan Amount</Text>
                        <TextInput
                            style={styles.textField}
                            placeholder="e.g., 25000"
                            value={formData.loanAmount}
                            onChangeText={(value) => handleInputChange('loanAmount', value)}
                            keyboardType="numeric"
                            placeholderTextColor="#C7C7CD"
                        />
                    </View>

                    {/* Purpose of Loan */}
                    <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Purpose of Loan</Text>
                        <TextInput
                            style={styles.textAreaField}
                            placeholder="Briefly explain why you need this loan (e.g., To buy seeds, repair irrigation system)"
                            value={formData.purpose}
                            onChangeText={(value) => handleInputChange('purpose', value)}
                            multiline={true}
                            numberOfLines={3}
                            placeholderTextColor="#C7C7CD"
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Installment Plan */}
                    <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Installment Plan</Text>
                        <Text style={styles.fieldDescription}>
                            Choose how you want to pay back your loan based on your income schedule.
                        </Text>
                        <TouchableOpacity
                            ref={installmentRef}
                            style={[styles.selectField, formData.installmentPlan && styles.selectFieldActive]}
                            onPress={() => {
                                setShowInstallmentDropdown(!showInstallmentDropdown);
                                setShowLoanTypeDropdown(false);
                            }}
                        >
                            <Text style={[styles.selectText, !formData.installmentPlan && styles.placeholderText]}>
                                {formData.installmentPlan || 'Select Installment Plan'}
                            </Text>
                            <Text style={styles.selectArrow}>▼</Text>
                        </TouchableOpacity>
                        {showInstallmentDropdown && (
                          <Modal
                            transparent
                            visible={showInstallmentDropdown}
                            animationType="fade"
                            onRequestClose={() => setShowInstallmentDropdown(false)}
                          >
                            <View style={styles.modalOverlay}>
                              <Pressable
                                style={StyleSheet.absoluteFill}
                                onPress={() => setShowInstallmentDropdown(false)}
                              />
                              <View style={styles.installmentModalCard}>
                                <Text style={styles.modalTitle}>Select Installment Plan</Text>
                                {installmentOptions.map((option, index) => (
                                  <TouchableOpacity
                                    key={option.label}
                                    style={index === installmentOptions.length - 1 ? styles.installmentModalOptionLast : styles.installmentModalOption}
                                    onPress={() => {
                                        setFormData(prev => ({ ...prev, installmentPlan: option.label }));
                                        setTimeout(() => setShowInstallmentDropdown(false), 0);
                                    }}
                                    activeOpacity={0.7}
                                  >
                                    <Text style={[
                                      styles.modalOptionText,
                                      formData.installmentPlan === option.label && styles.modalOptionTextSelected
                                    ]}>
                                      {option.label}
                                    </Text>
                                    <Text style={styles.modalOptionDescription}>
                                      {option.description}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                          </Modal>
                        )}
                    </View>

                    {/* Additional Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Additional Information</Text>
                        
                        {/* Home Address Ownership */}
                        <View style={styles.formSection}>
                            <Text style={styles.fieldLabel}>Home Address Ownership</Text>
                            <TextInput
                                style={styles.textField}
                                placeholder="e.g., Owned, Rented, Family Property"
                                value={formData.homeAddressOwnership}
                                onChangeText={(value) => handleInputChange('homeAddressOwnership', value)}
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>

                        {/* Mother's Maiden Name */}
                        <View style={styles.formSection}>
                            <Text style={styles.fieldLabel}>Mother's Maiden Name</Text>
                            <TextInput
                                style={styles.textField}
                                placeholder="Enter mother's maiden name"
                                value={formData.mothersMaidenName}
                                onChangeText={(value) => handleInputChange('mothersMaidenName', value)}
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>

                        {/* Registered Business Name */}
                        <View style={styles.formSection}>
                            <Text style={styles.fieldLabel}>Registered Business Name</Text>
                            <TextInput
                                style={styles.textField}
                                placeholder="Enter your registered business name"
                                value={formData.registeredBusinessName}
                                onChangeText={(value) => handleInputChange('registeredBusinessName', value)}
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>

                        {/* Years in Operation */}
                        <View style={styles.formSection}>
                            <Text style={styles.fieldLabel}>Years in Operation</Text>
                            <TouchableOpacity
                                style={[styles.selectField, formData.yearsInOperation && styles.selectFieldActive]}
                                onPress={() => {
                                    setShowYearsInOperationDropdown(!showYearsInOperationDropdown);
                                    setShowLoanTypeDropdown(false);
                                    setShowInstallmentDropdown(false);
                                }}
                            >
                                <Text style={[styles.selectText, !formData.yearsInOperation && styles.placeholderText]}>
                                    {formData.yearsInOperation || 'Select Years in Operation'}
                                </Text>
                                <Text style={styles.selectArrow}>▼</Text>
                            </TouchableOpacity>
                            {showYearsInOperationDropdown && (
                              <Modal
                                transparent
                                visible={showYearsInOperationDropdown}
                                animationType="fade"
                                onRequestClose={() => setShowYearsInOperationDropdown(false)}
                              >
                                <View style={styles.modalOverlay}>
                                  <Pressable
                                    style={StyleSheet.absoluteFill}
                                    onPress={() => setShowYearsInOperationDropdown(false)}
                                  />
                                  <View style={styles.modalCard}>
                                    <Text style={styles.modalTitle}>Select Years in Operation</Text>
                                    {yearsInOperationOptions.map((option, index) => (
                                      <TouchableOpacity
                                        key={option}
                                        style={index === yearsInOperationOptions.length - 1 ? styles.modalOptionLast : styles.modalOption}
                                        onPress={() => {
                                            setFormData(prev => ({ ...prev, yearsInOperation: option }));
                                            setTimeout(() => setShowYearsInOperationDropdown(false), 0);
                                        }}
                                        activeOpacity={0.7}
                                      >
                                        <Text style={[
                                          styles.modalOptionText,
                                          formData.yearsInOperation === option && styles.modalOptionTextSelected
                                        ]}>
                                          {option}
                                        </Text>
                                      </TouchableOpacity>
                                    ))}
                                  </View>
                                </View>
                              </Modal>
                            )}
                        </View>

                        {/* Source of Funds */}
                        <View style={styles.formSection}>
                            <Text style={styles.fieldLabel}>Source of Funds</Text>
                            <TextInput
                                style={styles.textField}
                                placeholder="e.g., Farm Income, Savings, Business Revenue"
                                value={formData.sourceOfFunds}
                                onChangeText={(value) => handleInputChange('sourceOfFunds', value)}
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>

                        {/* Primary Crop Type */}
                        <View style={styles.formSection}>
                            <Text style={styles.fieldLabel}>Primary Crop Type</Text>
                            <TextInput
                                style={styles.textField}
                                placeholder="e.g., Rice, Corn, Vegetables, Fruits"
                                value={formData.primaryCropType}
                                onChangeText={(value) => handleInputChange('primaryCropType', value)}
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>
                    </View>

                    {/* Disclaimer */}
                    <Text style={styles.disclaimerText}>
                        By submitting, you agree to share your personal and farm information with AgriAngat AI and its partner banks for the purpose of processing your loan application. Please ensure all details are true and accurate, as false information may affect your AngatScore or loan approval.
                    </Text>

                    {/* Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Verification Dialog */}
            <VerificationDialog
                visible={showVerificationDialog}
                onClose={() => setShowVerificationDialog(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Loan Application"
                message="Are you sure all the information you provided is correct? Please review your loan details before submitting."
            />
        </KeyboardAvoidingView>
    );
};

export default LoanApplication;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: "Poppins-ExtraBold",
        color: "#333",
        marginBottom: 15,
        marginTop: 25
    },
    formSection: {
        marginBottom: 20,
        position: 'relative',
    },
    fieldLabel: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    textField: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#FFFFFF',
        color: '#1F2937',
    },
    textAreaField: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#FFFFFF',
        color: '#1F2937',
        minHeight: 80,
    },
    selectField: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectFieldActive: {
        borderColor: '#3B82F6',
        backgroundColor: '#F0F9FF',
    },
    selectText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#1F2937',
        flex: 1,
    },
    selectArrow: {
        fontSize: 14,
        color: '#6B7280',
    },
    fieldDescription: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 20,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    dropdownText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#333",
        flex: 1,
    },
    placeholderText: {
        color: "#999",
    },
    dropdownArrow: {
        fontSize: 12,
        color: "#666",
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderTopWidth: 0,
        borderRadius: 8,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: "#fff",
        maxHeight: 200,
    },
    dropdownItem: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 12,
        borderBottomColor: "#f0f0f0",
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        backgroundColor: "#fff",
        color: "#333",
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        backgroundColor: "#fff",
        color: "#333",
        height: 100,
        textAlignVertical: "top",
    },
    paymentTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        color: "#333",
        marginBottom: 5,
    },
    paymentDescription: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666",
        lineHeight: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#333",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: "#333",
    },
    submitButton: {
        flex: 1,
        backgroundColor: "#007AFF",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: "#fff",
    },
    disclaimer: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666",
        lineHeight: 18,
        textAlign: "justify",
        marginTop: 10,
    },
    paymentOptionsGrid: {
        marginBottom: 24,
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        gap: 12,
    },
    paymentCard: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 100,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        marginBottom: 20,
        gap: 16,
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#3B82F6',
    },
    submitBtn: {
        flex: 1,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitBtnText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#FFFFFF',
    },
    disclaimerText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#64748B',
        lineHeight: 18,
        textAlign: 'left',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-ExtraBold',
        color: '#1F2937',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOption: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOptionLast: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    modalOptionText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
    },
    modalOptionTextSelected: {
        color: '#3B82F6',
        fontFamily: 'Poppins-SemiBold',
    },
    installmentModalCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    installmentModalOption: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    installmentModalOptionLast: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    modalOptionDescription: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#6B7280',
        marginTop: 4,
        lineHeight: 18,
    },
});
