import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

const noop = () => {};

export interface AppTabProps {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  className?: string;
}

export interface AppTabItem {
  disabled?: boolean;
  key: string;
  label: string;
}

export interface AppTabsProps {
  items: AppTabItem[];
  onChange?: (key: string) => void;
  value: string;
  className?: string;
}

export function AppTab({
  active = false,
  disabled = false,
  label,
  onPress = noop,
  className,
}: AppTabProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        "gap-2 px-2 py-1",
        disabled && "opacity-40",
        className
      )}
    >
      <Text
        className={clsx(
          "text-center font-condensedBold text-headline3",
          active ? "text-text-primary" : "text-text-muted"
        )}
      >
        {label}
      </Text>

      <View
        className={clsx(
          "h-[1px] self-stretch bg-base-gray200",
          !active && "opacity-0"
        )}
      />
    </Pressable>
  );
}

export function AppTabs({
  items,
  onChange = noop,
  value,
  className,
}: AppTabsProps) {
  return (
    <View
      accessibilityRole="tablist"
      className={clsx("flex-row items-start gap-10", className)}
    >
      {items.map((item) => (
        <AppTab
          key={item.key}
          label={item.label}
          active={item.key === value}
          disabled={item.disabled}
          onPress={() => onChange(item.key)}
        />
      ))}
    </View>
  );
}