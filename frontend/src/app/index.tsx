import { Stack } from "expo-router";
import "./../global.css";
import { View , Text } from "react-native";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-blue-500">Welcome to Expo Router!</Text>
      </View>
    </>
  );
}
