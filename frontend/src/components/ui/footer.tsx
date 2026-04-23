import { View, Image } from "react-native";
import clsx from "clsx";

interface FooterProps {
  className?: string;
}

const FOOTER_IMAGE_URL = "https://bsvwumgsnkfqpxdublwo.supabase.co/storage/v1/object/public/coupon/Footer.svg";

export function Footer({ className }: FooterProps) {
  return (
    <View className={clsx("w-full", className)}>
      <Image
        source={{ uri: FOOTER_IMAGE_URL }}
        className="w-full h-32"
        resizeMode="cover"
      />
    </View>
  );
}