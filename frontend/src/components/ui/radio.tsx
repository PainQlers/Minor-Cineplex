import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

const noop = () => {};

interface AppRadioProps {
  disabled?: boolean;
  label?: string;
  onPress?: (selected: boolean) => void;
  selected?: boolean;
  className?: string;
  labelClassName?: string;
}

export function AppRadio({
  disabled = false,
  label,
  onPress = noop,
  selected = false,
  className,
  labelClassName,
}: AppRadioProps) {
  const handlePress = () => {
    if (!disabled && !selected) {
      onPress(true);
    }
  };

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={clsx(
        "flex-row items-center gap-2",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Radio Circle */}
      <View
        className={clsx(
          "w-5 h-5 rounded-full items-center justify-center border",
          selected
            ? "border-[3px] border-brand-blue100"
            : "border-base-gray200",
          disabled && "opacity-60"
        )}
      >
        {selected && (
          <View className="w-[10px] h-[10px] rounded-full bg-brand-blue100" />
        )}
      </View>

      {/* Label */}
      {label && (
        <Text
          className={clsx(
            "font-condensed text-body3",
            selected ? "text-text-primary" : "text-text-secondary",
            disabled && "text-text-muted",
            labelClassName
          )}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}