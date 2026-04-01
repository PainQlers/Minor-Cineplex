import { Pressable, StyleSheet, Text, type TextStyle } from "react-native";

import { TYPOGRAPHY } from "../../constants/typography";

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
      <Text style={[TYPOGRAPHY.button, styles.label, preset.labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    textDecorationLine: "underline",
  },
});
