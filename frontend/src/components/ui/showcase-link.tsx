import { Pressable, StyleSheet, Text, type TextStyle } from "react-native";

const noop = () => {};

export interface ShowcaseLinkPreset {
  disabled?: boolean;
  labelStyle?: TextStyle;
}

interface ShowcaseLinkProps {
  label: string;
  onPress?: () => void;
  preset: ShowcaseLinkPreset;
}

export function ShowcaseLink({
  label,
  onPress = noop,
  preset,
}: ShowcaseLinkProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="link"
      disabled={preset.disabled}
      onPress={onPress}
      className="min-h-6 items-end justify-center self-end"
    >
      <Text className="text-base font-bold" style={[styles.label, preset.labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
