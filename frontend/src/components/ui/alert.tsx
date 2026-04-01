import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import CloseRoundLightIcon from "@/assets/icons/close_round_light.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";

const noop = () => {};

export type AppAlertVariant = "danger" | "success";

export interface AppAlertProps {
  description?: string;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  title: string;
  variant?: AppAlertVariant;
}

const VARIANT_STYLES: Record<AppAlertVariant, ViewStyle> = {
  danger: {
    backgroundColor: "#E5364B99",
  },
  success: {
    backgroundColor: "#00A37299",
  },
};

export function AppAlert({
  description,
  onClose = noop,
  style,
  title,
  variant = "danger",
}: AppAlertProps) {
  return (
    <View style={[styles.container, VARIANT_STYLES[variant], style]}>
      <Pressable
        accessibilityLabel="Close alert"
        accessibilityRole="button"
        onPress={onClose}
        style={styles.closeButton}
      >
        <AppIcon icon={CloseRoundLightIcon} size={24} />
      </Pressable>

      <View style={styles.content}>
        <Text style={[TYPOGRAPHY.body1Medium, styles.title]}>{title}</Text>

        {!!description && (
          <Text style={[TYPOGRAPHY.body2Regular, styles.description]}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  container: {
    borderRadius: 4,
    columnGap: 12,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  description: {
    color: COLORS.text.primary,
  },
  title: {
    color: COLORS.text.primary,
  },
});
