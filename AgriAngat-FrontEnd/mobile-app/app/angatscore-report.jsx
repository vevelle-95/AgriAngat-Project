import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Circle } from "react-native-svg";
// @ts-ignore
import agriangatLogo from "../assets/images/agriangat-nobg-logo.png";

const { width: screenWidth } = Dimensions.get('window');

export default function AngatScoreReport() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  // Sample data - replace with actual user data
  const scoreData = {
    currentScore: 88,
    previousScore: 75,
    scoreChange: "+13",
    creditLimit: "₱75,000",
    riskLevel: "Low",
    lastUpdated: "September 24, 2025"
  };

  const scoreFactors = [
    {
      category: "Payment History",
      score: 95,
      impact: "Excellent",
      description: "Consistent on-time loan payments",
      color: "#4CAF50",
      icon: "✓"
    },
    {
      category: "Farm Productivity",
      score: 85,
      impact: "Good",
      description: "Strong crop yields and sustainable practices",
      color: "#66BB6A",
      icon: "🌾"
    },
    {
      category: "Financial Stability",
      score: 78,
      impact: "Good",
      description: "Stable income with manageable expenses",
      color: "#81C784",
      icon: "💰"
    },
    {
      category: "Community Standing",
      score: 92,
      impact: "Excellent",
      description: "Active in cooperatives and local farming groups",
      color: "#4CAF50",
      icon: "👥"
    },
    {
      category: "Technology Adoption",
      score: 68,
      impact: "Fair",
      description: "Limited use of modern farming technologies",
      color: "#FFA726",
      icon: "📱"
    }
  ];

  const recommendations = [
    {
      title: "Adopt Smart Farming Tools",
      description: "Use weather monitoring apps and soil testing to improve yields",
      impact: "+5 to +8 points",
      timeframe: "2-3 months"
    },
    {
      title: "Diversify Crop Portfolio",
      description: "Plant complementary crops to reduce seasonal income variation",
      impact: "+3 to +5 points",
      timeframe: "Next planting season"
    },
    {
      title: "Join Farmer Training Programs",
      description: "Participate in agricultural extension services",
      impact: "+2 to +4 points",
      timeframe: "1-2 months"
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

  const renderCircularProgress = (score, size = 120) => {
    const strokeWidth = 12;
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
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AngatScore Report</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Score Card */}
        <View style={styles.mainScoreCard}>
          <LinearGradient
            colors={['#939393ff', '#bbbbbbff']}
            style={styles.scoreCardGradient}
          >
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreCardTitle}>Your AngatScore</Text>
            </View>
            
            <View style={styles.scoreContent}>
              {renderCircularProgress(scoreData.currentScore, 140)}
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreChange}>{scoreData.scoreChange} points</Text>
                <Text style={styles.scoreSubtext}>from last assessment</Text>
                <Text style={styles.lastUpdated}>Updated {scoreData.lastUpdated}</Text>
              </View>
            </View>

            <View style={styles.scoreMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Credit Limit</Text>
                <Text style={styles.metricValue}>{scoreData.creditLimit}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Risk Level</Text>
                <Text style={styles.metricValue}>{scoreData.riskLevel}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Score Factors Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          <Text style={styles.sectionSubtitle}>
            Factors affecting your AngatScore
          </Text>
          
          {scoreFactors.map((factor, index) => (
            <View key={index} style={styles.factorCard}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIcon}>
                  <Text style={styles.factorIconText}>{factor.icon}</Text>
                </View>
                <View style={styles.factorInfo}>
                  <Text style={styles.factorCategory}>{factor.category}</Text>
                  <Text style={styles.factorDescription}>{factor.description}</Text>
                </View>
                <View style={styles.factorScore}>
                  <Text style={[styles.factorScoreText, { color: factor.color }]}>
                    {factor.score}
                  </Text>
                  <Text style={styles.factorImpact}>{factor.impact}</Text>
                </View>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${factor.score}%`, backgroundColor: factor.color }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Improvement Recommendations</Text>
          <Text style={styles.sectionSubtitle}>
            Actions to boost your AngatScore
          </Text>
          
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <Text style={styles.recommendationImpact}>{rec.impact}</Text>
              </View>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
              <Text style={styles.recommendationTimeframe}>
                Estimated timeframe: {rec.timeframe}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push("/increase-angatscore-steps")}
          >
            <Text style={styles.primaryButtonText}>Start Improving</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 83,
    alignSelf: "flex-start",
  },
  backButtonText: {
        fontSize: 18,
        marginRight: 6,
        color: "#333",
    },
    backText: {
        fontSize: 14,
        color: "#333",
        fontFamily: "Poppins-Bold",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
  },
  headerSpacer: {
    width: 100,
  },
  scrollContainer: {
    flex: 1,
  },
  mainScoreCard: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreCardGradient: {
    padding: 25,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 6,
  },
  scoreCardTitle: {
    fontSize: 25,
    fontFamily: "Poppins-Bold",
    marginLeft: 40,
    color: "#fff",
  },
  scoreContent: {
    alignItems: "center",
    marginBottom: 25,
  },
  circularProgress: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  circularProgressText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 36,
    fontFamily: "Poppins-ExtraBold",
    color: "#fff",
  },
  scoreDetails: {
    alignItems: "center",
  },
  scoreChange: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  scoreSubtext: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "rgba(255,255,255,0.7)",
  },
  scoreMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 20,
  },
  factorCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  factorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  factorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  factorIconText: {
    fontSize: 18,
  },
  factorInfo: {
    flex: 1,
  },
  factorCategory: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 2,
  },
  factorDescription: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  factorScore: {
    alignItems: "flex-end",
  },
  factorScoreText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  factorImpact: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    flex: 1,
    marginRight: 10,
  },
  recommendationImpact: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#4CAF50",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  recommendationTimeframe: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#888",
    fontStyle: "italic",
  },
  actionButtons: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#4CAF50",
  },
});