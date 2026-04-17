import { Modal, Pressable, Text, View } from "react-native";

import closeRoundLight from "@/assets/icons/close_round_light.svg";
import PinFillIcon from "@/assets/icons/pin_fill.svg";
import { AppIcon } from "@/components/ui/icon";

const noop = () => {};

interface LocationPermissionPromptProps {
  origin?: string;
  onAllowThisTime?: () => void;
  onAllowWhileVisiting?: () => void;
  onClose?: () => void;
  onDeny?: () => void;
  permissionLabel?: string;
  visible?: boolean;
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className="min-h-12 items-center justify-center rounded-full bg-[#323237] px-5 py-3"
      onPress={onPress ?? noop}
    >
      <Text className="text-center font-condensed text-body1medium text-text-secondary">
        {label}
      </Text>
    </Pressable>
  );
}

export function LocationPermissionPrompt({
  origin = "www.minorcineplex.com",
  onAllowThisTime,
  onAllowWhileVisiting,
  onClose,
  onDeny,
  permissionLabel = "Know your location",
  visible = false,
}: LocationPermissionPromptProps) {
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
      <View className="flex-1 justify-start bg-black/60 px-4 pt-10">
        <View className="w-full max-w-[360px] self-center rounded-[16px] border bg-[#1A1B20] px-6 pb-5 pt-6">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1">
              <Text className="font-condensed text-headline3 text-text-primary">
                {origin}
              </Text>
              <Text className="font-condensed text-headline3 text-text-primary">
                wants to
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Close permission prompt"
              accessibilityRole="button"
              className="h-6 w-6 items-center justify-center"
              onPress={onClose ?? noop}
            >
              <AppIcon icon={closeRoundLight} color="#C8CEDD" size={26} />
            </Pressable>
          </View>

          <View className="mt-7 flex-row items-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full">
              <AppIcon icon={PinFillIcon} color="#C8CEDD" size={36} />
            </View>
            <Text className="font-condensed text-headline4 text-text-secondary">
              {permissionLabel}
            </Text>
          </View>

          <View className="mt-8 gap-3">
            <ActionButton
              label="Allow while visiting the site"
              onPress={onAllowWhileVisiting}
            />
            <ActionButton label="Allow this time" onPress={onAllowThisTime} />
            <ActionButton label="Never allow" onPress={onDeny} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
