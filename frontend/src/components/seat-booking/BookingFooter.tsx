import { View, Text, Pressable } from "react-native";

interface BookingFooterProps {
  selectedSeats: string[];
  total: number;
}

export default function BookingFooter({ selectedSeats, total }: BookingFooterProps) {
  const seatLabel = selectedSeats.length > 0 ? selectedSeats.join(", ") : "—";

  return (
    <View className="px-5 pt-4 pb-6">
      <View className="flex-col gap-2 mb-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 text-sm">Selected Seat</Text>
          <Text className="text-white text-sm font-semibold">{seatLabel}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 text-sm">Total</Text>
          <Text className="text-white text-sm font-bold">THB{total.toLocaleString()}</Text>
        </View>
      </View>

      <Pressable
        disabled={selectedSeats.length === 0}
        className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base"
      >
        <Text className="text-center text-white font-semibold">Next</Text>
      </Pressable>
    </View>
  );
}
