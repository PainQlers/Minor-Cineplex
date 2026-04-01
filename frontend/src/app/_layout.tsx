import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { FONT_ASSETS } from "../constants/fonts";

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

  if (error) {
    throw error;
  }

  if (!loaded) {
    return null;
  }

  return <Stack />;
}
