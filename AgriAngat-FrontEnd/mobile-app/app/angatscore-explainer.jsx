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
                <Text style={[styles.sectionText, { backgroundColor: "d0d0d0" }]}>
                    This is your AgriAngat trust and sustainability score, calculated from your farming practices, loan repayment history, and health and marketplace activity. It serves as the basis for determining your eligibility for better market opportunities, and exclusive support programs.
                </Text>
            </View>

            {/* Colors that speak Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Colors that speak.</Text>
                <Text style={styles.sectionText}>
                    Your AngatScore changes with the season, market, and climate.
                </Text>

                {/* Color indicators */}
                <View style={styles.colorIndicators}>
                    {/* Red Ring */}
                    <View style={styles.colorItem}>
                        <View style={styles.colorRing}>
                            <View style={[styles.colorCircle, { backgroundColor: '#ff2d55' }]} />
                        </View>
                        <View style={styles.colorContent}>
                            <Text style={styles.colorTitle}>Red Ring</Text>
                            <Text style={styles.colorDescription}>
                                A clear warning that external factors may negatively impact your AngatScore forecasts. Possible reasons: market slowdowns, climate challenges, or large loans, performing savings, and focusing on risk management.
                            </Text>
                        </View>
                    </View>

                    {/* Orange Ring */}
                    <View style={styles.colorItem}>
                        <View style={styles.colorRing}>
                            <View style={[styles.colorCircle, { backgroundColor: '#FF9500' }]} />
                        </View>
                        <View style={styles.colorContent}>
                            <Text style={styles.colorTitle}>Orange Ring</Text>
                            <Text style={styles.colorDescription}>
                                A signal that conditions are stable, market prices are strong, and your loan repayment is on track. Continue your farming operations, invest in better tools, or take on larger orders from the marketplace.
                            </Text>
                        </View>
                    </View>

                    {/* Green Ring */}
                    <View style={styles.colorItem}>
                        <View style={styles.colorRing}>
                            <View style={[styles.colorCircle, { backgroundColor: '#34C759' }]} />
                        </View>
                        <View style={styles.colorContent}>
                            <Text style={styles.colorTitle}>Green Ring</Text>
                            <Text style={styles.colorDescription}>
                                Excellent conditions for growth and expansion. Your score is high, market outlook is positive, and all systems are performing optimally.
                            </Text>
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
        paddingBottom: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
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
        fontFamily: "Poppins-Regular",
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
    colorItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 15,
    },
    colorRing: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#e0e0e0",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },
    colorCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
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
        lineHeight: 16,
    },
});
