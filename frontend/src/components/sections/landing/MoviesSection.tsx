import { Text, View } from "react-native";
import { useState } from "react";

import { AppTabs } from "@/components/ui/tab";

export function MoviesSection() {
  const [activeTab, setActiveTab] = useState("now-showing");
  return (
    <View className="px-0 pt-8 gap-8">
      <AppTabs
        items={[
          { key: "now-showing", label: "Now Showing" },
          { key: "coming-soon", label: "Coming Soon" },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      />
    </View>
  );
}