import { Stack } from "expo-router";
import "./../global.css";
import { View, Text } from "react-native";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="font-condensedBold text-2xl font-bold text-blue-500">
          Welcome to Expo Router!
        </Text>
        <Text className="text-button text-text-primary">
          Font Test
        </Text>
        <Text className="text-red-500 text-2xl">Hello</Text>
      </View>
    </>
  );
}
