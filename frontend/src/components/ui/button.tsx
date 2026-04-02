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

export type AppButtonVariant = "primary" | "secondary" | "outline" | "link";

interface AppButtonProps {
  disabled?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: AppButtonVariant;
}

const VARIANT_STYLES: Record<
  AppButtonVariant,
  { containerStyle: ViewStyle; labelStyle: TextStyle }
> = {
  link: {
    containerStyle: {},
    labelStyle: {
      color: COLORS.text.primary,
      textDecorationLine: "underline",
    },
  },
  outline: {
    containerStyle: {
      borderColor: COLORS.base.gray300,
      borderWidth: 1,
    },
    labelStyle: {
      color: COLORS.text.primary,
    },
  },
  primary: {
    containerStyle: {
      backgroundColor: COLORS.brand.blue100,
    },
    labelStyle: {
      color: COLORS.text.primary,
    },
  },
  secondary: {
    containerStyle: {
      backgroundColor: COLORS.brand.blue200,
    },
    labelStyle: {
      color: COLORS.text.primary,
    },
  },
};

export function AppButton({
  disabled = false,
  label,
  labelStyle,
  onPress = noop,
  style,
  variant = "primary",
}: AppButtonProps) {
  const currentVariant = VARIANT_STYLES[variant];

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={variant === "link" ? "link" : "button"}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        variant === "link" ? styles.linkButton : styles.boxButton,
        currentVariant.containerStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[TYPOGRAPHY.button, currentVariant.labelStyle, labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  boxButton: {
    borderRadius: 4,
    minHeight: 48,
    minWidth: 123,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  linkButton: {
    alignSelf: "flex-start",
    minHeight: 24,
  },
});
