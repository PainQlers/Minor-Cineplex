import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import { AppAlert } from "./ui/alert";

const ALERT_USAGE = `<AppAlert
  title="Attention needed"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar."
  variant="danger"
/>\n
<AppAlert
  title="Attention needed"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar."
  variant="success"
/>`;

export function AlertShowcase() {
  return (
    <View style={styles.section}>
      <Text className="text-gray-400">{ALERT_USAGE}</Text>

      <View style={styles.stack}>
        <AppAlert
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar."
          title="Attention needed"
          variant="danger"
        />
        <AppAlert
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar."
          title="Attention needed"
          variant="success"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderColor: COLORS.base.gray300,
    borderRadius: 20,
    borderWidth: 2,
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: 520,
  },
  stack: {
    gap: 20,
    width: "100%",
  },
});
