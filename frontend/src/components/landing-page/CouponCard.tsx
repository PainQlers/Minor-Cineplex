import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppButton } from "@/components/ui/button";

interface CouponCardProps {
  title: string;
  validUntil: string;
  brand?: string;
  badgeText?: string;
  offerText?: string;
  gradientColors?: [string, string, ...string[]];
  onPress?: () => void;
}

const noop = () => {};

export function CouponCard({
  title,
  validUntil,
  brand = "Minor Cineplex",
  badgeText = "Exclusive Deal",
  offerText = "999",
  gradientColors = ["#6B0F1A", "#A11D2D", "#21153A"],
  onPress = noop,
}: CouponCardProps) {
  return (
    <View className="flex-1 rounded-none bg-[#10172B] mx-1">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-36 overflow-hidden rounded-none px-3 py-3"
      >
        <View className="flex-row items-start justify-between">
          <View className="max-w-[72%] rounded-full bg-black/25 px-2 py-1">
            <Text
              numberOfLines={1}
              className="text-[10px] font-semibold uppercase tracking-[0.6px] text-white"
            >
              {brand}
            </Text>
          </View>

          <View className="rounded-full bg-white/15 px-2 py-1">
            <Text className="text-[10px] font-semibold text-white">
              {badgeText}
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="rounded-2xl bg-white/90 px-4 py-2">
            <Text className="text-center text-[11px] font-semibold uppercase tracking-[1px] text-[#1F2F6A]">
              Get up to
            </Text>
            <Text className="text-center text-4xl font-extrabold leading-[40px] text-[#1A42C7]">
              {offerText}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="gap-2">
        <Text
          numberOfLines={2}
          className="min-h-[48px] text-base font-semibold leading-6 text-white"
        >
          {title}
        </Text>

        <Text className="text-sm text-[#97A0BF]">
          Valid until {validUntil}
        </Text>

        <AppButton
          label="Get coupon"
          onPress={onPress}
          className="flex-row w-full rounded-lg bg-brand-blue100 px-4 m-2"
          labelClassName="text-base font-semibold"
        />
      </View>
    </View>
  );
}
