import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";
import { MenuLink, type MenuLinkVariant } from "./menu-link";
import { Image } from "expo-image";

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
  style?: StyleProp<ViewStyle>;
  variant?: "light" | "dark";
}

export function AppNavbar({
  items = [],
  logo,
  logoLabel = "Cineplex",
  onHamburgerPress = noop,
  onLogoPress = noop,
  showHamburger = true,
  style,
  variant = "dark",
}: AppNavbarProps) {
  return (
    <View
      style={[styles.navbar, variant === "light" && styles.navbarLight, style]}
    >
      {/* Left: Hamburger Menu */}
      <Pressable onPress={onLogoPress} style={styles.logoButton}>
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

      {/* Center: Navigation Items (optional) */}
      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={item.onPress || noop}
              style={styles.navItem}
            >
              <Text style={[TYPOGRAPHY.body1Regular, styles.navItemText]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Right */}
      {showHamburger && (
        <Pressable onPress={onHamburgerPress} style={styles.hamburgerButton}>
          <AppIcon icon={HamburgerIcon} size={24} color={COLORS.text.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  defaultLogo: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: COLORS.base.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  hamburgerButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  itemsContainer: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logoButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `${COLORS.base.gray0}CC`,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.base.gray100,
  },
  navbarLight: {
    backgroundColor: `${COLORS.base.gray100}CC`,
    borderBottomColor: COLORS.base.gray200,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navItemText: {
    color: COLORS.text.secondary,
  },
});
