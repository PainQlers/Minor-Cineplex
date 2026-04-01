import {
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { TYPOGRAPHY } from "../../constants/typography";

const noop = () => {};

export interface ShowcaseButtonPreset {
  containerStyle?: ViewStyle;
  disabled?: boolean;
  labelStyle?: TextStyle;
}

interface ShowcaseButtonProps {
  label: string;
  onPress?: () => void;
  preset: ShowcaseButtonPreset;
}

export function ShowcaseButton({
  label,
  onPress = noop,
  preset,
}: ShowcaseButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={preset.disabled}
      onPress={onPress}
      className="items-center justify-center"
      style={[styles.button, preset.containerStyle]}
    >
      <Text style={[TYPOGRAPHY.button, preset.labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    minHeight: 48,
    minWidth: 123,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
});
