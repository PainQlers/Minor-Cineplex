import { Text, View } from "react-native";

import { Movie } from "@/types/movie";

import { formatReleaseDate, getMovieTags } from "@/lib/utils/movie-detail.utils";

type MovieDetailOverviewProps = {
  movie: Movie;
};

export function MovieDetailOverview({ movie }: MovieDetailOverviewProps) {
  const movieTags = getMovieTags(movie);

  return (
    <View className="-mt-28 px-4">
      <View className="gap-5">
        <View className="gap-4">
          <Text className="font-condensedBold text-[44px] leading-[50px] text-white">
            {movie.title}
          </Text>

          <View className="flex-row flex-wrap items-center gap-2">
            {movieTags.map((tag) => (
              <View key={tag} className="rounded bg-[#21263F] px-3 py-1.5">
                <Text className="font-condensed text-body2regular text-[#8B93B0]">
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text className="font-condensed text-body1regular text-[#C8CEDD]">
            {formatReleaseDate(movie.show_date)}
          </Text>
        </View>

        <View className="gap-4">
          <View className="self-start rounded bg-[#4E7BEE] px-5 py-3">
            <Text className="font-condensedBold text-body1medium text-white">
              Movie detail
            </Text>
          </View>

          <Text className="font-condensed text-body1regular leading-7 text-[#C8CEDD]">
            {movie.description || "No synopsis available."}
          </Text>
        </View>
      </View>
    </View>
  );
}
