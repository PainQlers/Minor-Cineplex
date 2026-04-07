import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

const noop = () => {};

interface AppCheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onPress?: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
}

export function AppCheckbox({
  checked = false,
  disabled = false,
  label,
  onPress = noop,
  className,
  labelClassName,
}: AppCheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      onPress(!checked);
    }
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={clsx(
        "flex-row items-center gap-2",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Checkbox */}
      <View
        className={clsx(
          "w-5 h-5 rounded border items-center justify-center",
          checked
            ? "bg-brand-blue100 border-brand-blue100"
            : "bg-transparent border-base-gray200",
          disabled && "opacity-60"
        )}
      >
        {checked && (
          <Text className="text-text-primary text-xs font-bold">
            ✓
          </Text>
        )}
      </View>

      {/* Label */}
      {label && (
        <Text
          className={clsx(
            "font-condensed text-body3",
            checked ? "text-text-primary" : "text-text-secondary",
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