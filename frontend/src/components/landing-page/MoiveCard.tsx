import { Image, Text, View } from "react-native";
import { Movie } from "@/types/movie";

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

      {!!showDate && (
        <Text className="mt-2 text-sm text-neutral-400">{showDate}</Text>
      )}

      <Text className="mt-1 text-lg font-semibold text-white">{movie.title}</Text>
    </View>
  );
}