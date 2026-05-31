import { Pressable, ScrollView, Text } from "react-native";

import { DateOption } from "@/types/movie-detail";

type ShowtimeDateSelectorProps = {
  dateOptions: DateOption[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

export function ShowtimeDateSelector({
  dateOptions,
  selectedDateKey,
  onSelectDate,
}: ShowtimeDateSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
    >
      {dateOptions.map((dateOption) => {
        const isSelected = selectedDateKey === dateOption.key;

        return (
          <Pressable
            key={dateOption.key}
            className={`w-28 items-center justify-center border px-4 py-4 ${
              isSelected ? "border-[#4E7BEE] bg-[#4E7BEE]" : "border-[#21263F] bg-[#070C1B]"
            }`}
            onPress={() => onSelectDate(dateOption.key)}
          >
            <Text
              className={`font-condensedBold text-headline4 ${
                isSelected ? "text-white" : "text-[#C8CEDD]"
              }`}
            >
              {dateOption.day}
            </Text>
            <Text
              className={`mt-1 font-condensed text-body3 ${
                isSelected ? "text-white" : "text-[#8B93B0]"
              }`}
            >
              {dateOption.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
