import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Svg, Path, Rect, Circle } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

interface MenuItem {
  label: string;
  path: string;
  icon: (color: string) => React.ReactNode; // ปรับให้รับสีเพื่อเปลี่ยนตามสถานะ
}

// --- Icons (ปรับให้รับ color prop) ---
const BookingIcon = (color: string) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="4" width="13" height="17" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M15 10V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CouponIcon = (color: string) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.75042 13.7059L14.2505 9.29412M9.75042 9.29412H9.76032M14.2406 13.7059H14.2505M3.41795 9.15647C3.19475 9.15647 2.99045 8.97824 3.00035 8.74618C3.06065 7.38559 3.22985 6.49971 3.70235 5.79912C3.97187 5.39988 4.30987 5.04941 4.70137 4.76324C5.74988 4 7.23039 4 10.1932 4H13.8059C16.7687 4 18.2492 4 19.2995 4.76324C19.6874 5.04559 20.0258 5.39588 20.2976 5.79912C20.7702 6.49971 20.9394 7.38559 20.9997 8.74618C21.0096 8.97824 20.8053 9.15647 20.5811 9.15647C19.3337 9.15647 18.3221 10.2056 18.3221 11.5C18.3221 12.7944 19.3337 13.8435 20.5811 13.8435C20.8053 13.8435 21.0096 14.0218 20.9997 14.2547C20.9394 15.6144 20.7702 16.5003 20.2976 17.2018C20.028 17.6007 19.6901 17.9509 19.2986 18.2368C18.2492 19 16.7687 19 13.8059 19H10.1941C7.23129 19 5.75078 19 4.70047 18.2368C4.30929 17.9505 3.9716 17.6 3.70235 17.2009C3.22985 16.5003 3.06065 15.6144 3.00035 14.2538C2.99045 14.0218 3.19475 13.8435 3.41795 13.8435C4.66536 13.8435 5.67698 12.7944 5.67698 11.5C5.67698 10.2056 4.66536 9.15647 3.41795 9.15647Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const ProfileIcon = (color: string) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const ResetIcon = (color: string) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M14 15L10 19L14 23" stroke={color} strokeWidth="2" />
    <Path
      d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const menuItems: MenuItem[] = [
  { label: "Booking history", path: "BookingHistory", icon: BookingIcon },
  { label: "My coupons", path: "Coupons", icon: CouponIcon },
  { label: "Profile", path: "profile", icon: ProfileIcon },
  { label: "Reset password", path: "ResetPassword", icon: ResetIcon },
];

export default function MenuBar() {
  const navigation = useNavigation<any>();
  const router = useRouter();

  return (
    <View className="w-full bg-[070C1B] shadow-lg">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        className="flex-row"
      >
        <View className="flex-row gap-x-2">
          {menuItems.map((item) => {
            // เช็คว่า Route ปัจจุบันตรงกับ item.path หรือไม่
            const isSelected = router.name === item.path;
            
            // กำหนดสีตามสถานะ
            const iconColor = isSelected ? "#9CA3AF" : "#4B5563"; // base-gray-400 vs base-gray-200

            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => router.push(item.path)}
                activeOpacity={0.7}
                className={`flex-row items-center gap-x-3 px-4 py-4 rounded-lg ${
                  isSelected ? "bg-gray-800" : "bg-transparent"
                }`}
              >
                <View>
                  {item.icon(iconColor)}
                </View>
                <Text 
                  className={`font-bold text-base ${
                    isSelected ? "text-gray-300" : "text-gray-500"
                  }`}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}