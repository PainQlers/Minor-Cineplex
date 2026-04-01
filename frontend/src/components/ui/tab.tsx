import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";

const noop = () => {};

export interface AppTabProps {
  active?: boolean;
  disabled?: boolean;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface AppTabItem {
  disabled?: boolean;
  key: string;
  label: string;
}

export interface AppTabsProps {
  items: AppTabItem[];
  onChange?: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  value: string;
}

export function AppTab({
  active = false,
  disabled = false,
  label,
  labelStyle,
  onPress = noop,
  style,
}: AppTabProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.tab, disabled && styles.disabled, style]}
    >
      <Text
        style={[
          TYPOGRAPHY.headline3,
          styles.label,
          { color: active ? COLORS.text.primary : COLORS.text.muted },
          labelStyle,
        ]}
      >
        {label}
      </Text>

      <View style={[styles.indicator, !active && styles.indicatorHidden]} />
    </Pressable>
  );
}

export function AppTabs({ items, onChange = noop, style, value }: AppTabsProps) {
  return (
    <View accessibilityRole="tablist" style={[styles.tabs, style]}>
      {items.map((item) => (
        <AppTab
          active={item.key === value}
          disabled={item.disabled}
          key={item.key}
          label={item.label}
          onPress={() => onChange(item.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
  indicator: {
    alignSelf: "stretch",
    backgroundColor: COLORS.base.gray200,
    height: 1,
  },
  indicatorHidden: {
    opacity: 0,
  },
  label: {
    textAlign: "center",
  },
  tab: {
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabs: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 40,
  },
});
