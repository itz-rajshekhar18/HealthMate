import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "./globals.css";

import { requestNotificationPermissions, loadReminders, scheduleAllReminders } from "../services/notificationService";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after component mounts
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    // Initialize notifications
    const setupNotifications = async () => {
      const granted = await requestNotificationPermissions();
      if (granted) {
        const reminders = await loadReminders();
        await scheduleAllReminders(reminders);
      }
    };
    
    hideSplashScreen();
    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(login)"
          options={{ 
            headerShown: false,
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="(dashboard)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
