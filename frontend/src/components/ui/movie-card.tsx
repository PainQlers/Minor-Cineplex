import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/icon";
import StarFillIcon from "@/assets/icons/Star_fill.svg";

export interface MovieCardProps {
  title: string;
  rating: number;
  genres: string[];
  languages: string;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
}

export function MovieCard({
  title,
  rating,
  genres,
  languages,
  imageSource,
  onPress,
}: MovieCardProps) {
  const genresText = genres.join(" • ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className="mb-4 w-[160px]"
    >
      <View className="relative w-full overflow-hidden rounded-lg bg-base-gray100 aspect-[2/3]">
        <Image
          source={imageSource}
          className="h-full w-full"
          resizeMode="cover"
        />

        <View className="absolute left-2 top-2 flex-row flex-wrap gap-1">
          <View className="rounded bg-black/60 px-2 py-0.5">
            <Text className="font-body text-body3 text-base-white">
              {languages}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-2">
        <Text
          numberOfLines={1}
          className="font-condensedMedium text-body1medium text-text-primary"
        >
          {title}
        </Text>

        <View className="mt-1 flex-row items-center gap-1">
          <AppIcon
            icon={StarFillIcon}
            size={12}
            color="#FFD700"
          />
          <Text className="font-body text-body3 text-text-secondary">
            {rating.toFixed(1)}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          className="mt-1 font-body text-body3 text-text-muted"
        >
          {genresText}
        </Text>
      </View>
    </Pressable>
  );
}