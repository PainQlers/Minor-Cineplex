import {
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

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
      <Text className="text-base font-bold" style={[styles.label, preset.labelStyle]}>
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
  label: {
    fontSize: 16,
  },
});
