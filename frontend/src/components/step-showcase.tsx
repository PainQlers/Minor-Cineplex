import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import { AppSteps } from "./ui/step";

const STEP_USAGE = `<AppSteps
  items={[
    { key: "done", label: "Text", status: "complete" },
    { key: "active", label: "Text", status: "active", stepNumber: 1 },
    { key: "inactive", label: "Text", status: "inactive", stepNumber: 1 },
  ]}
/>`;

const STEP_ITEMS = [
  { key: "done", label: "Text", status: "complete" as const },
  { key: "active", label: "Text", status: "active" as const, stepNumber: 1 },
  { key: "inactive", label: "Text", status: "inactive" as const, stepNumber: 1 },
];

export function StepShowcase() {
  return (
    <View style={styles.section}>
      <Text className="text-gray-400">{STEP_USAGE}</Text>

      <View style={styles.preview}>
        <AppSteps items={STEP_ITEMS} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: "center",
  },
  section: {
    borderColor: COLORS.base.gray300,
    borderRadius: 20,
    borderWidth: 2,
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: 510,
  },
});
