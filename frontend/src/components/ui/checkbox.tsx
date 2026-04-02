import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  View,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";

const noop = () => {};

interface AppCheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

const CheckmarkIcon = () => (
  <Text style={{ color: COLORS.text.primary, fontSize: 14, fontWeight: "bold" }}>
    ✓
  </Text>
);

export function AppCheckbox({
  checked = false,
  disabled = false,
  label,
  labelStyle,
  onPress = noop,
  style,
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
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkedCheckbox,
          disabled && styles.disabledCheckbox,
        ]}
      >
        {checked && <CheckmarkIcon />}
      </View>
      {label && (
        <Text
          style={[
            TYPOGRAPHY.body3,
            styles.label,
            checked ? styles.labelChecked : styles.labelUnchecked,
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.base.gray200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkedCheckbox: {
    backgroundColor: COLORS.brand.blue100,
    borderColor: COLORS.brand.blue100,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledCheckbox: {
    opacity: 0.6,
  },
  label: {
    color: COLORS.text.secondary,
  },
  labelChecked: {
    color: COLORS.text.primary,
  },
  labelDisabled: {
    color: COLORS.text.muted,
  },
  labelUnchecked: {
    color: COLORS.text.secondary,
  },
});
