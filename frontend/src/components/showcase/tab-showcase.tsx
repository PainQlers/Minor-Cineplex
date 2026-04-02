import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../constants/colors";
import { AppTabs } from "../ui/tab";

const TAB_USAGE = `const [activeTab, setActiveTab] = useState("active");

<AppTabs
  items={[
    { key: "inactive", label: "Inactive Label" },
    { key: "active", label: "Active Label" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>`;

const TAB_ITEMS = [
  { key: "inactive", label: "Inactive Label" },
  { key: "active", label: "Active Label" },
];

export function TabShowcase() {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <View style={styles.section}>
      <Text className="text-gray-400">{TAB_USAGE}</Text>

      <AppTabs items={TAB_ITEMS} onChange={setActiveTab} value={activeTab} />
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
    width: 385,
  },
});
