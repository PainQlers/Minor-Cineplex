import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";

import { CouponCard } from "@/components/landing-page/CouponCard";
import { getCoupons } from "@/services/coupon.service";
import { Coupon } from "@/types/coupon";
import { Ionicons } from "@expo/vector-icons";

export default function CouponsPage() {
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
      <View className="flex-1 bg-base-gray0 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-base-gray0 items-center justify-center">
        <Text className="text-red-400">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base-gray0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-14 pb-4">
        <Pressable 
          onPress={() => {
            if (Platform.OS === 'web') {
              window.location.href = '/';
            } else {
              router.push('/');
            }
          }}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text className="text-sectionTitle font-condensed text-white">
          All Coupons
        </Text>
      </View>

      {/* Coupons Grid */}
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 14, paddingHorizontal: 20 }}
        contentContainerStyle={{ gap: 14, paddingVertical: 20 }}
        renderItem={({ item }) => (
          <CouponCard
            coupon={item}
          />
        )}
      />
    </View>
  );
}
