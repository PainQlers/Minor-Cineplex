import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { cn } from "../../../lib/utils";
import SeatIcon, { SeatStatus } from "./SeatIcon";

type RowData = Record<string, SeatStatus[]>;

// a=available, b=booked, r=reserved, s=selected
const INITIAL_LAYOUT: RowData = {
  E: ["available", "available", "booked", "available", "available", "available", "available", "available", "available", "available"],
  D: ["available", "available", "available", "available", "available", "available", "available", "available", "available", "available"],
  C: ["available", "reserved", "reserved", "available", "available", "booked", "available", "available", "selected", "selected"],
  B: ["booked", "booked", "booked", "available", "available", "available", "available", "available", "booked", "booked"],
  A: ["available", "available", "available", "reserved", "available", "available", "available", "reserved", "available", "available"],
};

const ROW_ORDER = ["E", "D", "C", "B", "A"];

interface SeatMapProps {
  pricePerSeat: number;
  onSelectionChange: (seats: string[], total: number) => void;
}

export default function SeatMap({ pricePerSeat, onSelectionChange }: SeatMapProps) {
  const [layout, setLayout] = useState<RowData>(INITIAL_LAYOUT);

  const handleSeatClick = (row: string, seatIndex: number) => {
    const current = layout[row][seatIndex];
    if (current === "booked" || current === "reserved") return;

    const next: SeatStatus = current === "selected" ? "available" : "selected";
    const newRow = layout[row].map((s, i) => (i === seatIndex ? next : s));
    const newLayout = { ...layout, [row]: newRow };
    setLayout(newLayout);

    const selected: string[] = [];
    ROW_ORDER.forEach((r) => {
      newLayout[r].forEach((s, i) => {
        if (s === "selected") selected.push(`${r}${i + 1}`);
      });
    });
    onSelectionChange(selected, selected.length * pricePerSeat);
  };

  return (
    <View className="px-3">
      <View className="mx-2 mb-4">
        <View className="relative h-7 bg-gradient-to-b from-[#252A50] to-[#181D38] rounded-[50%] items-center justify-center shadow-lg">
          <Text className="text-[10px] text-gray-400 tracking-[0.25em] uppercase font-medium">screen</Text>
        </View>
        <View className="h-4 bg-gradient-to-b from-blue-900/15 to-transparent mx-6 rounded-b-full" />
      </View>

      <View className="flex-col gap-[5px]">
        {ROW_ORDER.map((row) => (
          <View key={row} className="flex-row items-center justify-center gap-[5px]">
            <Text className="text-gray-500 text-[11px] w-3.5 text-center flex-shrink-0 font-medium">{row}</Text>

            <View className="flex-row gap-[3px]">
              {layout[row].slice(0, 5).map((status, i) => (
                <SeatButton key={i} status={status} onPress={() => handleSeatClick(row, i)} />
              ))}
            </View>

            <View className="w-3 flex-shrink-0" />

            <View className="flex-row gap-[3px]">
              {layout[row].slice(5).map((status, i) => (
                <SeatButton key={i + 5} status={status} onPress={() => handleSeatClick(row, i + 5)} />
              ))}
            </View>

            <Text className="text-gray-500 text-[11px] w-3.5 text-center flex-shrink-0 font-medium">{row}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SeatButton({ status, onPress }: { status: SeatStatus; onPress: () => void }) {
  const clickable = status === "available" || status === "selected";

  return (
    <Pressable
      onPress={onPress}
      disabled={!clickable}
      className={cn(
        "w-[27px] h-[27px] flex-shrink-0 transition-transform duration-100",
        clickable && "hover:scale-110 active:scale-95",
        !clickable && "cursor-default"
      )}
    >
      <SeatIcon status={status} />
    </Pressable>
  );
}
