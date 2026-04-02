import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import clsx from "clsx";

const noop = () => {};

export interface AppTextAreaProps {
  active?: boolean;
  disabled?: boolean;
  height?: number;
  label: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  showResizeHandle?: boolean;
  value?: string;
  className?: string;
}

function ResizeHandle({ colorClass }: { colorClass: string }) {
  return (
    <View className="absolute bottom-[2px] right-[2px] w-5 h-5">
      <View
        className={clsx(
          "absolute left-[2px] top-[9px] h-[2px] w-[16px] -rotate-45",
          colorClass
        )}
      />
      <View
        className={clsx(
          "absolute left-[10px] top-[9px] h-[2px] w-[8px] -rotate-45",
          colorClass
        )}
      />
    </View>
  );
}

export function AppTextArea({
  active = false,
  disabled = false,
  height = 102,
  label,
  onChangeText = noop,
  placeholder = "Placeholder Text",
  showResizeHandle = true,
  value,
  className,
}: AppTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = Boolean(value && value.length > 0);
  const isActive = !disabled && (active || isFocused);

  const borderClass = isActive
    ? "border-base-gray300"
    : "border-base-gray200";

  const textColorClass = disabled
    ? "text-text-muted"
    : hasValue
      ? "text-text-primary"
      : "text-text-muted";

  const handleColorClass = disabled
    ? "bg-text-muted"
    : "bg-base-gray200";

  return (
    <View className={clsx("w-full gap-1", disabled && "opacity-40", className)}>
      {/* Label */}
      <Text className="text-text-secondary font-condensed text-body1">
        {label}
      </Text>

      {/* Field */}
      <View
        className={clsx(
          "relative w-full bg-surface-panel border rounded px-2 pt-2 pb-[2px]",
          borderClass
        )}
        style={{ height }}
      >
        <TextInput
          editable={!disabled}
          multiline
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8B93B0"
          selectionColor="#FFFFFF"
          textAlignVertical="top"
          className={clsx(
            "flex-1 pb-6 font-condensed text-body1",
            textColorClass
          )}
          value={value}
        />

        {showResizeHandle && (
          <ResizeHandle colorClass={handleColorClass} />
        )}
      </View>
    </View>
  );
}