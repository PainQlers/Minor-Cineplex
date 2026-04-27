import { useFonts } from "expo-font";
import { useRouter, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { FONT_ASSETS } from "../constants/fonts";
import "../global.css";
import { LandingNavbar } from "@/components/landing-page/LandingNavbar";
import { Platform, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if the splash screen was already prevented/hidden.
});

export default function RootLayout() {
  const [loaded, error] = useFonts(FONT_ASSETS);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {
        // No-op if the splash screen is already hidden.
      });
    }
  }, [error, loaded]);

  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const token = Platform.OS === 'web' 
        ? localStorage.getItem('userToken') 
        : await SecureStore.getItemAsync('userToken');

      if (!token) {
        router.replace('/screens/Login');
      }
    }
    checkAuth();
  }, []);

  if (error) {
    throw error;
  }

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: '#0D0F1F' }}>
      {/* 1. วาง Navbar ไว้บนสุดแบบปกติ ไม่ต้องใส่ absolute */}
      <LandingNavbar className="relative"/>

      {/* 2. ให้ Stack (เนื้อหาแต่ละหน้า) ใช้พื้นที่ที่เหลือทั้งหมด */}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
    </AuthProvider>
  );
}
