import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/icon";
import PinFillIcon from "@/assets/icons/pin_fill.svg";

export interface TheaterCardProps {
  name: string;
  address: string;
  mapUrl?: string | null;
  onPress?: () => void;
}

const noop = () => {};

export function TheaterCard({
  name,
  address,
  // mapUrl,
  onPress = noop,
}: TheaterCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      // accessibilityHint={mapUrl ? "Opens theater location in maps" : undefined}
      className="flex-row items-center gap-4 rounded-lg border border-base-gray100 bg-surface-canvas px-3 py-3"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-base-gray100">
        <AppIcon
          icon={PinFillIcon}
          size={32}
          color="#4E7BEE"
        />
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-condensedBold text-headline4 text-text-primary">
          {name}
        </Text>
        <Text
          numberOfLines={2}
          className="font-body text-body3 text-text-muted"
        >
          {address}
        </Text>
        {/* <Text className="font-bodyMedium text-body3 text-brand-blue100">
          {mapUrl ? "Open in Maps" : "Map unavailable"}
        </Text> */}
      </View>
    </Pressable>
  );
}
