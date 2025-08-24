import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import agriangatLogo from "../assets/images/agriangat-logo-b&w.png";
import onboarding from "../assets/images/onboarding.png";
import page1 from "../assets/images/onboarding-page1.png";
import page2 from "../assets/images/onboarding-page2.png";
import page3 from "../assets/images/onboarding-page3.png";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const router = useRouter();
  
  // Animated values for button fade effects
  const continueButtonOpacity = useRef(new Animated.Value(1)).current;
  const scoreButtonOpacity = useRef(new Animated.Value(1)).current;
  const chatButtonOpacity = useRef(new Animated.Value(1)).current;
  const marketplaceButtonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  const onboardingData = [
    {
      id: 1,
      title: "Welcome to",
      image: onboarding,
      buttonText: "Continue",
      backgroundColor: "#000",
      showFarmer: true,
    },
    {
      id: 2,
      title: "AngatScore",
      description: "Dito mo makikita kung gaano ka kahanda para sa loan. Ginagamit ng AngatScore ang paraan ng iyong pagsasaka at pamumuhay para ipakita sa bangko na karapat-dapat kang pagkatiwalaan.",
      image: page1,
      buttonText: "Next",
      backgroundColor: "#000",
      showScoreInterface: true,
    },
    {
      id: 3,
      title: "KaAgri + AgriRescue AI",
      description: "Makakausap mo si KaAgri para sa tips at kasagutan tungkol sa iyong mga pananim. At kapag may paparating na bagyo o tagtuyot, may abiso kang matatangap para maprotektahan ang ani at kabuhayan mo.",
      image: page2,
      buttonText: "Next", 
      backgroundColor: "#000",
      showChatInterface: true,
    },
    {
      id: 4,
      title: "Marketplace",
      description: "Dito, puwede mong ibenta ang ani sa mga kalapit na tindahan at buyers. Dagdag kita, dagdag tiwala, dagdag oportunidad.",
      image: page3,
      buttonText: "Log In / Sign In",
      backgroundColor: "#000",
      showMarketplace: true,
      isLastScreen: true,
    }
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(index);
  };

  // Fade animation function
  const animateButtonPress = (buttonOpacity, callback) => {
    Animated.sequence([
      Animated.timing(buttonOpacity, {
        toValue: 0.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    const buttonOpacity = currentIndex === 0 ? continueButtonOpacity 
                        : currentIndex === 1 ? scoreButtonOpacity
                        : currentIndex === 2 ? chatButtonOpacity
                        : marketplaceButtonOpacity;

    animateButtonPress(buttonOpacity, () => {
      if (nextIndex < onboardingData.length) {
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      } else {
        router.push("login");
      }
    });
  };

  const handleSkip = () => {
    router.push("login");
  };

  const renderScreen = (item, index) => {
    return (
      <View key={item.id} style={[styles.screen, { backgroundColor: item.backgroundColor }]}>
        <StatusBar style="light" />
        
        {/* Fading Black Gradient Overlay at Top */}
        <LinearGradient
          colors={['#000', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'transparent']}
          style={styles.topFadeGradient}
          pointerEvents="none"
        />

        {/* Content */}
        <View style={styles.content}>
          
          {/* Welcome Screen - Show farmer image */}
          {item.showFarmer && (
            <View style={styles.welcomeContainer}>
              <View style={styles.farmerImageContainer}>
                <Image 
                  source={onboarding} 
                  style={styles.farmerImage}
                  resizeMode="cover"
                />
                <View style={styles.welcomeTextOverlay}>
                  <Image source={agriangatLogo} style={styles.logoSmall} />
                  <Text style={styles.welcomeTitle}>{item.title}</Text>
                  <Text style={styles.welcomeSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            </View>
          )}

          {/* AngatScore Screen - Custom Layout */}
          {item.showScoreInterface && (
            <View style={styles.scoreContainer}>
title              {/* Text Content - Top Left */}
              <View style={styles.scoreTopContent}>
                <Text style={styles.scoreTitle}>{item.title}</Text>
                <Text style={styles.scoreDescription}>{item.description}</Text>
              </View>
              
              {/* Image Container - Below Text */}
              <View style={styles.scoreImageContainer}>
                <Image 
                  source={page1} 
                  style={styles.scoreImage}
                  resizeMode="contain"
                />
              </View>
              
              {/* Custom Bottom Section for Score Page */}
              <View style={styles.scoreBottomSection}>
                {/* Page Indicators - Left Side */}
                <View style={styles.scoreIndicators}>
                  {onboardingData.slice(1).map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.scoreIndicator,
                        {
                          backgroundColor: dotIndex === (index - 1) ? '#fff' : 'rgba(255,255,255,0.3)',
                        }
                      ]}
                    />
                  ))}
                </View>
                
                {/* Next Button - Right Side */}
                <Animated.View style={{ opacity: scoreButtonOpacity }}>
                  <TouchableOpacity style={styles.scoreNextButton} onPress={handleNext}>
                    <Text style={styles.scoreNextText}>Next</Text>
                    <Text style={styles.scoreArrow}>→</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          )}

                    {/* Chat Screen - Show page2 image */}
          {item.showChatInterface && (
            <View style={styles.chatContainer}>
              <View style={styles.chatTopContent}>
                <Text style={styles.kaagriTitle}>{item.title}</Text>
                <Text style={styles.kaagriDescription}>{item.description}</Text>
              </View>
              <View style={styles.chatImageContainer}>
                <Image 
                  source={page2} 
                  style={styles.chatImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.chatBottomSection}>
                <View style={styles.chatIndicators}>
                  {onboardingData.slice(1).map((_, dotIndex) => (
                    <View
                      key={`chat-${dotIndex}`}
                      style={[
                        styles.chatIndicator,
                        {
                          backgroundColor: dotIndex === (index - 1) ? '#fff' : 'rgba(255,255,255,0.3)',
                        }
                      ]}
                    />
                  ))}
                </View>
                <Animated.View style={{ opacity: chatButtonOpacity }}>
                  <TouchableOpacity style={styles.chatNextButton} onPress={handleNext}>
                    <Text style={styles.chatNextText}>{item.buttonText}</Text>
                    <Text style={styles.chatArrow}>→</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          )}

          {/* Marketplace Screen - Custom Layout */}
          {item.showMarketplace && (
            <View style={styles.marketplaceContainer}>
              {/* Text Content - Top Left */}
              <View style={styles.marketplaceTopContent}>
                <Text style={styles.marketplaceTitle}>{item.title}</Text>
                <Text style={styles.marketplaceDescription}>{item.description}</Text>
              </View>
              
              {/* Image Container - Below Text */}
              <View style={styles.marketplaceImageContainer}>
                <Image 
                  source={page3} 
                  style={styles.marketplaceImage}
                  resizeMode="contain"
                />
              </View>
              
              {/* Custom Bottom Section for Marketplace Page */}
              <View style={styles.marketplaceBottomSection}>
                {/* Page Indicators - Left Side */}
                <View style={styles.marketplaceIndicators}>
                  {onboardingData.slice(1).map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.marketplaceIndicator,
                        {
                          backgroundColor: dotIndex === (index - 1) ? '#fff' : 'rgba(255,255,255,0.3)',
                        }
                      ]}
                    />
                  ))}
                </View>
                
                {/* Log In Button - Right Side */}
                <Animated.View style={{ opacity: marketplaceButtonOpacity }}>
                  <TouchableOpacity style={styles.marketplaceNextButton} onPress={handleNext}>
                    <Text style={styles.marketplaceNextText}>Log In / Sign In</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          )}

        </View>

        {/* Description for Welcome Screen */}
        {item.showFarmer && (
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}

        {/* Bottom Section - Hide for AngatScore, Chat, and Marketplace pages */}
        {!item.showScoreInterface && !item.showChatInterface && !item.showMarketplace && (
          <View style={styles.bottomSection}>
            {/* Page Indicators - Hide on first page */}
            {index > 0 && (
              <View style={styles.indicators}>
                {onboardingData.slice(1).map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.indicator,
                      {
                        backgroundColor: dotIndex === (index - 1) ? '#fff' : 'rgba(255,255,255,0.3)',
                        width: dotIndex === (index - 1) ? 24 : 8,
                      }
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Continue/Next Button */}
            <Animated.View style={{ opacity: continueButtonOpacity }}>
              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueText}>{item.buttonText}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Fading Black Gradient Overlay at Bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', '#000']}
          style={styles.bottomFadeGradient}
          pointerEvents="none"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => renderScreen(item, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  screen: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Welcome Screen Styles
  welcomeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  farmerImageContainer: {
    width: 1000,
    height: 950,
    marginBottom: -170,
    marginLeft: 380,
    position: 'relative',
  },
  farmerImage: {
    width: '100%',
    height: '100%',
  },
  welcomeTextOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 300,
    right: 0,
    top: 70,
    alignItems: 'flex-start',
  },
  logoSmall: {
    width: 230,
    height: 45,
    marginBottom: -68,
    marginTop: 550,
    marginLeft: -100,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 30,
    marginLeft: -40,
  },
  welcomeSubtitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Poppins-ExtraBold',
  },
  
  // Common Styles
  title: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'center',
    marginBottom: 80,
    zIndex: 3,
  },
  kaagriDescription: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    lineHeight: 20,
    paddingRight: 20,
    marginBottom: 10,
    zIndex: 3,
  },
  kaagriTitle: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'left',
    marginBottom: 15,
    zIndex: 3,
  },

  // Phone Container Styles
  phoneContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  phone: {
    width: 250,
    height: 450,
    backgroundColor: '#000',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#333',
  },
  phoneHeader: {
    height: 44,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  signal: {
    width: 18,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  wifi: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  battery: {
    width: 24,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  phoneContent: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Score Screen Styles
  scoreContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  scoreTopContent: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  scoreTitle: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'left',
    marginBottom: 15,
    marginTop: -80,
    zIndex: 3,
  },
  scoreDescription: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    lineHeight: 24,
    paddingRight: 40,
    zIndex: 3,
  },
  scoreImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 0,
  },
  scoreImage: {
    width: '110%',
    height: '400%',
    marginTop: 350,
  },
  scoreBottomSection: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  scoreIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreIndicator: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  scoreNextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreNextText: {
    color: '#333',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  scoreArrow: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  scoreTextContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    zIndex: 3,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  scoreOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scoreText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  scoreNumber: {
    fontSize: 42,
    fontFamily: 'Poppins-ExtraBold',
    color: '#4CAF50',
  },
  scoreSubtext: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'center',
  },

  // Chat Screen Styles
  chatContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  chatTopContent: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  chatTitle: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'left',
    marginBottom: 15,
    zIndex: 3,
  },
  chatDescription: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    lineHeight: 24,
    paddingRight: 40,
    zIndex: 3,
  },
  chatImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 180,
    zIndex: 0,
  },
  chatImage: {
    width: '110%',
    height: '400%',
    marginTop: 350,
  },
  chatBottomSection: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  chatIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatIndicator: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  chatNextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatNextText: {
    color: '#333',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  chatArrow: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  chatSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  chatMessages: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  messageContainer: {
    marginBottom: 15,
  },
  messageBubble: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },

  // Marketplace Screen Styles
  marketplaceContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  marketplaceTopContent: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  marketplaceTitle: {
    color: '#fff',
    fontSize: 46,
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'left',
    marginBottom: 15,
    marginTop: -70,
    zIndex: 3,
  },
  marketplaceDescription: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    lineHeight: 24,
    paddingRight: 40,
    zIndex: 3,
  },
  marketplaceImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 0,
  },
  marketplaceImage: {
    width: '110%',
    height: '400%',
    marginTop: 350,
  },
  marketplaceBottomSection: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  marketplaceIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marketplaceIndicator: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  marketplaceStartButton: {
    backgroundColor: '#21AA3A',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marketplaceNextButton: {
    backgroundColor: '#21AA3A',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marketplaceNextText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  marketplaceStartText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  marketplaceArrow: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  marketplaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  marketplaceHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-ExtraBold',
    color: '#333',
  },
  promoCard: {
    backgroundColor: '#E0FFE0',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    flex: 1,
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  categories: {
    padding: 15,
  },
  categoriesTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-ExtraBold',
    color: '#333',
    marginBottom: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: 45,
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },

  // Bottom Section Styles
  bottomSection: {
    alignItems: 'center',
    paddingTop: 20,
    zIndex: 2,
  },
  topFadeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  bottomFadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    zIndex: 1,
  },
  indicators: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
    zIndex: 3,
  },
  continueText: {
    color: '#333',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    zIndex: 3,
  },
});

export default OnboardingScreen;
