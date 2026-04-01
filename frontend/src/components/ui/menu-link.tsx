import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon, type AppSvgIconSource } from "./icon";

const noop = () => {};

export type MenuLinkVariant = "light" | "dark";

interface MenuLinkProps {
  disabled?: boolean;
  icon: AppSvgIconSource;
  iconColor?: string;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: MenuLinkVariant;
}

const VARIANT_STYLES: Record<
  MenuLinkVariant,
  { containerStyle: ViewStyle; labelStyle: TextStyle; iconColor: string }
> = {
  light: {
    containerStyle: {
      backgroundColor: COLORS.base.gray100,
      borderColor: COLORS.base.gray300,
    },
    labelStyle: {
      color: COLORS.text.secondary,
    },
    iconColor: COLORS.text.secondary,
  },
  dark: {
    containerStyle: {
      backgroundColor: COLORS.base.gray0,
      borderColor: COLORS.base.gray300,
    },
    labelStyle: {
      color: COLORS.text.secondary,
    },
    iconColor: COLORS.text.secondary,
  },
};

export function MenuLink({
  disabled = false,
  icon,
  iconColor: iconColorProp,
  label,
  labelStyle,
  onPress = noop,
  style,
  variant = "light",
}: MenuLinkProps) {
  const currentVariant = VARIANT_STYLES[variant];
  const iconColor = iconColorProp || currentVariant.iconColor;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="menuitem"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        currentVariant.containerStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppIcon
        icon={icon}
        size={24}
        color={disabled ? COLORS.text.muted : iconColor}
      />
      <Text
        style={[
          TYPOGRAPHY.body1Regular,
          currentVariant.labelStyle,
          disabled && styles.disabledText,
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.text.muted,
  },
});
