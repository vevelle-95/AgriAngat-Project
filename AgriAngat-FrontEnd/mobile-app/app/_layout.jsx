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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            gestureEnabled: true,
            // iOS: allow swipe anywhere on screen
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen name="register/farmer" options={{ headerShown: false }} />
        <Stack.Screen
          name="register/customer"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="register/welcome-customer" options={{ headerShown: false }} />
        <Stack.Screen name="register/welcome-farmer" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="angatscore-explainer" options={{ headerShown: false }} />
        <Stack.Screen name="account-info" options={{ headerShown: false }} />
        <Stack.Screen name="add-product" options={{ headerShown: false }} />
        <Stack.Screen name="nearby-stores" options={{ headerShown: false }} />
        <Stack.Screen name="your-listings" options={{ headerShown: false }} />
        <Stack.Screen name="loan-application" options={{ headerShown: false }} />
        <Stack.Screen name="loan-application-success" options={{ headerShown: false }} />
        <Stack.Screen name="loan-application-failure" options={{ headerShown: false }} />
        <Stack.Screen name="loan-application-details" options={{ headerShown: false }} />
        <Stack.Screen name="weather-analysis" options={{ headerShown: false }} />
        <Stack.Screen name="study-hub" options={{ headerShown: false }} />
        <Stack.Screen name="study-hub-videos" options={{ headerShown: false }} />
        <Stack.Screen name="kaagri-chatbot" options={{ headerShown: false }} />
        <Stack.Screen name="store-contact" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
