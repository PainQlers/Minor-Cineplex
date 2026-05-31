import { ReactNode } from "react";
import { ImageBackground, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsx from "clsx";

interface HeroBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export function HeroBackground({
  children,
  className,
}: HeroBackgroundProps) {
  return (
    <View className={clsx("min-h-[420px] bg-base-gray0", className)}>
      <ImageBackground
        source={require("@/assets/images/banner.png")}
        resizeMode="cover"
        className="w-full min-h-[420px] overflow-hidden"
      >
        <LinearGradient
          colors={[
            "rgba(3,7,18,0.50)",
            "rgba(3,7,18,0.72)",
            "rgba(3,7,18,0.92)",
            "rgba(3,7,18,1)",
          ]}
          locations={[0, 0.35, 0.7, 1]}
          className="flex-1 px-5 pt-14"
        >
          {children}
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}