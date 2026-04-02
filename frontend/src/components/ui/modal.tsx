import { Modal, Pressable, Text, View } from "react-native";
import clsx from "clsx";

import { AppButton, type AppButtonVariant } from "./button";
import close_round_light from "@/assets/icons/close_round_light.svg";
import { AppIcon } from "@/components/ui/icon";

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
  className?: string;
  title: string;
  visible?: boolean;
}

function ModalCard({
  description,
  onClose,
  primaryAction,
  secondaryAction,
  className,
  title,
}: Omit<AppModalProps, "embedded" | "visible">) {
  return (
    <View
      className={clsx(
        "bg-surface-panel border border-base-gray200 rounded-lg max-w-[343px] w-full",
        "shadow-lg",
        className
      )}
    >
      <View className="gap-4 px-6 py-6">
        {/* Header */}
        <View className="flex-row-reverse items-center justify-between">

          <Pressable
            accessibilityLabel="Close modal"
            accessibilityRole="button"
            disabled={!onClose}
            onPress={onClose ?? noop}
            className={clsx(
              "flex flex-row justify-end w-6 h-6",
              !onClose && "opacity-80"
            )}
          >
            <AppIcon icon={close_round_light} size={24} />
          </Pressable>
          

          <Text className="flex-1 text-center text-text-primary font-condensedBold text-headline4">
            {title}
          </Text>
          
        </View>

        

        {/* Description */}
        {!!description && (
          <Text className="text-text-secondary text-center font-condensed text-body2">
            {description}
          </Text>
        )}

        {/* Actions */}
        <View className="flex-row justify-center gap-4">
          {primaryAction ? (
            <AppButton
              label={primaryAction.label}
              onPress={primaryAction.onPress}
              variant={primaryAction.variant ?? "primary"}
              className="flex-1"
            />
          ) : null}
          {secondaryAction ? (
            <AppButton
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              variant={secondaryAction.variant ?? "outline"}
              className="flex-1"
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
  className,
  title,
  visible = false,
}: AppModalProps) {
  const card = (
    <ModalCard
      description={description}
      onClose={onClose}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
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
      <View className="flex-1 items-center justify-center px-5 bg-black/70">
        {card}
      </View>
    </Modal>
  );
}