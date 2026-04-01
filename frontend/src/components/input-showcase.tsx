import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { AppInputField } from "./ui/input-field";

const QUICK_USE = `<AppInputField
  label="Label"
  placeholder="Placeholder Text"
  helperText="Help text goes here"
/>`;

const ADVANCED_USE = `<AppInputField
  label="Label"
  value={search}
  onChangeText={setSearch}
  onClear={() => setSearch("")}
  errorText={hasError ? "Help text goes here" : undefined}
/>`;

export function InputShowcase() {
  return (
    <View style={styles.section}>
        <View>
        <Text className="text-gray-400">{QUICK_USE}</Text>
        <Text className="text-white mt-4">
          Use `helperText` for normal guidance and switch to `errorText` when the
        field should show a validation error.
        </Text>
        <Text className="text-gray-400 mt-4">
            {ADVANCED_USE}
        </Text>
        </View>
      <View style={styles.previewWrap}>
        <View style={styles.stack}>
          <AppInputField
            helperText="Help text goes here"
            label="Label"
            placeholder="Placeholder Text"
            showClearButton
          />
          <AppInputField
            helperText="Help text goes here"
            label="Label"
            onClear={() => {}}
            showClearButton
            value="Placeholder Text"
          />
          <AppInputField
            errorText="Help text goes here"
            label="Label"
            onClear={() => {}}
            showClearButton
            value="Placeholder Text"
          />
          <AppInputField
            disabled
            helperText="Help text goes here"
            label="Label"
            placeholder="Placeholder Text"
            showClearButton
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  codeBlock: {

    borderColor: COLORS.base.gray200,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  codeText: {
    color: COLORS.text.primary,
  },
  noteText: {
    color: COLORS.text.secondary,
  },
  previewWrap: {
    alignItems: "center",
  },
  section: {
    borderColor: COLORS.base.gray300,
    borderRadius: 20,
    borderWidth: 2,
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  stack: {
    gap: 16,
    maxWidth: 241,
    width: "100%",
  },
});