import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";

export default function AngatScoreExplainerScreen() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
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

    if (!fontsLoaded) return null;

    const renderScoreRing = () => {
        const size = 200;
        const strokeWidth = 20;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const score = 88;
        const progress = Math.max(0, Math.min(100, score)) / 100;
        const dashOffset = circumference * (1 - progress);

        return (
            <View style={styles.scoreContainer}>
                <Svg width={size} height={size}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e0e0e0"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#ff2d55"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        fill="none"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>
                <View style={styles.scoreValueWrapper}>
                    <Text style={styles.scoreText}>88</Text>
                </View>
            </View>
        );
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
            <Text style={styles.title}>Your AngatScore</Text>

            {/* Score Ring */}
            {renderScoreRing()}

            {/* What is AngatScore Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>What is AngatScore?</Text>
                <View style={styles.whiteBgCard}>
                    <Text style={[styles.sectionText, {fontFamily: "Poppins-SemiBold", marginBottom: 5}]}>
                        This is your AgriAngat trust and sustainability score, calculated from your farming practices, loan repayment history, and marketplace activity. It serves as the basis for determining your eligibility for loans, better market opportunities, and exclusive support programs.
                    </Text>
                </View>
            </View>

            {/* Colors that speak Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Colors that speak.</Text>
                <Text style={[styles.sectionText, { fontFamily: "Poppins-SemiBold" }]}>
                    Your AngatScore ring changes with the market, climate, and season.
                </Text>

                {/* Color indicators */}
                <View style={styles.colorIndicators}>
                    {/* Red Ring */}
                    <View style={styles.colorItemContainer}>
                        <View style={styles.colorItem}>
                            <Image 
                                source={require('../assets/images/red-ring.png')} 
                                style={styles.colorRingImage} 
                                resizeMode="contain"
                            />
                            <View style={styles.colorContent}>
                                <Text style={styles.colorTitle}>Red Ring</Text>
                                <Text style={styles.colorDescription}>
                                    A clear warning that external factors could impact your ability to maintain your usual farming rhythm. Potential drought forecasts, or sudden market downturns. In this period, we advise holding off on large loans, prioritizing savings, and focusing on "risk-reducing farming practices."
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Orange Ring */}
                    <View style={styles.colorItemContainer}>
                        <View style={styles.colorItem}>
                            <Image 
                                source={require("../assets/images/yellow-ring.png")} 
                                style={styles.colorRingImage} 
                                resizeMode="contain"
                            />
                            <View style={styles.colorContent}>
                                <Text style={styles.colorTitle}>Orange Ring</Text>
                                <Text style={styles.colorDescription}>
                                    A signal to stay alert. Weather patterns, market demands, or your AngatScore show signs of possible changes ahead. Loans are still available, but it's wise to borrow cautiously. Use the app's advisory upgrades, and monitor updates closely from the app's advisory tips.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Green Ring */}
                    <View style={styles.colorItemContainer}>
                        <View style={styles.colorItem}>
                            <Image 
                                source={require('../assets/images/green-ring.png')} 
                                style={styles.colorRingImage} 
                                resizeMode="contain"
                            />
                            <View style={styles.colorContent}>
                                <Text style={styles.colorTitle}>Green Ring</Text>
                                <Text style={styles.colorDescription}>
                                    A signal that conditions are favorable for both farming and borrowing. Weather forecasts are strong, and your AngatScore is healthy. This is the perfect time to expand, take on larger orders from the marketplace.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
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
        paddingBottom: 10,
    },
    whiteBgCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 13,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        fontFamily: "Poppins-Bold",
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins-ExtraBold",
        color: "#111",
        textAlign: "center",
        marginBottom: 40,
    },
    scoreContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
    },
    scoreValueWrapper: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        fontSize: 48,
        fontFamily: "Poppins-ExtraBold",
        color: "#111",
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: "Poppins-ExtraBold",
        color: "#111",
        marginBottom: 12,
    },
    sectionText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#666",
        lineHeight: 20,
        marginBottom: 20,
    },
    colorIndicators: {
        gap: 20,
    },
    colorItemContainer: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
    },
    colorItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 15,
    },
    colorRingImage: {
        width: 60,
        height: 60,
        marginTop: 2,
    },
    colorContent: {
        flex: 1,
    },
    colorTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: "#111",
        marginBottom: 4,
    },
    colorDescription: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#666",
        lineHeight: 18,
    },
});
