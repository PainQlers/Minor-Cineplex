import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

import { AppButton } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icon";

interface SearchSelectFieldProps {
  label: string;
  icon?: "chevron-down" | "calendar-outline";
  className?: string;
  onPress?: () => void;
}

interface SearchPanelProps {
  className?: string;
  onMoviePress?: () => void;
  onLanguagePress?: () => void;
  onGenrePress?: () => void;
  onCityPress?: () => void;
  onReleaseDatePress?: () => void;
  onSubmit?: () => void;
}

function SearchSelectField({
  label,
  icon = "chevron-down",
  className,
  onPress,
}: SearchSelectFieldProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={clsx(
        "h-12 flex-row items-center justify-between rounded border border-base-gray200 bg-base-gray100 px-4",
        className
      )}
    >
      <Text className="font-condensed text-body1regular text-base-gray300">
        {label}
      </Text>

      <AppIcon size={18}>
        <Ionicons
          name={icon}
          size={18}
          color="#C8CEDD"
        />
      </AppIcon>
    </Pressable>
  );
}

export function SearchPanel({
  className,
  onMoviePress,
  onLanguagePress,
  onGenrePress,
  onCityPress,
  onReleaseDatePress,
  onSubmit,
}: SearchPanelProps) {
  return (
    <View
      className={clsx(
        "mt-6 rounded bg-base-gray0 px-4 py-4 shadow-lg",
        className
      )}
    >
      <View className="gap-3">
        <SearchSelectField
          label="Movie"
          onPress={onMoviePress}
        />

        <View className="flex-row gap-3">
          <SearchSelectField
            label="Language"
            className="flex-1"
            onPress={onLanguagePress}
          />
          <SearchSelectField
            label="Genre"
            className="flex-1"
            onPress={onGenrePress}
          />
        </View>

        <View className="flex-row gap-3">
          <SearchSelectField
            label="City"
            className="flex-1"
            onPress={onCityPress}
          />
          <SearchSelectField
            label="Release date"
            icon="calendar-outline"
            className="flex-1"
            onPress={onReleaseDatePress}
          />
        </View>

        <View className="items-center pt-1">
          <AppButton
            label=""
            onPress={onSubmit}
            className="min-h-12 min-w-[60px] rounded px-6 py-3"
            labelClassName="hidden"
          />
          <View className="-mt-9 pointer-events-none">
            <AppIcon size={18}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#FFFFFF"
              />
            </AppIcon>
          </View>
        </View>
      </View>
    </View>
  );
}