import { FlatList, Text, View } from "react-native";
import { Link } from "@/components/ui/link";
import { CouponCard } from "@/components/landing-page/CouponCard";

const MOCK_COUPONS = [
  {
    id: "1",
    title: "Minor Cineplex x Coke Joyful Together",
    validUntil: "18 Jun 2025",
    brand: "Joyful Together",
    badgeText: "Limited",
    offerText: "999",
    gradientColors: ["#580A12", "#9E1425", "#1B1235"] as [string, string, string],
  },
  {
    id: "2",
    title: "Redeem 999 UOB Rewards Points for Movie Perks",
    validUntil: "18 Jun 2025",
    brand: "UOB Rewards",
    badgeText: "UOB",
    offerText: "999",
    gradientColors: ["#07142E", "#122C68", "#0A0F1E"] as [string, string, string],
  },
  {
    id: "3",
    title: "GSB Credit Cards Get a Deluxe Combo Privilege",
    validUntil: "18 Jun 2025",
    brand: "GSB x Minor",
    badgeText: "Promo",
    offerText: "50%",
    gradientColors: ["#0D5775", "#24A1D2", "#E13A8B"] as [string, string, string],
  },
  {
    id: "4",
    title: "UOB Mercedes Buy 1 Get 1 Regular Movie Ticket",
    validUntil: "18 Jun 2025",
    brand: "UOB Mercedes",
    badgeText: "BOGO",
    offerText: "1+1",
    gradientColors: ["#080808", "#2F2F35", "#10131E"] as [string, string, string],
  },
] as const;

export function CouponsSection() {
  return (
    <View className="gap-6 pb-4 pt-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">Special coupons</Text>
        <Link href="/coupons" variant="link" textClassName="text-base font-semibold">
          View all
        </Link>
      </View>

      <FlatList
        data={MOCK_COUPONS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 14 }}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <CouponCard
            title={item.title}
            validUntil={item.validUntil}
            brand={item.brand}
            badgeText={item.badgeText}
            offerText={item.offerText}
            gradientColors={item.gradientColors}
          />
        )}
      />
    </View>
  );
}
