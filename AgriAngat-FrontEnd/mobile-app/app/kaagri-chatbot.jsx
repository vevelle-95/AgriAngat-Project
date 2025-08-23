import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function KaAgriChatbotScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
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

  const quickQuestions = [
    "What's the best time to plant rice?",
    "How to control pests naturally?",
    "When should I harvest corn?",
    "Best fertilizer for vegetables?",
    "How to improve soil quality?",
    "Weather impact on crops?"
  ];

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
      return "For rice planting, the best time is during the wet season (June-July). Make sure your field is well-prepared with proper leveling and adequate water supply. Plant seedlings 20-25cm apart for optimal growth.";
    } else if (lowerMessage.includes("pest") || lowerMessage.includes("control")) {
      return "Natural pest control methods include: 1) Neem oil spray, 2) Companion planting with marigolds, 3) Beneficial insects like ladybugs, 4) Crop rotation. These methods are safer for both crops and environment.";
    } else if (lowerMessage.includes("harvest") || lowerMessage.includes("corn")) {
      return "Corn is ready for harvest when kernels are plump and milky. This usually occurs 60-100 days after planting, depending on the variety. Look for brown silks and firm kernels when pressed.";
    } else if (lowerMessage.includes("fertilizer") || lowerMessage.includes("vegetables")) {
      return "For vegetables, use a balanced NPK fertilizer (10-10-10) during planting, then switch to nitrogen-rich fertilizer during growth phase. Organic options include compost, chicken manure, and fish emulsion.";
    } else if (lowerMessage.includes("soil") || lowerMessage.includes("quality")) {
      return "Improve soil quality by: 1) Adding organic matter like compost, 2) Testing pH levels (6.0-7.0 is ideal), 3) Proper drainage, 4) Crop rotation, 5) Cover cropping during off-season.";
    } else if (lowerMessage.includes("weather") || lowerMessage.includes("climate")) {
      return "Weather greatly affects crops. Monitor rainfall, temperature, and humidity. Use weather forecasts to plan irrigation, pest control, and harvest timing. Consider climate-resilient varieties for your area.";
    } else {
      return "That's a great question! I'd be happy to help you with farming advice. Could you provide more specific details about your crop, location, or the particular challenge you're facing?";
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.studyHubTitle}>Study Hub</Text>
          <View style={styles.kaagriTab}>
            <View style={styles.kaagriTabActive}>
              <Text style={styles.kaagriTextActive}>KaAgri</Text>
            </View>
            <TouchableOpacity
              style={styles.videosTab}
              onPress={() => router.push("/study-hub-videos")}
            >
              <Text style={styles.videosText}>Videos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
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
  headerRight: {
    alignItems: "center",
    flex: 1,
  },
  studyHubTitle: {
    fontSize: 24,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    marginBottom: 8,
  },
  kaagriTab: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 2,
  },
  kaagriTabActive: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#007AFF",
  },
  kaagriTextActive: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  videosTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  videosText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#666",
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
  },
  botMessageContainer: {
    justifyContent: "flex-start",
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
