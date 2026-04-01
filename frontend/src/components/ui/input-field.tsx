import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useState } from "react";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";

const noop = () => {};

export interface AppInputFieldProps
  extends Omit<
    TextInputProps,
    "editable" | "onChangeText" | "placeholder" | "style" | "value"
  > {
  disabled?: boolean;
  errorText?: string;
  helperText?: string;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
  showSearchIcon?: boolean;
  style?: StyleProp<ViewStyle>;
  value?: string;
}

function SearchIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconFrame}>
      <View style={[styles.searchCircle, { borderColor: color }]} />
      <View style={[styles.searchHandle, { backgroundColor: color }]} />
    </View>
  );
}

function ClearIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconFrame}>
      <View style={[styles.clearLine, styles.clearLineLeft, { backgroundColor: color }]} />
      <View style={[styles.clearLine, styles.clearLineRight, { backgroundColor: color }]} />
    </View>
  );
}

export function AppInputField({
  autoCapitalize = "none",
  disabled = false,
  errorText,
  helperText,
  inputStyle,
  label,
  labelStyle,
  onBlur,
  onChangeText = noop,
  onClear,
  onFocus,
  placeholder = "Placeholder Text",
  showClearButton = false,
  showSearchIcon = true,
  style,
  value,
  ...textInputProps
}: AppInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = Boolean(value && value.length > 0);
  const hasError = Boolean(errorText);
  const isActive = !disabled && (isFocused || hasValue);

  const borderColor = hasError
    ? COLORS.semantic.danger
    : isActive
      ? COLORS.base.gray300
      : COLORS.base.gray200;

  const iconColor = disabled
    ? COLORS.text.muted
    : hasError
      ? COLORS.text.primary
      : isActive
        ? COLORS.text.primary
        : COLORS.text.secondary;

  const inputColor = disabled
    ? COLORS.text.muted
    : hasValue
      ? COLORS.text.primary
      : COLORS.text.muted;

  const helperColor = hasError ? COLORS.semantic.danger : COLORS.text.muted;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled, style]}>
      <Text style={[TYPOGRAPHY.body1Regular, styles.label, labelStyle]}>{label}</Text>

      <View
        style={[
          styles.field,
          { borderColor, borderWidth: disabled ? 0 : 1 },
        ]}
      >
        {showSearchIcon ? <SearchIcon color={iconColor} /> : null}

        <TextInput
          {...textInputProps}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
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
          style={[TYPOGRAPHY.body1Regular, styles.input, { color: inputColor }, inputStyle]}
          value={value}
        />

        {showClearButton ? (
          <Pressable
            accessibilityLabel="Clear input"
            accessibilityRole="button"
            disabled={disabled || !onClear}
            onPress={onClear}
            style={styles.clearButton}
          >
            <ClearIcon color={iconColor} />
          </Pressable>
        ) : null}
      </View>

      <Text style={[TYPOGRAPHY.body3, styles.helper, { color: helperColor }]}>
        {errorText ?? helperText ?? ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  clearLine: {
    borderRadius: 999,
    height: 1,
    left: 6,
    position: "absolute",
    top: 11.5,
    width: 12,
  },
  clearLineLeft: {
    transform: [{ rotate: "45deg" }],
  },
  clearLineRight: {
    transform: [{ rotate: "-45deg" }],
  },
  disabled: {
    opacity: 0.4,
  },
  field: {
    alignItems: "center",
    backgroundColor: COLORS.surface.panel,
    borderRadius: 4,
    flexDirection: "row",
    gap: 4,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  helper: {
    minHeight: 18,
  },
  iconFrame: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  input: {
    flex: 1,
    minHeight: 24,
    paddingVertical: 0,
  },
  label: {
    color: COLORS.text.secondary,
  },
  searchCircle: {
    borderRadius: 999,
    borderWidth: 1,
    height: 12,
    left: 5,
    position: "absolute",
    top: 5,
    width: 12,
  },
  searchHandle: {
    borderRadius: 999,
    height: 1,
    left: 16,
    position: "absolute",
    top: 16,
    transform: [{ rotate: "45deg" }],
    width: 4,
  },
  wrapper: {
    gap: 4,
    width: "100%",
  },
});