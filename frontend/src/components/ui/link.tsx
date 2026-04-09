import { Pressable, Text, View, type ViewProps } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { AppIcon } from "./icon";
import ExpandRightIcon from "@/assets/icons/expand_right_light.svg";
import clsx from "clsx";

interface LinkProps extends ViewProps {
  href: string;
  children?: React.ReactNode;
  variant?: "text" | "button" | "link";
  className?: string;
  textClassName?: string;
  showIcon?: boolean;
  iconSize?: number;
  replace?: boolean;
}

export function Link({
  href,
  children,
  variant = "text",
  className,
  textClassName,
  showIcon = true,
  iconSize = 16,
  replace = false,
  ...props
}: LinkProps) {
  const router = useRouter();

  const handlePress = () => {
    if (replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  if (variant === "link") {
  return (
    <Pressable
      onPress={handlePress}
      className={clsx("flex-row items-center gap-1", className)}
      {...props}
    >
      <Text
        className={clsx(
          "text-md text-base-white",
          textClassName
        )}
      >
        {children || "View all"}
      </Text>
      {showIcon && (
        <AppIcon
          icon={ExpandRightIcon}
          size={iconSize}
          color={COLORS.text.muted}
        />
      )}
    </Pressable>
  );
}

  if (variant === "button") {
    return (
      <Pressable
        onPress={handlePress}
        className={clsx(
          "px-4 py-2 rounded-lg bg-brand-blue100 active:opacity-80",
          className
        )}
        {...props}
      >
        <Text className={clsx("text-white font-medium", textClassName)}>
          {children}
        </Text>
      </Pressable>
    );
  }

  // default: text link
  return (
    <Pressable onPress={handlePress} {...props}>
      <Text
        className={clsx(
          "text-brand-blue100 active:opacity-80",
          className
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}