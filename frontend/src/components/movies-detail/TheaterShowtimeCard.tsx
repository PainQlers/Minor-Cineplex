import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatShowtime } from "@/lib/utils/movie-detail.utils";
import { TheaterShowtimeGroup } from "@/types/movie-detail";

type TheaterShowtimeCardProps = {
  group: TheaterShowtimeGroup;
  onSelectShowtime: (showtimeId: string) => void;
};

export function TheaterShowtimeCard({
  group,
  onSelectShowtime,
}: TheaterShowtimeCardProps) {
  return (
    <View className="bg-[#070C1B]">
      <View className="flex-row items-start justify-between gap-4 px-4 py-4">
        <View className="flex-1 gap-4">
          <View className="flex-row items-center gap-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#21263F]">
              <Ionicons name="location-sharp" size={22} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-condensedBold text-headline3 text-white">
                {group.theater.name}
              </Text>
              {group.distanceKm !== null ? (
                <Text className="font-condensed text-body3 text-[#8B93B0]">
                  {group.distanceKm.toFixed(1)} km
                </Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <View className="rounded bg-[#21263F] px-3 py-1.5">
              <Text className="font-condensed text-body2regular text-[#8B93B0]">
                Hearing assistance
              </Text>
            </View>
            <View className="rounded bg-[#21263F] px-3 py-1.5">
              <Text className="font-condensed text-body2regular text-[#8B93B0]">
                Wheelchair access
              </Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-down" size={28} color="#C8CEDD" />
      </View>

      <View className="gap-10 border border-[#21263F] px-4 py-6">
        {group.halls.map((hall) => (
          <View key={`${group.theater.id}-${hall.hallName}`} className="gap-4">
            <Text className="font-condensedBold text-headline3 text-[#C8CEDD]">
              {hall.hallName}
            </Text>

            <View className="flex-row flex-wrap gap-4">
              {hall.showtimes.map((showtime, index) => (
                <TouchableOpacity
                  key={showtime.id}
                  className={`w-[102px] items-center justify-center rounded px-4 py-3 ${
                    index === 0 ? "bg-[#4E7BEE]" : "bg-[#1E29A8]"
                  }`}
                  activeOpacity={0.8}
                  onPress={() => onSelectShowtime(showtime.id)}
                >
                  <Text className="font-condensedBold text-[20px] leading-[26px] text-white">
                    {formatShowtime(showtime.start_time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
