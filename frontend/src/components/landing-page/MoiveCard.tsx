import { Image, Text, View } from "react-native";
import { Movie } from "@/types/movie";
import { AppIcon } from "@/components/ui/icon";
import StarFillIcon from "@/assets/icons/Star_fill.svg";
import { COLORS } from "@/constants/colors";

export function MovieCard({ movie }: { movie: Movie }) {
  const formatDateManual = (dateStr: string): string => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
  };
  const showDate = movie.show_date ? formatDateManual(movie.show_date) : null;
  return (
    <View className="flex-1">
      {!!movie.poster_url && (
        <Image
          source={{ uri: movie.poster_url }}
          className="h-64 w-full rounded-lg bg-neutral-800"
          resizeMode="cover"
        />
      )}
      <View className="flex-row items-center justify-between mt-2">
        {!!showDate && (
          <Text className="text-sm text-neutral-400">{showDate}</Text>
        )}
        <View className="flex-row items-center">
          <AppIcon icon={StarFillIcon} size={18} color={COLORS.brand.blue100} />
          <Text className="text-sm text-neutral-400">{movie.rating}</Text>
        </View>
      </View>

      <Text className="mt-1 text-lg font-semibold text-white">{movie.title}</Text>
    </View>
  );
}