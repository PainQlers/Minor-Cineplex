import { Pressable, Text } from "react-native";
import clsx from "clsx";

export type AppButtonVariant = "primary" | "secondary" | "third" | "outline" | "link";

interface AppButtonProps {
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  className?: string;
  labelClassName?: string;
}

const noop = () => {};

const VARIANT_CLASSES: Record<
  AppButtonVariant,
  { container: string; label: string }
> = {
  primary: {
    container: "bg-brand-blue100",
    label: "text-base-white font-condensed",
  },
  secondary: {
    container: "bg-brand-blue200",
    label: "text-base-white font-condensed",
  },
  third: {
    container: "bg-brand-blue300",
    label: "text-base-white font-condensed",
  },
  outline: {
    container: "border border-gray-300",
    label: "text-base-white font-condensed",
  },
  link: {
    container: "",
    label: "text-base-white underline font-condensed",
  },
};

export function AppButton({
  disabled = false,
  label,
  onPress = noop,
  variant = "primary",
  className,
  labelClassName,
}: AppButtonProps) {
  const v = VARIANT_CLASSES[variant];

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={variant === "link" ? "link" : "button"}
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        "items-center justify-center",
        variant === "link"
          ? "self-start min-h-6"
          : "rounded min-h-12 min-w-[123px] px-10 py-3",
        v.container,
        disabled && "opacity-40",
        className
      )}
    >
      <Text
        className={clsx(
          "text-base font-semibold",
          v.label,
          labelClassName
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}