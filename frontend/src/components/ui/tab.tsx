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
      className={clsx("gap-2 px-1 py-1", disabled && "opacity-40", className)}
    >
      <Text
        className={clsx(
          "text-sectionTitle font-condensedBold",
          active ? "text-text-primary" : "text-text-muted"
        )}
      >
        {label}
      </Text>

      <View
        className={clsx(
          "h-[2px] self-stretch rounded-full bg-base-white",
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
      className={clsx("flex-row items-start gap-6", className)}
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