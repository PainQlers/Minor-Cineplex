import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import DoneRoundLightIcon from "@/assets/icons/done_round_light.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";

const noop = () => {};

export type AppStepStatus = "active" | "complete" | "inactive";

export interface AppStepProps {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  status?: AppStepStatus;
  stepNumber?: number | string;
  style?: StyleProp<ViewStyle>;
}

export interface AppStepItem {
  key: string;
  label: string;
  status?: AppStepStatus;
  stepNumber?: number | string;
}

export interface AppStepsProps {
  items: AppStepItem[];
  style?: StyleProp<ViewStyle>;
}

const INDICATOR_STYLES: Record<AppStepStatus, ViewStyle> = {
  active: {
    backgroundColor: COLORS.brand.blue100,
  },
  complete: {
    backgroundColor: COLORS.brand.blue200,
  },
  inactive: {
    backgroundColor: "transparent",
    borderColor: COLORS.surface.panel,
    borderWidth: 1,
  },
};

export function AppStep({
  label,
  labelStyle,
  onPress = noop,
  status = "inactive",
  stepNumber = 1,
  style,
}: AppStepProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={onPress === noop}
      onPress={onPress}
      style={[styles.step, style]}
    >
      <View style={[styles.indicator, INDICATOR_STYLES[status]]}>
        {status === "complete" ? (
          <AppIcon icon={DoneRoundLightIcon} size={28} />
        ) : (
          <Text style={[TYPOGRAPHY.headline4, styles.stepNumber]}>{stepNumber}</Text>
        )}
      </View>

      <Text style={[TYPOGRAPHY.body1Regular, styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}

export function AppSteps({ items, style }: AppStepsProps) {
  return (
    <View style={[styles.steps, style]}>
      {items.map((item, index) => (
        <AppStep
          key={item.key}
          label={item.label}
          status={item.status}
          stepNumber={item.stepNumber ?? index + 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    alignItems: "center",
    borderRadius: 99,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  label: {
    color: COLORS.text.primary,
    textAlign: "center",
  },
  step: {
    alignItems: "center",
    gap: 6,
    width: 140,
  },
  stepNumber: {
    color: COLORS.text.primary,
    textAlign: "center",
  },
  steps: {
    flexDirection: "row",
    gap: 25,
  },
});
