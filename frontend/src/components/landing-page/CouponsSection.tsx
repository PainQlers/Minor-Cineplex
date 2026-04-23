import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { CouponCard } from "@/components/landing-page/CouponCard";
import { getCoupons } from "@/services/coupon.service";
import { Coupon } from "@/types/coupon";


export function CouponsSection() {
  const router = useRouter();
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
        <Pressable
          onPress={() => {
            if (Platform.OS === 'web') {
              window.location.href = '/coupons';
            } else {
              router.push('/coupons');
            }
          }}
        >
          <Text className="text-base font-semibold text-base-white">
            View all
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={coupons.slice(0, 4)}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 14 }}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <CouponCard
            coupon={item}
          />
        )}
      />
    </View>
  );
}
