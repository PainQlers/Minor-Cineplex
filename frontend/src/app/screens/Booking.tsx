import React from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useState } from "react";
import AppHeader from "@/components/seat-booking/AppHeader";
import StepProgress from "@/components/seat-booking/StepProgress";
import SeatMap from "@/components/seat-booking/SeatMap";
import SeatLegend from "@/components/seat-booking/SeatLegend";
import MovieInfoCard from "@/components/seat-booking/MovieInfoCard";
import BookingFooter from "@/components/seat-booking/BookingFooter";

const PRICE_PER_SEAT = 150;
const HALL = "Hall 1";

// Initial selected seats matching INITIAL_LAYOUT in SeatMap
const INITIAL_SEATS = ["C9", "C10"];
const INITIAL_TOTAL = INITIAL_SEATS.length * PRICE_PER_SEAT;

export default function Booking() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(INITIAL_SEATS);
  const [total, setTotal] = useState(INITIAL_TOTAL);

  const handleSelectionChange = (seats: string[], newTotal: number) => {
    setSelectedSeats(seats);
    setTotal(newTotal);
  };

  return (
    <View className="flex-1 bg-[#0D0F1F]">
      {/* Constrain to mobile-width for design fidelity */}
      <View className="max-w-[430px] mx-auto flex-1">
        <AppHeader />
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
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
            <Text className="text-white font-bold text-lg">{HALL}</Text>
          </View>
        </View>

        {/* Legend */}
        <SeatLegend />

        {/* Viewider */}
        <View className="mx-5 border-t border-[#1E2238]" />

        {/* Movie info */}
        <MovieInfoCard hall={HALL} />

        {/* Viewider */}
        <View className="mx-5 border-t border-[#1E2238]" />

        {/* Booking footer */}
        <BookingFooter selectedSeats={selectedSeats} total={total} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
