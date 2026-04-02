import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";

const noop = () => {};

export interface AppTextAreaProps
  extends Omit<
    TextInputProps,
    "editable" | "multiline" | "onChangeText" | "placeholder" | "style" | "value"
  > {
  active?: boolean;
  disabled?: boolean;
  height?: number;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  showResizeHandle?: boolean;
  style?: StyleProp<ViewStyle>;
  value?: string;
}

function ResizeHandle({ color }: { color: string }) {
  return (
    <View style={styles.handle}>
      <View style={[styles.handleLineLarge, { backgroundColor: color }]} />
      <View style={[styles.handleLineSmall, { backgroundColor: color }]} />
    </View>
  );
}

export function AppTextArea({
  active = false,
  autoCapitalize = "sentences",
  disabled = false,
  height = 102,
  inputStyle,
  label,
  labelStyle,
  onBlur,
  onChangeText = noop,
  onFocus,
  placeholder = "Placeholder Text",
  showResizeHandle = true,
  style,
  value,
  ...textInputProps
}: AppTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = Boolean(value && value.length > 0);
  const isActive = !disabled && (active || isFocused);

  const borderColor = isActive ? COLORS.base.gray300 : COLORS.base.gray200;
  const textColor = disabled
    ? COLORS.text.muted
    : hasValue
      ? COLORS.text.primary
      : COLORS.text.muted;
  const handleColor = disabled ? COLORS.text.muted : COLORS.base.gray200;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled, style]}>
      <Text style={[TYPOGRAPHY.body1Regular, styles.label, labelStyle]}>{label}</Text>

      <View style={[styles.field, { borderColor, height }]}>
        <TextInput
          {...textInputProps}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.muted}
          selectionColor={COLORS.text.primary}
          style={[TYPOGRAPHY.body1Regular, styles.input, { color: textColor }, inputStyle]}
          textAlignVertical="top"
          value={value}
        />

        {showResizeHandle ? <ResizeHandle color={handleColor} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
  field: {
    backgroundColor: COLORS.surface.panel,
    borderRadius: 4,
    borderWidth: 1,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 2,
    paddingTop: 8,
    position: "relative",
    width: "100%",
  },
  handle: {
    bottom: 2,
    height: 20,
    position: "absolute",
    right: 2,
    width: 20,
  },
  handleLineLarge: {
    height: 2,
    left: 2,
    position: "absolute",
    top: 9,
    transform: [{ rotate: "-45deg" }],
    width: 16,
  },
  handleLineSmall: {
    height: 2,
    left: 10,
    position: "absolute",
    top: 9,
    transform: [{ rotate: "-45deg" }],
    width: 8,
  },
  input: {
    flex: 1,
    paddingBottom: 24,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  label: {
    color: COLORS.text.secondary,
  },
  wrapper: {
    gap: 4,
    width: "100%",
  },
});
