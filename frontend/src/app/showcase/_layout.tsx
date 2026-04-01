import { Slot, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { COLORS } from "../../constants/colors";

export default function ShowcaseLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <View style={styles.blueGlow} />
        <View style={styles.purpleGlow} />
        <Slot />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  blueGlow: {
    backgroundColor: COLORS.brand.blue100,
    borderRadius: 140,
    height: 280,
    opacity: 0.12,
    position: "absolute",
    right: -80,
    top: -100,
    width: 280,
  },
  purpleGlow: {
    backgroundColor: COLORS.brand.blue200,
    borderRadius: 120,
    bottom: -80,
    height: 240,
    left: -60,
    opacity: 0.1,
    position: "absolute",
    width: 240,
  },
  screen: {
    backgroundColor: COLORS.surface.canvas,
    flex: 1,
  },
});
