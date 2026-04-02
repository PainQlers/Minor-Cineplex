import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";

const noop = () => {};

interface AppTagProps {
  disabled?: boolean;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: (selected: boolean) => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppTag({
  disabled = false,
  label,
  labelStyle,
  onPress = noop,
  selected = false,
  style,
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
      style={[
        styles.tag,
        selected && styles.selectedTag,
        disabled && styles.disabledTag,
        style,
      ]}
    >
      <Text
        style={[
          TYPOGRAPHY.body3,
          selected ? styles.labelSelected : styles.labelUnselected,
          disabled && styles.labelDisabled,
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabledTag: {
    opacity: 0.5,
  },
  labelDisabled: {
    color: COLORS.text.muted,
  },
  labelSelected: {
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  labelUnselected: {
    color: COLORS.text.muted,
    fontWeight: "400",
  },
  selectedTag: {
    backgroundColor: COLORS.base.gray100,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: COLORS.base.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
});
