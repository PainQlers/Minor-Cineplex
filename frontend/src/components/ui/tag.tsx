import { Pressable, Text } from "react-native";
import clsx from "clsx";

const noop = () => {};

interface AppTagProps {
  disabled?: boolean;
  label: string;
  onPress?: (selected: boolean) => void;
  selected?: boolean;
  className?: string;
  labelClassName?: string;
}

export function AppTag({
  disabled = false,
  label,
  onPress = noop,
  selected = false,
  className,
  labelClassName,
}: AppTagProps) {
  const handlePress = () => {
    if (!disabled) {
      onPress(!selected);
    }
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={clsx(
        "px-3 py-1.5 rounded items-center justify-center bg-base-gray100",
        selected && "bg-base-gray100",
        disabled && "opacity-50",
        className
      )}
    >
      <Text
        className={clsx(
          "font-condensed text-body3",
          selected ? "text-text-secondary font-medium" : "text-text-muted",
          disabled && "text-text-muted",
          labelClassName
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}