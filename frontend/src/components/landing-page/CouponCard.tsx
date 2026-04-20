import { Text, View, ImageBackground } from "react-native";

import { AppButton } from "@/components/ui/button";
import { Coupon } from "@/types/coupon";

interface CouponCardProps {
  coupon: Coupon;
  gradientColors?: [string, string, ...string[]];
  onPress?: () => void;
}

const noop = () => {};

function getOfferText(coupon: Coupon): string {
  switch (coupon.discount_type) {
    case 'fixed_amount':
      return coupon.discount_value || '0';
    case 'percentage':
      return `${coupon.discount_value || '0'}%`;
    case 'bogo':
      return '1+1';
    case 'fixed_price':
      return coupon.discount_value || '0';
    case 'points_redemption':
      return coupon.discount_value || '0';
    default:
      return 'Deal';
  }
}

function getBadgeText(coupon: Coupon): string {
  switch (coupon.discount_type) {
    case 'fixed_amount':
      return 'Save';
    case 'percentage':
      return 'Off';
    case 'bogo':
      return 'BOGO';
    case 'fixed_price':
      return 'Package';
    case 'points_redemption':
      return 'Points';
    default:
      return 'Deal';
  }
}

function formatValidUntil(dateString?: string): string {
  if (!dateString) return 'Limited time';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function CouponCard({
  coupon,
  onPress = noop,
}: CouponCardProps) {
  const title = coupon.title;
  const validUntil = formatValidUntil(coupon.valid_until || coupon.expiry_date);
  const brand = coupon.code?.split('-')[0]?.toUpperCase() || 'Minor Cineplex';
  const badgeText = getBadgeText(coupon);
  const offerText = getOfferText(coupon);
  const imageUrl = coupon.image_hint;

  return (
    <View className="min-h-[58px] flex-1 rounded-none mx-1 flex-col justify-center">
      <ImageBackground
        source={{ uri: imageUrl }}
        className="min-h-40 overflow-hidden rounded-none"
        resizeMode="cover"
      >
      </ImageBackground>

      <View className="gap-2 p-3">
        <Text
          numberOfLines={2}
          className="min-h-[48px] text-body1medium font-bodyMedium leading-6 text-white"
        >
          {title}
        </Text>

        <Text numberOfLines={1} className="text-body3 font-condensed text-[#97A0BF]">
          {`Valid until `}
          <Text className="text-body3 font-condensed text-white">
            {validUntil}
          </Text>
        </Text>

        <AppButton
          label="Get coupon"
          onPress={onPress}
          className="flex-row min-w-[120px] rounded-[4px] bg-brand-blue100 px-2 m-2"
          labelClassName="text-body2regular font-bodyMedium"
        />
      </View>
    </View>
  );
}
