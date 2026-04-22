import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MovieDetailHeroProps = {
  posterUrl?: string | null;
};

export function MovieDetailHero({ posterUrl }: MovieDetailHeroProps) {
  return (
    <View className="relative bg-[#070C1B] pt-20">
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          className="h-[520px] w-full bg-[#070C1B]"
          resizeMode="cover"
        />
      ) : (
        <View className="h-[520px] w-full items-center justify-center bg-[#070C1B]">
          <Ionicons name="film-outline" size={72} color="#565F7E" />
        </View>
      )}

      <View className="absolute bottom-0 left-0 right-0 h-56 bg-black/45" />
    </View>
  );
}
