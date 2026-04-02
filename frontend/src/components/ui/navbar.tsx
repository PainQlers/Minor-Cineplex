import { Pressable, Text, View } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { AppIcon } from "./icon";

const noop = () => {};

interface NavItem {
  id: string;
  label: string;
  onPress?: () => void;
}

interface AppNavbarProps {
  items?: NavItem[];
  logo?: React.ReactNode;
  logoLabel?: string;
  onHamburgerPress?: () => void;
  onLogoPress?: () => void;
  showHamburger?: boolean;
  variant?: "light" | "dark";
  className?: string;
}

export function AppNavbar({
  items = [],
  logo,
  logoLabel = "Cineplex",
  onHamburgerPress = noop,
  onLogoPress = noop,
  showHamburger = true,
  variant = "dark",
  className,
}: AppNavbarProps) {
  return (
    <View
      className={clsx(
        "flex-row items-center justify-between px-4 py-3 border-b",
        variant === "dark"
          ? "bg-base-gray0/80 border-base-gray100"
          : "bg-base-gray100/80 border-base-gray200",
        className
      )}
    >
      {/* Left: Logo */}
      <Pressable
        onPress={onLogoPress}
        className="p-2 items-center justify-center"
      >
        {logo ? (
          logo
        ) : (
          <Image
            source={require("@/assets/images/minor.png")}
            style={{ width: 24, height: 32 }}
            contentFit="cover"
            transition={200}
          />
        )}
      </Pressable>

      {/* Center: Navigation Items */}
      {items.length > 0 && (
        <View className="flex-row gap-3 flex-1 justify-center px-4">
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={item.onPress || noop}
              className="px-3 py-2"
            >
              <Text className="font-condensed text-body1 text-text-secondary">
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Right: Hamburger */}
      {showHamburger && (
        <Pressable
          onPress={onHamburgerPress}
          className="p-2 items-center justify-center"
        >
          <AppIcon icon={HamburgerIcon} size={24} />
        </Pressable>
      )}
    </View>
  );
}