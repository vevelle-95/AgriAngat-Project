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
        const size = 170;
        const strokeWidth = 18;
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
                        stroke="#111"
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
                    Your AngatScore ring changes with the season, market, and climate.
                </Text>

                {/* Color indicators */}
                <View style={styles.colorIndicators}>
                    {/* Red Ring */}
                    <View style={styles.colorItem}>
                        <View style={[styles.colorDot, { backgroundColor: '#ff2d55' }]} />
                        <Text style={styles.colorDescription}>
                            A clear warning that external factors could impact your ability to repay loans - such as typhoon damage, market downturns. In this period, we may recommend protective savings, and focusing on risk-reducing farming practices.
                        </Text>
                    </View>

                    {/* Orange Ring */}
                    <View style={styles.colorItem}>
                        <View style={[styles.colorDot, { backgroundColor: '#ff9500' }]} />
                        <Text style={styles.colorDescription}>
                            A reminder to stay alert. Weather patterns, market demand, or local changes that might impact your loan will be monitored. Watch updates closely from the app's advisory tips.
                        </Text>
                    </View>

                    {/* Green Ring */}
                    <View style={styles.colorItem}>
                        <View style={[styles.colorDot, { backgroundColor: '#34c759' }]} />
                        <Text style={styles.colorDescription}>
                            A signal that conditions are favorable for both farming and borrowing. Weather is good, market prices are strong, and your farm shows solid results. Keep maintaining best practices, invest in better tools, or consider growing your market reach.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        marginRight: 8,
        color: '#111',
    },
    backText: {
        fontSize: 16,
        color: '#111',
        fontFamily: 'Poppins-Regular',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#111',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    scoreValueWrapper: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    scoreText: {
        fontSize: 40,
        fontFamily: 'Poppins-ExtraBold',
        color: '#111',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#111',
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
    },
    colorIndicators: {
        gap: 20,
    },
    colorItem: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'flex-start',
    },
    colorDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginTop: 4,
    },
    colorDescription: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        lineHeight: 20,
    },
});
