import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { Link } from "@/components/ui/link";
import { CouponCard } from "@/components/landing-page/CouponCard";
import { getCoupons } from "@/services/coupon.service";
import { Coupon } from "@/types/coupon";

const GRADIENT_COLORS = [
  ["#580A12", "#9E1425", "#1B1235"],
  ["#07142E", "#122C68", "#0A0F1E"],
  ["#0D5775", "#24A1D2", "#E13A8B"],
  ["#080808", "#2F2F35", "#10131E"],
] as [string, string, string][];

export function CouponsSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const data = await getCoupons();
        setCoupons(data);
      } catch (err) {
        setError("Unable to load coupons");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (isLoading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-red-400">{error}</Text>
      </View>
    );
  }

  return (
    <View className="gap-6 pb-4 pt-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">Special coupons</Text>
        <Link href="/coupons" variant="link" textClassName="text-base font-semibold">
          View all
        </Link>
      </View>

      <FlatList
        data={coupons.slice(0, 4)}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 14 }}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item, index }) => (
          <CouponCard
            coupon={item}
            gradientColors={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
          />
        )}
      />
    </View>
  );
}
