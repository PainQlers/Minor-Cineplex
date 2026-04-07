import type { ComponentType, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SvgProps } from "react-native-svg";
import { View } from "react-native";
import clsx from "clsx";

export type AppSvgIcon = ComponentType<SvgProps>;
export type AppSvgIconModule = { default: AppSvgIcon };
export type AppSvgIconSource = AppSvgIcon | AppSvgIconModule;

export interface AppIconProps
  extends Omit<SvgProps, "color" | "height" | "style" | "width"> {
  color?: string;
  icon?: AppSvgIconSource;
  size?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

function resolveIconComponent(icon: AppSvgIconSource): AppSvgIcon {
  if (typeof icon === "function") {
    return icon;
  }

  return icon.default;
}

export function AppIcon({
  color = "#FFFFFF",
  icon,
  size = 24,
  className,
  style,
  children,
  ...svgProps
}: AppIconProps) {
  return (
    <View
      className={clsx("items-center justify-center", className)}
      style={style}
    >
      {children
        ? children
        : icon
          ? (() => {
              const Icon = resolveIconComponent(icon);

              return (
                <Icon
                  color={color}
                  width={size}
                  height={size}
                  {...svgProps}
                />
              );
            })()
          : null}
    </View>
  );
}