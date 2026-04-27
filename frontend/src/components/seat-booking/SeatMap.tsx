import { useEffect, useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import { View, Text, Pressable } from "react-native";
import { cn } from "../../lib/utils";
=======
=======
>>>>>>> 74d7461e67315f802529137643502e734619a65f
import { View, Text, Pressable, Platform } from "react-native";
import { cn } from "../../../lib/utils";
>>>>>>> 74d7461 (feat: Implement user authentication and profile management)
import SeatIcon, { SeatStatus } from "./SeatIcon";
import { getSeatByHallId } from "@/services/seat.service";
import { useLocalSearchParams } from "expo-router";
import { Seat as APISeat } from "@/types/seat";
import { getShowtimeById } from "@/services/showtime.service";

type RowData = Record<string, SeatStatus[]>;

// default fallback layout used while loading / if API returns nothing
const DEFAULT_ROWS = ["E", "D", "C", "B", "A"];
const DEFAULT_SEATS_PER_ROW = 10;

interface SeatMapProps {
  pricePerSeat: number;
  onSelectionChange: (seats: string[], total: number) => void;
}

export default function SeatMap({ pricePerSeat, onSelectionChange }: SeatMapProps) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [layout, setLayout] = useState<RowData>(() => {
    const base: RowData = {};
    DEFAULT_ROWS.forEach((r) => (base[r] = Array.from({ length: DEFAULT_SEATS_PER_ROW }, () => "available")));
    return base;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadSeat = async () => {
      try {
        setLoading(true);
        setError("");
        const hallData = (await getShowtimeById(id));
        const record = Array.isArray(hallData) ? hallData[2] : hallData;
        let hallId = record?.halls_id ?? "";
        const data = (await getSeatByHallId(hallId)) as APISeat[]; // expected API shape: array of seat objects
        const newLayout = buildLayoutFromApi(data);
        setLayout(newLayout);
      } catch (err) {
        console.error("loadSeat error:", err);
        setError("โหลดรายละเอียดที่นั่งไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    loadSeat();
  }, [id]);

  function buildLayoutFromApi(seats: APISeat[]): RowData {
    const rows: Record<string, SeatStatus[]> = {};
    let maxIndex = DEFAULT_SEATS_PER_ROW;

    seats.forEach((s) => {
      const sn = s.seat_number;
      if (!sn) return;
      const m = sn.match(/^([A-Z])(\d+)$/i);
      if (!m) return;
      const row = m[1].toUpperCase();
      const idx = parseInt(m[2], 10);
      maxIndex = Math.max(maxIndex, idx);
      if (!rows[row]) rows[row] = [];
      // default to available — if your API later includes a `status` field use it here
      rows[row][idx - 1] = "available";
    });

    // normalize lengths and fill gaps with available
    Object.keys(rows).forEach((r) => {
      rows[r] = Array.from({ length: maxIndex }, (_, i) => rows[r][i] ?? "available");
    });

    // keep consistent row order: prefer DEFAULT_ROWS, then any others sorted descending
    const ordered: RowData = {};
    const preferred = DEFAULT_ROWS.filter((r) => rows[r]);
    if (preferred.length) {
      preferred.forEach((r) => (ordered[r] = rows[r]));
    }
    Object.keys(rows)
      .filter((r) => !preferred.includes(r))
      .sort()
      .reverse()
      .forEach((r) => (ordered[r] = rows[r]));

    return ordered;
  }

  const ROW_ORDER = Object.keys(layout);

  const handleSeatClick = (row: string, seatIndex: number) => {
    console.log('🪑 Seat clicked:', row, seatIndex);
    const current = layout[row][seatIndex];
    console.log('Current status:', current);
    if (current === "booked" || current === "reserved") {
      console.log('Seat is booked/reserved, ignoring click');
      return;
    }

    const next: SeatStatus = current === "selected" ? "available" : "selected";
    console.log('Toggling:', current, '→', next);
    const newRow = layout[row].map((s, i) => (i === seatIndex ? next : s));
    const newLayout = { ...layout, [row]: newRow };
    setLayout(newLayout);

    const selected: string[] = [];
    ROW_ORDER.forEach((r) => {
      newLayout[r].forEach((s, i) => {
        if (s === "selected") selected.push(`${r}${i + 1}`);
      });
    });
    console.log('✅ Selected seats:', selected, 'Total:', selected.length * pricePerSeat);
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

            {/* left side */}

            <View className="flex-row gap-[3px]">
              {layout[row].slice(0, Math.ceil(layout[row].length / 2)).map((status, i) => (
                <SeatButton key={i} status={status} onPress={() => handleSeatClick(row, i)} />
              ))}
            </View>

            {/* right side */}

            <View className="w-3 flex-shrink-0" />

            <View className="flex-row gap-[3px]">
              {layout[row].slice(Math.ceil(layout[row].length / 2)).map((status, i) => (
                <SeatButton key={i + Math.ceil(layout[row].length / 2)} status={status} onPress={() => handleSeatClick(row, i + Math.ceil(layout[row].length / 2))} />
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
  console.log('🔘 SeatButton render, status:', status, 'clickable:', clickable);

  return (
    <Pressable
      onPress={(e) => {
        // สำหรับ Web: ป้องกันไม่ให้ Event กระโดดไปหาตัวแม่
        if (Platform.OS === 'web' && e) {
          // @ts-ignore
          if (e.preventDefault) e.preventDefault();
          // @ts-ignore
          if (e.stopPropagation) e.stopPropagation();
        }
        console.log('🎯 Pressable onPress fired!');
        onPress();
      }}
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
