import { Pressable, Text, TextInput, View } from "react-native";
import { useState } from "react";
import clsx from "clsx";

const noop = () => {};

export interface AppInputFieldProps {
  disabled?: boolean;
  errorText?: string;
  helperText?: string;
  label: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
  showSearchIcon?: boolean;
  value?: string;
  className?: string;
}

function SearchIcon({ colorClass }: { colorClass: string }) {
  return (
    <View className="items-center justify-center w-6 h-6">
      <View className={clsx("absolute w-3 h-3 border rounded-full left-[5px] top-[5px]", colorClass)} />
      <View className={clsx("absolute w-1 h-[1px] left-[16px] top-[16px] rotate-45", colorClass)} />
    </View>
  );
}

function ClearIcon({ colorClass }: { colorClass: string }) {
  return (
    <View className="items-center justify-center w-6 h-6">
      <View className={clsx("absolute w-3 h-[1px] left-[6px] top-[11.5px] rotate-45", colorClass)} />
      <View className={clsx("absolute w-3 h-[1px] left-[6px] top-[11.5px] -rotate-45", colorClass)} />
    </View>
  );
}

export function AppInputField({
  disabled = false,
  errorText,
  helperText,
  label,
  onChangeText = noop,
  onClear,
  placeholder = "Placeholder Text",
  showClearButton = false,
  showSearchIcon = true,
  value,
  className,
}: AppInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = Boolean(value && value.length > 0);
  const hasError = Boolean(errorText);
  const isActive = !disabled && (isFocused || hasValue);

  const borderClass = hasError
    ? "border-semantic-danger"
    : isActive
      ? "border-base-gray300"
      : "border-base-gray200";

  const iconColorClass = disabled
    ? "bg-text-muted border-text-muted"
    : hasError
      ? "bg-text-primary border-text-primary"
      : isActive
        ? "bg-text-primary border-text-primary"
        : "bg-text-secondary border-text-secondary";

  const inputColorClass = disabled
    ? "text-text-muted"
    : hasValue
      ? "text-text-primary"
      : "text-text-muted";

  const helperColorClass = hasError
    ? "text-semantic-danger"
    : "text-text-muted";

  return (
    <View className={clsx("w-full gap-1", disabled && "opacity-40", className)}>
      {/* Label */}
      <Text className="text-text-secondary font-condensed text-body1">
        {label}
      </Text>

      {/* Field */}
      <View
        className={clsx(
          "flex-row items-center gap-1 bg-surface-panel rounded min-h-12 px-3 py-3 border",
          disabled && "border-0",
          borderClass
        )}
      >
        {showSearchIcon && <SearchIcon colorClass={iconColorClass} />}

        <TextInput
          editable={!disabled}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8B93B0"
          selectionColor="#FFFFFF"
          className={clsx(
            "flex-1 min-h-6 font-condensed text-body1",
            inputColorClass
          )}
          value={value}
        />

        {showClearButton && (
          <Pressable
            accessibilityLabel="Clear input"
            accessibilityRole="button"
            disabled={disabled || !onClear}
            onPress={onClear}
            className="items-center justify-center w-6 h-6"
          >
            <ClearIcon colorClass={iconColorClass} />
          </Pressable>
        )}
      </View>

      {/* Helper */}
      <Text className={clsx("min-h-[18px] font-condensed text-body3", helperColorClass)}>
        {errorText ?? helperText ?? ""}
      </Text>
    </View>
  );
}