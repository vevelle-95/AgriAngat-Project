import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";

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
];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

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
