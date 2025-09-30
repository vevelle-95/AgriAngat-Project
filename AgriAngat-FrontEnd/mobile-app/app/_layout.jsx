import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";

import * as Notifications from "expo-notifications";

// Screen configurations
const screenConfigs = [
  { name: "index", options: { headerShown: false } },
  {
    name: "login",
    options: {
      headerShown: false,
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
    }
  },
  { name: "register/farmer", options: { headerShown: false } },
  { name: "register/customer", options: { headerShown: false } },
  { name: "register/welcome-customer", options: { headerShown: false } },
  { name: "register/welcome-farmer", options: { headerShown: false } },
  { name: "forgot-password", options: { headerShown: false } },
  { name: "reset-password", options: { headerShown: false } },
  { name: "angatscore-explainer", options: { headerShown: false } },
  { name: "account-info", options: { headerShown: false } },
  { name: "add-product", options: { headerShown: false } },
  { name: "nearby-stores", options: { headerShown: false } },
  { name: "your-listings", options: { headerShown: false } },
  { name: "loan-application", options: { headerShown: false } },
  { name: "loan-application-success", options: { headerShown: false } },
  { name: "weather-analysis", options: { headerShown: false } },
  { name: "study-hub-videos", options: { headerShown: false } },
  { name: "kaagri-chatbot", options: { headerShown: false } },
  { name: "store-contact", options: { headerShown: false } },
  { name: "store-contact/[storeId]", options: { headerShown: false } },
  { name: "loan-payment", options: { headerShown: false } },
  { name: "loan-transactions", options: { headerShown: false } },
  { name: "sales-transactions", options: { headerShown: false } },
  { name: "upcoming-payments", options: { headerShown: false } },
  { name: "increase-angatscore", options: { headerShown: false } },
  { name: "financial-health", options: { headerShown: false } },
  { name: "farming-practices", options: { headerShown: false } },
  { name: "increase-success", options: { headerShown: false } },
  { name: "community-links", options: { headerShown: false } },
  { name: "data-privacy-consent", options: { headerShown: false } },
  { name: "angatscore-report", options: { headerShown: false } },
];


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Request notification permissions when app loads
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
      }
    }
    requestPermissions();
  }, []);

  // Initialize KaAgri API on app startup
  useEffect(() => {
    const initializeKaAgriAPI = async () => {
      try {
        const API_URL = __DEV__ ? 'http://192.168.50.114:5000/health' : 'http://localhost:5000/health';
        console.log('🌱 Initializing KaAgri API connection...');
        
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.status === 'healthy' && data.chatbot_ready) {
          console.log('✅ KaAgri API ready and chatbot loaded!');
        } else {
          console.log('⚠️ KaAgri API responding but chatbot not ready yet');
        }
      } catch (error) {
        console.log('⚠️ KaAgri API not available at startup:', error.message);
        console.log('💡 Make sure to run: python api_server.py in KaagriBot folder');
      }
    };

    if (loaded) {
      initializeKaAgriAPI();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

// Configure how notifications behave
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

useEffect(() => {
  // Ask for permissions
  async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("❌ Notification permission not granted");
      return;
    }
    console.log("✅ Notification permission granted");

    // Schedule a local notification for testing
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌱 KaAgri Weather Alert 🌱",
        body: "🌩️ Stormy weather (11 mm/1hr) - We suggest delaying planting and checking crop covers. Stay safe!",
      },
      trigger: { seconds: 5 }, // shows after 5 seconds
    });
  }

  requestPermissions();
}, []);

  return (
    <CustomThemeProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }} 
          />
          {screenConfigs.map((screen) => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              options={screen.options}
            />
          ))}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CustomThemeProvider>
  );
}