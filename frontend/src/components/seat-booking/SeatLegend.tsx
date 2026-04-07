import { View, Text } from "react-native";
import SeatIcon, { SeatStatus } from "./SeatIcon";

interface LegendItemProps {
  status: SeatStatus;
  label: string;
  sublabel?: string;
}

function LegendItem({ status, label, sublabel }: LegendItemProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 flex-shrink-0">
        <SeatIcon status={status} />
      </View>
      <View>
        <Text className="text-white text-sm font-medium leading-tight">{label}</Text>
        {sublabel && <Text className="text-gray-400 text-xs mt-0.5">{sublabel}</Text>}
      </View>
    </View>
  );
}

export default function SeatLegend() {
  return (
    <View className="px-5 py-4">
      <View className="grid grid-cols-2 gap-x-4 gap-y-4">
        <LegendItem status="available" label="Available Seat" sublabel="THB150" />
        <LegendItem status="booked" label="Booked Seat" />
        <LegendItem status="reserved" label="Reserved Seat" />
      </View>
    </View>
  );
}
