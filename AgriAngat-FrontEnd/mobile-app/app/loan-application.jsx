import React from "react";
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";

const LoanApplication = () => {
  	
  	return (
    		<ScrollView style={styles.loanApplication}>
      			<Text style={[styles.applicationForLoan, styles.buttonText1Typo]}>Application for Loan</Text>
      			<Text style={[styles.typeOfLoan, styles.loanTypo]}>Type of Loan</Text>
      			<Text style={[styles.desiredLoanAmount, styles.loanTypo]}>Desired Loan Amount</Text>
      			<Text style={[styles.purposeOfLoan, styles.loanTypo]}>Purpose of Loan</Text>
      			<Text style={[styles.installmentPlan, styles.loanTypo]}>Installment Plan</Text>
      			<Text style={[styles.bySubmittingYou, styles.youTypo]}>{`By submitting, you agree to share your personal and farm information with AgriAngat AI and its partner banks for the purpose of processing your loan application. Please ensure all details are true and accurate, as false information may affect your AngatScore or loan approval.

`}</Text>
            <Text style={[styles.chooseHowYou, styles.youTypo]}>Choose how you want to pay back your loan based on your income schedule.</Text>
            <Text style={[styles.daily, styles.dailyTypo]}>Daily</Text>
            <Text style={[styles.biWeekly, styles.dailyTypo]}>Bi-weekly</Text>
            <Text style={[styles.monthly, styles.monthlyTypo]}>Monthly</Text>
            <Text style={[styles.seasonal, styles.monthlyTypo]}>Seasonal</Text>
            <Text style={styles.payASmall}>Pay a small amount every day. Best for those with daily income from selling goods.</Text>
            <Text style={[styles.payOnceA, styles.payTypo]}>Pay once a month, the most common option.</Text>
            <Text style={[styles.payDuringHarvest, styles.payTypo]}>Pay during harvest season only (every 3–6 months).</Text>
            <Text style={[styles.payEvery2, styles.payTypo]}>Pay every 2 weeks. Good for semi-monthly sales.</Text>
            <View style={[styles.inputFieldParent, styles.inputLayout]}>
                <View style={[styles.inputField, styles.inputFieldPosition]}>
                    <View style={styles.input} />
                </View>
                <Text style={[styles.eg25000, styles.brieflyLayout]}>e.g., 25000</Text>
            </View>
            <View style={[styles.brieflyExplainWhyYouNeedTWrapper, styles.brieflyLayout]}>
                <Text style={[styles.brieflyExplainWhy, styles.brieflyLayout]}>Briefly explain why you need this loan (e.g., To buy seeds, repair irrigation system)</Text>
            </View>
            <View style={[styles.button, styles.buttonFlexBox]}>
                <Text style={styles.buttonText}>Submit</Text>
            </View>
            <View style={[styles.button1, styles.buttonFlexBox]}>
                <Text style={[styles.buttonText1, styles.buttonText1Typo]}>Cancel</Text>
            </View>
            <View style={[styles.transactions, styles.transactionsPosition]} />
            <View style={[styles.listboxComponent, styles.listboxPosition]}>
                <View style={styles.listboxMain}>
                    <View style={styles.listboxbgShadowBox} />
                    <Chevron style={[styles.chevronIcon, styles.iconLayout]} />
                    <View style={styles.placeholderText}>
                        <Text style={[styles.selectMeasurement, styles.textTypo]}>Select Installment</Text>
                    </View>
                </View>
                <View style={styles.clipList}>
                    <View style={styles.dropdownShadowBox}>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Kilogram (kg)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Gram (g)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Liter (L)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Milliliter (ml)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Piece (pc)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Dozen (12 pc)</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.listboxComponent1, styles.listboxPosition]}>
                <View style={styles.listboxMain}>
                    <View style={styles.listboxbgShadowBox} />
                    <Chevron1 style={[styles.chevronIcon, styles.iconLayout]} />
                    <View style={styles.placeholderText}>
                        <Text style={[styles.selectMeasurement, styles.textTypo]}>Select Installment</Text>
                    </View>
                </View>
                <View style={styles.clipList}>
                    <View style={styles.dropdownShadowBox}>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Kilogram (kg)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Gram (g)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Liter (L)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Milliliter (ml)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Piece (pc)</Text>
                        </View>
                        <View style={styles.item1}>
                            <Text style={[styles.text, styles.textTypo]}>Dozen (12 pc)</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.frameParent, styles.groupChildLayout]}>
                <View style={[styles.groupChild, styles.groupChildLayout]} />
                <View style={[styles.button2, styles.buttonFlexBox]}>
                    <View style={styles.iconLeftArrow}>
                        <Vector1 style={[styles.iconLeftArrowChild, styles.iconLayout]} />
                    </View>
                    <Text style={[styles.buttonText1, styles.buttonText1Typo]}>Back</Text>
                </View>
            </View>
            <View style={[styles.bottomBarNavigationvariant5, styles.transactionsPosition]} />
            <View style={[styles.bottomBar, styles.bottomBarLayout]}>
                <View style={styles.bottomBarInner}>
                    <View style={[styles.homeIndicatorWrapper, styles.homePosition]}>
                        <View style={[styles.homeIndicator, styles.homePosition]} />
                    </View>
                </View>
                <View style={[styles.homeindicator, styles.homePosition]} />
            </View>
        </ScrollView>);
};

const styles = StyleSheet.create({
    buttonText1Typo: {
        color: "#000",
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        textAlign: "left"
    },
    loanTypo: {
        fontSize: 18,
        textAlign: "left",
        color: "#000",
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        position: "absolute"
    },
    youTypo: {
        fontFamily: "Poppins-Medium",
        fontWeight: "500",
        fontSize: 14,
        color: "#000",
        position: "absolute"
    },
    dailyTypo: {
        opacity: 0.6,
        fontSize: 14,
        textAlign: "left",
        color: "#000",
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        position: "absolute"
    },
    monthlyTypo: {
        width: 173,
        top: 967,
        opacity: 0.6,
        fontSize: 14,
        textAlign: "left",
        color: "#000",
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        position: "absolute"
    },
    payTypo: {
        width: 128,
        lineHeight: 15,
        fontSize: 13,
        opacity: 0.6,
        fontFamily: "Poppins-Medium",
        fontWeight: "500",
        textAlign: "left",
        color: "#000",
        position: "absolute"
    },
    inputLayout: {
        width: 347,
        position: "absolute"
    },
    inputFieldPosition: {
        top: 0,
        left: 0
    },
    brieflyLayout: {
        width: 313,
        position: "absolute"
    },
    buttonFlexBox: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        position: "absolute"
    },
    transactionsPosition: {
        left: "50%",
        position: "absolute"
    },
    listboxPosition: {
        height: 289,
        width: 374,
        marginLeft: -186.5,
        left: "50%",
        position: "absolute"
    },
    iconLayout: {
        maxHeight: "100%",
        overflow: "hidden",
        position: "absolute",
        maxWidth: "100%"
    },
    textTypo: {
        fontFamily: "Montserrat-Regular",
        fontSize: 16,
        textAlign: "left",
        position: "absolute"
    },
    groupChildLayout: {
        height: 108,
        width: 413,
        top: 0,
        position: "absolute"
    },
    bottomBarLayout: {
        height: 34,
        left: 0
    },
    homePosition: {
        bottom: 0,
        position: "absolute"
    },
    applicationForLoan: {
        top: 117,
        left: 74,
        fontSize: 24,
        textAlign: "left",
        position: "absolute"
    },
    typeOfLoan: {
        top: 203,
        left: 25
    },
    desiredLoanAmount: {
        top: 334,
        left: 25
    },
    purposeOfLoan: {
        top: 437,
        left: 23
    },
    installmentPlan: {
        top: 635,
        left: 23
    },
    bySubmittingYou: {
        top: 1324,
        left: 36,
        textAlign: "justify",
        width: 317
    },
    chooseHowYou: {
        top: 667,
        width: 329,
        left: 23,
        textAlign: "left"
    },
    daily: {
        top: 842,
        width: 353,
        left: 37
    },
    biWeekly: {
        top: 843,
        width: 120,
        left: 214
    },
    monthly: {
        left: 37
    },
    seasonal: {
        left: 214
    },
    payASmall: {
        top: 865,
        width: 137,
        lineHeight: 15,
        fontSize: 13,
        opacity: 0.6,
        left: 37,
        fontFamily: "Poppins-Medium",
        fontWeight: "500",
        textAlign: "left",
        color: "#000",
        position: "absolute"
    },
    payOnceA: {
        top: 989,
        left: 37
    },
    payDuringHarvest: {
        top: 988,
        left: 214
    },
    payEvery2: {
        top: 864,
        left: 215
    },
    input: {
        borderColor: "#d9d9d9",
        height: 41,
        minWidth: 240,
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 8,
        alignSelf: "stretch",
        backgroundColor: "#fff"
    },
    inputField: {
        left: 0,
        width: 347,
        position: "absolute"
    },
    eg25000: {
        top: 8,
        left: 15,
        color: "#c0c0c0",
        fontFamily: "Poppins-Regular",
        width: 313,
        fontSize: 16,
        textAlign: "left"
    },
    inputFieldParent: {
        top: 370,
        height: 40,
        left: 23
    },
    brieflyExplainWhy: {
        color: "#c0c0c0",
        fontFamily: "Poppins-Regular",
        width: 313,
        fontSize: 16,
        textAlign: "left",
        left: 0,
        top: 0
    },
    brieflyExplainWhyYouNeedTWrapper: {
        top: 484,
        left: 40,
        height: 72
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "left",
        fontFamily: "Poppins-Bold",
        fontWeight: "700"
    },
    button: {
        top: 1248,
        left: 206,
        borderRadius: 33,
        backgroundColor: "#0088ff",
        width: 144,
        height: 45
    },
    buttonText1: {
        fontSize: 12,
        letterSpacing: 0.4,
        textAlign: "left"
    },
    button1: {
        top: 1249,
        left: 41,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderColor: "#000",
        borderWidth: 2,
        width: 135,
        height: 42,
        borderStyle: "solid",
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: "center",
        flexDirection: "row"
    },
    transactions: {
        marginLeft: -173.5,
        top: 472,
        borderColor: "#7e7e7e",
        height: 136,
        opacity: 0.3,
        borderWidth: 1,
        borderRadius: 8,
        left: "50%",
        borderStyle: "solid",
        width: 347
    },
    listboxbgShadowBox: {
        shadowOpacity: 1,
        elevation: 14,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
        height: "100%",
        left: "0%",
        bottom: "0%",
        right: "0%",
        top: "0%",
        borderRadius: 8,
        position: "absolute",
        backgroundColor: "#fff",
        width: "100%"
    },
    chevronIcon: {
        height: "8.33%",
        width: "3.56%",
        top: "46.67%",
        right: "7.87%",
        bottom: "45%",
        left: "88.57%",
        opacity: 0.8
    },
    selectMeasurement: {
        color: "#666",
        left: "0%",
        top: "0%",
        fontFamily: "Montserrat-Regular"
    },
    placeholderText: {
        height: "33.33%",
        width: "65.71%",
        top: "33.33%",
        right: "28.58%",
        bottom: "33.33%",
        left: "5.71%",
        position: "absolute"
    },
    listboxMain: {
        height: "20.76%",
        bottom: "69.55%",
        left: "4.55%",
        right: "4.55%",
        top: "9.69%",
        width: "90.91%",
        position: "absolute"
    },
    text: {
        top: 12,
        left: 16,
        color: "#333"
    },
    item1: {
        height: 44,
        overflow: "hidden",
        alignSelf: "stretch",
        backgroundColor: "#fff"
    },
    dropdownShadowBox: {
        opacity: 0,
        gap: 1,
        height: 1,
        top: 68,
        shadowOpacity: 1,
        elevation: 14,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
        left: "4.55%",
        right: "4.55%",
        width: "90.91%",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 8,
        position: "absolute"
    },
    clipList: {
        height: "90.31%",
        left: "0%",
        bottom: "0%",
        right: "0%",
        top: "9.69%",
        overflow: "hidden",
        position: "absolute",
        width: "100%"
    },
    listboxComponent: {
        top: 693
    },
    listboxComponent1: {
        top: 209
    },
    groupChild: {
        left: 0
    },
    iconLeftArrowChild: {
        height: "47.92%",
        width: "64.58%",
        top: "25%",
        right: "18.75%",
        bottom: "27.08%",
        left: "16.67%"
    },
    iconLeftArrow: {
        width: 24,
        height: 24
    },
    button2: {
        top: 64,
        borderRadius: 16,
        width: 85,
        height: 38,
        gap: 10,
        left: 25
    },
    frameParent: {
        left: -10
    },
    bottomBarNavigationvariant5: {
        marginLeft: -118.5,
        top: 745,
        width: 237,
        height: 64,
        display: "none"
    },
    homeIndicator: {
        borderRadius: 100,
        backgroundColor: "#000",
        marginLeft: -67,
        bottom: 0,
        height: 5,
        width: 134,
        left: "50%"
    },
    homeIndicatorWrapper: {
        marginLeft: -67,
        bottom: 0,
        height: 5,
        width: 134,
        left: "50%"
    },
    bottomBarInner: {
        marginLeft: -66.5,
        bottom: 8,
        height: 5,
        width: 134,
        left: "50%",
        position: "absolute"
    },
    homeindicator: {
        right: 0,
        height: 34,
        left: 0
    },
    bottomBar: {
        top: 818,
        width: 393,
        position: "absolute"
    },
    loanApplication: {
        flex: 1,
        maxWidth: "100%",
        backgroundColor: "#fff",
        width: "100%"
    }
});

export default LoanApplication;