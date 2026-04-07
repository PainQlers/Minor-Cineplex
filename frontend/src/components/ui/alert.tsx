import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

import CloseRoundLightIcon from "@/assets/icons/close_round_light.svg";
import { AppIcon } from "./icon";

const noop = () => {};

export type AppAlertVariant = "danger" | "success";

export interface AppAlertProps {
  description?: string;
  onClose?: () => void;
  title: string;
  variant?: AppAlertVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<AppAlertVariant, string> = {
  danger: "bg-[#E5364B99]",
  success: "bg-[#00A37299]",
};

export function AppAlert({
  description,
  onClose = noop,
  title,
  variant = "danger",
  className,
}: AppAlertProps) {
  return (
    <View
      className={clsx(
        "flex-row w-full rounded px-4 py-4 gap-3",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {/* Content */}
      <View className="flex-1 gap-1">
        <Text className="text-text-primary font-condensedMedium text-body1medium">
          {title}
        </Text>

        {!!description && (
          <Text className="text-text-primary font-condensed text-body2regular">
            {description}
          </Text>
        )}
      </View>

      {/* Close Button */}
      <Pressable
        accessibilityLabel="Close alert"
        accessibilityRole="button"
        onPress={onClose}
        className="items-center justify-center w-6 h-6"
      >
        <AppIcon icon={CloseRoundLightIcon} size={24} />
      </Pressable>
    </View>
  );
}