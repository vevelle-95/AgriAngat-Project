import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function StudyHubScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 Ako si KaAgri, ang inyong AgriAngat AI assistant.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      text: "Pwede mo akong tanungin tungkol sa tanim, panahon, o loan tips para sa inyong sakahan.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 3,
      text: "Mataas pa ba interest kapag umutang ngayon?",
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 4,
      text: "Sa ngayon, normal pa ang loan rates. Pero may forecast na 2 bagyo sa susunod na buwan, kaya mainam mag-loan bago pumasok ang mas matinding ulan.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
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

  // Chat functions
  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const newBotMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newBotMessage]);
    }, 1000);
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("rice") || lowerMessage.includes("planting")) {
      return "For rice planting, the best time is during the wet season (June-July). Make sure your field is well-prepared with proper leveling and adequate water supply.";
    } else if (lowerMessage.includes("pest") || lowerMessage.includes("control")) {
      return "Natural pest control methods include: 1) Neem oil spray, 2) Companion planting with marigolds, 3) Beneficial insects like ladybugs, 4) Crop rotation.";
    } else {
      return "That's a great question! I'd be happy to help you with farming advice. Could you provide more specific details about your crop, location, or the particular challenge you're facing?";
    }
  };

  const renderMessage = (msg) => (
    <View key={msg.id} style={[
      styles.messageContainer,
      msg.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      {msg.sender === "bot" && (
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>🤖</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        msg.sender === "user" ? styles.userMessage : styles.botMessage
      ]}>
        <Text style={[
          styles.messageText,
          msg.sender === "user" ? styles.userMessageText : styles.botMessageText
        ]}>
          {msg.text}
        </Text>
        <Text style={[
          styles.messageTime,
          msg.sender === "user" ? styles.userMessageTime : styles.botMessageTime
        ]}>
          {msg.timestamp}
        </Text>
      </View>
    </View>
  );

  const renderVideosTab = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      {/* Meet KaAgri Section */}
      <View style={styles.meetKaagriSection}>
        <Text style={styles.meetKaagriDescription}>Your AgriAngat AI assistant is here!</Text>
        <Text style={styles.meetKaagriTitle}>Meet KaAgri!</Text>
        <Text style={styles.meetKaagriDescription}>
          Got questions about your crops, the weather, or about your soil? KaAgri is here to guide you with answers, tips, and timely advice — anytime you need it. 🌱
        </Text>
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => setActiveTab("kaagri")}
        >
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* New Videos Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: 24, marginTop: 16, marginBottom: 15 }]}>New Videos</Text>
        <View style={styles.videoGrid}>
          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Image source={require("../assets/images/rice-terraces.png")} style={styles.thumbnailImage} />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>5:00</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>How to Prepare Your Soil for the Rainy Season</Text>
            <TouchableOpacity style={styles.playNowButton}>
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Image source={require("../assets/images/vegetables.png")} style={styles.thumbnailImage} />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>3:30</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>Best Crops to Plant in August to December</Text>
            <TouchableOpacity style={styles.playNowButton}>
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Image source={require("../assets/images/baskets.png")} style={styles.thumbnailImage} />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>8:50</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>Smart Water Management for Rice Fields</Text>
            <TouchableOpacity style={styles.playNowButton}>
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Image source={require("../assets/images/fruits.png")} style={styles.thumbnailImage} />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>8:50</Text>
              </View>
            </View>
            <Text style={styles.videoTitle}>Managing Pests in Fruit Trees</Text>
            <TouchableOpacity style={styles.playNowButton}>
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={[styles.aboutTitle, { fontSize: 24, fontFamily: "Poppins-ExtraBold", marginTop: 16, marginBottom: 5 }]}>About</Text>
        <Text style={styles.aboutDescription}>
          Home to the AgriAngat AI Assistant and a growing library of videos on crop care, sustainable farming, and market readiness.        </Text>
        <Text style={styles.aboutDescription}>
          In collaboration with trusted experts and organizations like the DENR, Study Hub brings you tips, seasonal guides, and practical techniques to help you farm smarter. 
        </Text>
        <Text style={styles.aboutDescription}>
          Access fresh learning anytime, and revisit timeless lessons to keep your fields — and your future — thriving all year.
        </Text>
      </View>
    </ScrollView>
  );

  const renderKaAgriTab = () => (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📁</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask Anything"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, message.trim() === "" && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={message.trim() === ""}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image 
              source={require('../assets/images/study-hub.png')} 
              style={styles.studyHubIcon}
              resizeMode="contain"
            />
            <Text style={styles.studyHubTitle}>Study Hub</Text>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "kaagri" && styles.tabButtonActive]}
            onPress={() => setActiveTab("kaagri")}
          >
            <Text style={[styles.tabText, activeTab === "kaagri" && styles.tabTextActive]}>KaAgri</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "videos" && styles.tabButtonActive]}
            onPress={() => setActiveTab("videos")}
          >
            <Text style={[styles.tabText, activeTab === "videos" && styles.tabTextActive]}>Videos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === "videos" ? renderVideosTab() : renderKaAgriTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  studyHubIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  studyHubTitle: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 2,
    marginTop: -15,
    marginBottom: 20,

    alignSelf: "flex-end",
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  meetKaagriSection: {
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  meetKaagriTitle: {
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 12,
    marginTop: -15
  },
  meetKaagriDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  learnMoreButton: {
    backgroundColor: "#111",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "flex-start",
  },
  learnMoreText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 10,
  },
  videoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  videoCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
  },
  videoThumbnail: {
    height: 120,
    position: "relative",
    backgroundColor: "#e0e0e0",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 2,
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#111",
    padding: 12,
    paddingBottom: 8,
    lineHeight: 18,
  },
  playNowButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  playNowText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  aboutSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 15,
  },
  aboutDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  // Chat styles
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
    marginLeft: 60,
  },
  botMessageContainer: {
    justifyContent: "flex-start",
    marginRight: 60,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  botAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  botMessageTime: {
    color: "#999",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  inputActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 18,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f9f9f9",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
