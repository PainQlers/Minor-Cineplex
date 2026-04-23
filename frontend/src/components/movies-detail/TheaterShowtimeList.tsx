import { Text, View } from "react-native";

import { formatDateLabel } from "@/lib/utils/movie-detail.utils";
import { TheaterShowtimeCard } from "./TheaterShowtimeCard";
import { TheaterShowtimeGroup } from "@/types/movie-detail";

type TheaterShowtimeListProps = {
  groups: TheaterShowtimeGroup[];
  selectedDateKey: string;
  onSelectShowtime: (showtimeId: string) => void;
};

export function TheaterShowtimeList({
  groups,
  selectedDateKey,
  onSelectShowtime,
}: TheaterShowtimeListProps) {
  if (groups.length === 0) {
    return (
      <View className="mx-4 border border-[#21263F] bg-[#070C1B] px-4 py-10">
        <Text className="text-center font-condensedBold text-headline4 text-[#C8CEDD]">
          No showtimes available
        </Text>
        <Text className="mt-2 text-center font-condensed text-body2regular text-[#8B93B0]">
          {formatDateLabel(selectedDateKey)}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-6">
      {groups.map((group) => (
        <TheaterShowtimeCard
          key={group.theater.id}
          group={group}
          onSelectShowtime={onSelectShowtime}
        />
      ))}
    </View>
  );
}
