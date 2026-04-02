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

const noop = () => {};

interface AppRadioProps {
  disabled?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: (selected: boolean) => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppRadio({
  disabled = false,
  label,
  labelStyle,
  onPress = noop,
  selected = false,
  style,
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
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <View
        style={[
          styles.radio,
          selected && styles.selectedRadio,
          disabled && styles.disabledRadio,
        ]}
      >
        {selected && <View style={styles.dot} />}
      </View>
      {label && (
        <Text
          style={[
            TYPOGRAPHY.body3,
            styles.label,
            selected ? styles.labelSelected : styles.labelUnselected,
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
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledRadio: {
    opacity: 0.6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand.blue100,
  },
  label: {
    color: COLORS.text.secondary,
  },
  labelDisabled: {
    color: COLORS.text.muted,
  },
  labelSelected: {
    color: COLORS.text.primary,
  },
  labelUnselected: {
    color: COLORS.text.secondary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.base.gray200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedRadio: {
    borderWidth: 3,
    borderColor: COLORS.brand.blue100,
  },
});
