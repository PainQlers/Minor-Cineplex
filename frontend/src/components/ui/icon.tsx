import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SvgProps } from "react-native-svg";

import { COLORS } from "../../constants/colors";

export type AppSvgIcon = ComponentType<SvgProps>;
export type AppSvgIconModule = { default: AppSvgIcon };
export type AppSvgIconSource = AppSvgIcon | AppSvgIconModule;

export interface AppIconProps
  extends Omit<SvgProps, "color" | "height" | "style" | "width"> {
  color?: string;
  icon: AppSvgIconSource;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

function resolveIconComponent(icon: AppSvgIconSource): AppSvgIcon {
  if (typeof icon === "function") {
    return icon;
  }

  return icon.default;
}

export function AppIcon({
  color = COLORS.text.primary,
  icon,
  size = 24,
  style,
  ...svgProps
}: AppIconProps) {
  const Icon = resolveIconComponent(icon);

  return <Icon color={color} height={size} style={style} width={size} {...svgProps} />;
}
