import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonShowcase } from "@/components/showcase/button-showcase";
import { AlertShowcase } from "@/components/showcase/alert-showcase";
import { IconShowcase } from "@/components/showcase/icon-showcase";
import { ModalShowcase } from "@/components/showcase/modal-showcase";
import { InputShowcase } from "@/components/showcase/input-showcase";
import { TabShowcase } from "@/components/showcase/tab-showcase";
import { TextAreaShowcase } from "@/components/showcase/text-area-showcase";
import { StepShowcase } from "@/components/showcase/step-showcase";
import { MenuLinkShowcase } from "@/components/showcase/menu-link-showcase";
import { CheckboxShowcase } from "@/components/showcase/checkbox-showcase";
import { RadioShowcase } from "@/components/showcase/radio-showcase";
import { TagShowcase } from "@/components/showcase/tag-showcase";
import { PaginationShowcase } from "@/components/showcase/pagination-showcase";
import { NavbarShowcase } from "@/components/showcase/navbar-showcase";
import { MovieShowcase } from "@/components/showcase/movie-showcase";

import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";

export default function Showcase() {
  return (
    <ScrollView
      className="flex-1 items-start m-5 gap-3 justify-evenly"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex gap-5">
        <View className="flex flex-row gap-5">
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Buttons
            </Text>
            <ButtonShowcase />
          </View>
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Modal
            </Text>
            <ModalShowcase />
          </View>
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Icons
            </Text>
            <IconShowcase />
          </View>
        </View>
        <View className="flex flex-row gap-5">
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Input Field
            </Text>
            <InputShowcase />
          </View>
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Text Area
            </Text>
            <TextAreaShowcase />
          </View>
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Tab
            </Text>
            <TabShowcase />
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Step
            </Text>
            <StepShowcase />
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Tag
            </Text>
            <TagShowcase />
          </View>
        </View>
        <View className="flex flex-row gap-5">
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Alert
            </Text>
            <AlertShowcase />
          </View>
          <View>
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Menu Link
            </Text>
            <MenuLinkShowcase />
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Checkbox
            </Text>
            <CheckboxShowcase />
            <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
              Radio
            </Text>
            <RadioShowcase />
          </View>
        </View>
        <View className="flex flex-row gap-5">
          <View>
            <PaginationShowcase />
          </View>
          <View className="flex gap-5">
            <NavbarShowcase />
          </View>
          <View>
          <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
            Movies & Branches (Penpot Exported)
          </Text>
          <MovieShowcase />
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
