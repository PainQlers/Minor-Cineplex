import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppTextArea } from "../ui/text-area";

const TEXT_AREA_USAGE = `<AppTextArea
  label="Text Area Label"
  placeholder="Placeholder Text"
/>`;

const TEXT_AREA_CONTROLLED_USAGE = `<AppTextArea
  label="Text Area Label"
  value={message}
  onChangeText={setMessage}
/>`;

export function TextAreaShowcase() {
  return (
    <View style={styles.section}>
      <View>
        <Text className="text-gray-400">{TEXT_AREA_USAGE}</Text>
        <Text className="text-gray-400 mt-4">{TEXT_AREA_CONTROLLED_USAGE}</Text>
      </View>

      <View style={styles.stack}>
        <AppTextArea label="Text Area Label" placeholder="Placeholder Text" />
        <AppTextArea active label="Text Area Label" placeholder="Placeholder Text" />
        <AppTextArea label="Text Area Label" value="Placeholder Text" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderColor: COLORS.base.gray300,
    borderRadius: 20,
    borderWidth: 2,
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: 383,
  },
  stack: {
    gap: 16,
    width: "100%",
  },
});
