/* Kaagri-chatbot.jsx */
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

// KaAgri API Configuration
const API_BASE_URL = 'http://192.168.50.114:5001/api';

export default function KaAgriChatbotScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const scrollViewRef = useRef(null);
  const router = useRouter();

  // API Service Functions
  const initializeChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.history);
        setEnvironmentalData(data.environmental_data);
        console.log('✅ Chat initialized with KaAgri API');
      } else {
        throw new Error(data.error || 'Failed to initialize chat');
      }
    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
      // Fallback to welcome message if API fails
      setMessages([{
        id: 1,
        text: "Hi! 👋 Ako si KaAgri, ang inyong AgriAngat AI assistant.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      Alert.alert(
        'Connection Error', 
        'Unable to connect to KaAgri AI. Using offline mode.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessageToAPI = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update messages with both user and bot messages
        setMessages(prev => [...prev, data.user_message, data.bot_response]);
        setEnvironmentalData(data.environmental_data);
        console.log('✅ Message sent to KaAgri API');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Add user message even if API fails
      const userMsg = {
        id: messages.length + 1,
        text: userMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Generate fallback response
      const fallbackResponse = {
        id: messages.length + 2,
        text: "Pasensya na, may problema sa connection sa KaAgri AI. Subukan ninyo ulit mamaya.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, userMsg, fallbackResponse]);
      
      Alert.alert(
        'Connection Error',
        'Unable to reach KaAgri AI. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    }
  };

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

  useEffect(() => {
    // Initialize chat when fonts are loaded
    if (fontsLoaded) {
      initializeChat();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (!fontsLoaded) return null;

  const quickQuestions = [
    "What's the best time to plant rice?",
    "How to control pests naturally?",
    "When should I harvest corn?",
    "Best fertilizer for vegetables?",
    "How to improve soil quality?",
    "Weather impact on crops?"
  ];

  const handleSendMessage = async () => {
    if (message.trim() === "" || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      await sendMessageToAPI(userMessage);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    if (isLoading) return;
    
    setMessage(question);
    setIsLoading(true);
    
    try {
      await sendMessageToAPI(question);
    } catch (error) {
      console.error('Error in handleQuickQuestion:', error);
    } finally {
      setIsLoading(false);
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

  // Show loading spinner while initializing
  if (!fontsLoaded || isInitializing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          {!fontsLoaded ? "Loading fonts..." : "Connecting to KaAgri AI..."}
        </Text>
      </View>
    );
  }

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

      {/* Environmental Data Status */}
      {environmentalData && (
        <View style={styles.environmentalStatus}>
          <Text style={styles.environmentalText}>
            🌍 Current conditions: {environmentalData.location} - {
              environmentalData.weather ? 
              `${environmentalData.weather.temperature_c}°C, ${environmentalData.weather.humidity_pct}% humidity` : 
              'Environmental data loading...'
            }
          </Text>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingMessage}>
            <View style={styles.botAvatar}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
            <View style={styles.botMessage}>
              <Text style={styles.botMessageText}>KaAgri is thinking...</Text>
            </View>
          </View>
        )}
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
            style={[
              styles.sendButton, 
              (message.trim() === "" || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={message.trim() === "" || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>➤</Text>
            )}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  environmentalStatus: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  environmentalText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#007AFF",
    textAlign: "center",
  },
  loadingMessage: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
    justifyContent: "flex-start",
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
