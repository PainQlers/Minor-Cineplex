import { Pressable, Text } from "react-native";
import clsx from "clsx";

import { AppIcon, type AppSvgIconSource } from "./icon";

const noop = () => {};

export type MenuLinkVariant = "light" | "dark";

interface MenuLinkProps {
  disabled?: boolean;
  icon: AppSvgIconSource;
  iconColor?: string;
  label: string;
  onPress?: () => void;
  variant?: MenuLinkVariant;
  className?: string;
  labelClassName?: string;
}

const VARIANT_CLASSES = {
  light: {
    container: "bg-base-gray100 border-base-gray300",
    label: "text-text-secondary",
    iconColor: "#C8CEDD",
  },
  dark: {
    container: "bg-base-gray0 border-base-gray300",
    label: "text-text-secondary",
    iconColor: "#C8CEDD",
  },
};

export function MenuLink({
  disabled = false,
  icon,
  iconColor: iconColorProp,
  label,
  onPress = noop,
  variant = "light",
  className,
  labelClassName,
}: MenuLinkProps) {
  const v = VARIANT_CLASSES[variant];
  const iconColor = iconColorProp || v.iconColor;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="menuitem"
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        "flex-row items-center gap-3 px-4 py-4 rounded-[20px] border-2",
        v.container,
        disabled && "opacity-50",
        className
      )}
    >
      <AppIcon
        icon={icon}
        size={24}
        color={disabled ? "#8B93B0" : iconColor}
      />

      <Text
        className={clsx(
          "font-condensed text-body1",
          v.label,
          disabled && "text-text-muted",
          labelClassName
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}