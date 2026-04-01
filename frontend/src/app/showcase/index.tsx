import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonShowcase } from "@/components/button-showcase";
import { IconShowcase } from "@/components/icon-showcase";
import { ModalShowcase } from "@/components/modal-showcase";
import { InputShowcase } from "@/components/input-showcase";
import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";

export default function Showcase() {
  return (
      <ScrollView
        className="flex-1 flex-row items-start m-5 gap-3 justify-evenly"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex gap-5">
          <View className="flex flex-row gap-5">
            <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>Buttons</Text>
            <ButtonShowcase />
            </View>
            <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>Modal</Text>
            <ModalShowcase />
            </View>
            <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>Icons</Text>
            <IconShowcase />
            </View>
          </View>
          <View className="flex flex-row gap-5">
            <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>Input Field</Text>
            <InputShowcase />
            </View>
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  screen: {
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.text.primary,
  },
});
