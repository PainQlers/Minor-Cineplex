import { View, Text } from "react-native";
import { Link } from "@/components/ui/link";

export function CouponsSection() {
  return (
    <View className="flex-row gap-8 px-0 pt-6 justify-between">
      <Text className="text-white text-2xl font-bold">Special coupons</Text>
      <Link href="/coupons" variant="link">
        View all
      </Link>
    </View>
  );
}