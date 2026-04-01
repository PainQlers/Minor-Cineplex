import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppButton, type AppButtonVariant } from "./button";

const noop = () => {};

export interface AppModalAction {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
}

export interface AppModalProps {
  description?: string;
  embedded?: boolean;
  onClose?: () => void;
  primaryAction?: AppModalAction;
  secondaryAction?: AppModalAction;
  style?: StyleProp<ViewStyle>;
  title: string;
  visible?: boolean;
}

function ModalCard({
  description,
  onClose,
  primaryAction,
  secondaryAction,
  style,
  title,
}: Omit<AppModalProps, "embedded" | "visible">) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Close modal"
            accessibilityRole="button"
            disabled={!onClose}
            onPress={onClose ?? noop}
            style={[styles.closeButton, !onClose && styles.closeButtonHidden]}
          >
            <Text style={[TYPOGRAPHY.body1Medium, styles.closeIcon]}>X</Text>
          </Pressable>

          <Text style={[TYPOGRAPHY.headline4, styles.title]}>{title}</Text>
        </View>

        {!!description && (
          <Text style={[TYPOGRAPHY.body2Regular, styles.description]}>
            {description}
          </Text>
        )}

        <View style={styles.actions}>
          {secondaryAction ? (
            <AppButton
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              style={styles.actionButton}
              variant={secondaryAction.variant ?? "outline"}
            />
          ) : null}
          {primaryAction ? (
            <AppButton
              label={primaryAction.label}
              onPress={primaryAction.onPress}
              style={styles.actionButton}
              variant={primaryAction.variant ?? "primary"}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function AppModal({
  description,
  embedded = false,
  onClose,
  primaryAction,
  secondaryAction,
  style,
  title,
  visible = false,
}: AppModalProps) {
  const card = (
    <ModalCard
      description={description}
      onClose={onClose}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      style={style}
      title={title}
    />
  );

  if (embedded) {
    return card;
  }

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose ?? noop}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>{card}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    minWidth: 0,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  card: {
    backgroundColor: COLORS.surface.panel,
    borderColor: COLORS.base.gray200,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 343,
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    width: "100%",
  },
  closeButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  closeButtonHidden: {
    opacity: 0,
  },
  closeIcon: {
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  content: {
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  description: {
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(7, 12, 27, 0.7)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: COLORS.text.primary,
    flex: 1,
  },
});
