import { Pressable, Text, View } from "react-native";
import clsx from "clsx";
import DoneRoundLightIcon from "@/assets/icons/done_round_light.svg";
import { AppIcon } from "./icon";

const noop = () => {};

export type AppStepStatus = "active" | "complete" | "inactive";

export interface AppStepProps {
  label: string;
  onPress?: () => void;
  status?: AppStepStatus;
  stepNumber?: number | string;
  className?: string;
}

export interface AppStepItem {
  key: string;
  label: string;
  status?: AppStepStatus;
  stepNumber?: number | string;
}

export interface AppStepsProps {
  items: AppStepItem[];
  className?: string;
}

const STATUS_CLASSES: Record<AppStepStatus, string> = {
  active: "bg-brand-blue100",
  complete: "bg-brand-blue200",
  inactive: "bg-transparent border border-surface-panel",
};

export function AppStep({
  label,
  onPress = noop,
  status = "inactive",
  stepNumber = 1,
  className,
}: AppStepProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={onPress === noop}
      onPress={onPress}
      className={clsx("items-center gap-1 w-[140px]", className)}
    >
      {/* Indicator */}
      <View
        className={clsx(
          "w-11 h-11 rounded-full items-center justify-center",
          STATUS_CLASSES[status]
        )}
      >
        {status === "complete" ? (
          <AppIcon icon={DoneRoundLightIcon} size={28} />
        ) : (
          <Text className="text-text-primary font-condensedBold text-headline4">
            {stepNumber}
          </Text>
        )}
      </View>

      {/* Label */}
      <Text className="text-text-primary text-center font-condensed text-body1">
        {label}
      </Text>
    </Pressable>
  );
}

export function AppSteps({ items, className }: AppStepsProps) {
  return (
    <View className={clsx("flex-row gap-[25px]", className)}>
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