import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import { AppModal } from "./ui/modal";

export function ModalShowcase() {
  return (
    <View>
      <View>
        <Text className="text-gray-400">
          {" "}
          {`<AppModal
          visible
          title="Modal Title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          primaryAction={{ label: "Reserve Seat", variant: "secondary" }}
          secondaryAction={{ label: "Cancel", variant: "outline" }}
        />`}{" "}
        </Text>
        <AppModal
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar."
          embedded
          primaryAction={{ label: "Reserve Seat", variant: "secondary" }}
          secondaryAction={{ label: "Cancel", variant: "outline" }}
          title="Modal Title"
        />
      </View>
    </View>
  );
}
