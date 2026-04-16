import React, { useEffect } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useState } from "react";
import AppHeader from "@/components/seat-booking/AppHeader";
import StepProgress from "@/components/seat-booking/StepProgress";
import SeatMap from "@/components/seat-booking/SeatMap";
import SeatLegend from "@/components/seat-booking/SeatLegend";
import MovieInfoCard from "@/components/seat-booking/MovieInfoCard";
import BookingFooter from "@/components/seat-booking/BookingFooter";
import { getHallInfoById } from "@/services/hall.service";
import { useLocalSearchParams } from "expo-router";
import { getShowtimeById } from "@/services/showtime.service";

const PRICE_PER_SEAT = 150;

// Initial selected seats matching INITIAL_LAYOUT in SeatMap

interface MovieData {
  movie: string;
  theater: string;
  hall: string;
  date: string;
  showtime: string;
  genre: string;
  poster: string | null;
}

export default function Booking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const INITIAL_TOTAL = selectedSeats.length * PRICE_PER_SEAT;
  const [total, setTotal] = useState(INITIAL_TOTAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movieData, setMovieData] = useState<MovieData | null>(null);

  

  useEffect(() => {
    if (!id) return;

    const loadShowtimeInfo = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getShowtimeById(id);
        // Normalize response (API may return an array or an object)
        const record = Array.isArray(data) ? data[0] : data;

        // Safely extract and format start_time
        const isoDate = record?.start_time;
        let formattedDate = "";
        if (isoDate) {
          const date = new Date(isoDate);
          if (!Number.isNaN(date.getTime())) {
            formattedDate = new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(date);
          } else {
            console.warn("Invalid showtime.start_time:", isoDate);
          }
        }

        let formattedTime = "";
        if (isoDate) {
          const date = new Date(isoDate);
          if (!Number.isNaN(date.getTime())) {
            formattedTime = new Intl.DateTimeFormat('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false // ใช้แบบ 24 ชั่วโมง (ถ้า true จะได้ 10:00 AM)
            }).format(date);
          } else {
            console.warn("Invalid showtime.start_time:", isoDate);
          }
        }

        let movieName = record?.movies?.title ?? "";
        let genreName = record?.movies?.genre ?? "";
        let posterName = record?.movies?.poster_url;

        let hallName = record?.halls?.name ?? "";
        // Try several common shapes for the theater object/name
        let theaterName =
          record?.halls?.theaters?.name ??
          record?.halls?.theater?.name ??
          record?.halls?.theater_name ??
          record?.halls?.theaterName ??
          "";

        // If API returned only a hall reference (id) without nested theater, fetch hall details
        if (!theaterName && record?.halls?.id) {
          try {
            const hallInfo = await getHallInfoById(record.halls.id);
            // hallInfo may contain `theaters` relationship or its own `name`.
            theaterName = hallInfo?.theaters?.name ?? hallInfo?.name ?? theaterName;
            // prefer hall name as fallback for `hall` display if missing
            if (!hallName && hallInfo?.name) {
              hallName = hallInfo.name;
            }
            console.log("fetched hallInfo:", hallInfo);
          } catch (e) {
            console.warn("failed to fetch hall info:", e);
          }
        }

        // Keep light debug logs until confirmed working

        setMovieData({
          movie: movieName,
          theater: theaterName,
          hall: hallName,
          date: formattedDate,
          showtime: formattedTime,
          genre: genreName,
          poster: posterName
        });

        console.log("hallName:", hallName, "raw:", data);

      } catch (err) {
        console.error("loadInfo error:", err);
        setError("โหลดรายละเอียดรอบหนังไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    loadShowtimeInfo();
  }, [id]);

  const handleSelectionChange = (seats: string[], newTotal: number) => {
    setSelectedSeats(seats);
    setTotal(newTotal);
  };

  return (
    <View key={id} className="flex-1 bg-[#0D0F1F]">
      {/* Constrain to mobile-width for design fidelity */}
      <View className="max-w-[430px] mx-auto flex-1">
        <AppHeader />
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>

          {loading ? (
          // ใส่ key="loading" เพื่อบอก React ว่านี่คือคนละก้อนกับข้อมูลจริง
          <View key="loading-state" className="flex-1 justify-center items-center">
            <Text className="text-white">Loading...</Text>
          </View>
        ) : (
          // ใส่ key="content" เพื่อให้ React ทำลายก้อน Loading ทิ้งอย่างสะอาด
          <ScrollView
            key="content-state"
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

        <StepProgress />

        {/* Seat map area */}
        <View className="mb-2">
          <SeatMap pricePerSeat={PRICE_PER_SEAT} onSelectionChange={handleSelectionChange} />
        </View>

        {/* Hall badge */}
        <View className="px-5 mt-4 mb-1">
          <View className="inline-flex items-center px-5 py-2.5 bg-[#161A30] rounded-xl">
            <Text className="text-white font-bold text-lg">{movieData?.hall || " "}</Text>
          </View>
        </View>

        {/* Legend */}
        <SeatLegend />

        {/* Viewider */}
        <View className="mx-5 border-t border-[#1E2238]" />

        {/* Movie info */}
        <MovieInfoCard 
        hall={movieData?.hall || ""} 
        date={movieData?.date || ""} 
        showtime={movieData?.showtime || ""} 
        theater={movieData?.theater|| ""} 
        movie={movieData?.movie || ""} 
        genre={movieData?.genre || ""} 
        poster={movieData?.poster || null} 
        />

        {/* Viewider */}
        <View className="mx-5 border-t border-[#1E2238]" />

        {/* Booking footer */}
        <BookingFooter selectedSeats={selectedSeats} total={total} />
          </ScrollView>
        )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
