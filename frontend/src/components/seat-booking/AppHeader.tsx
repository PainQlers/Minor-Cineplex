import { View, Text, Pressable } from "react-native";

export default function AppHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <View className="flex-row items-end gap-0.5">
        <Text className="text-white font-black text-[28px] leading-none tracking-tight">
          M
        </Text>
        <Text className="text-blue-500 text-lg leading-none mb-0.5">·</Text>
      </View>

      <Pressable className="text-white/70 p-1">
        <Text className="text-white/70">≡</Text>
      </Pressable>
    </View>
  );
}
