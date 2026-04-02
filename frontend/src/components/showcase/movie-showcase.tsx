import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { MovieCard } from "../ui/movie-card";
import { SectionHeader } from "../ui/section-header";
import { BranchCard } from "../ui/branch-card";

const SAMPLE_MOVIES = [
  {
    id: "1",
    title: "Dune: Part Two",
    rating: 4.6,
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: "TH/EN",
    imageUrl: "https://image.tmdb.org/t/p/w500/8bBih8spZBTNi7vSpsBvVvPOpKi.jpg",
  },
  {
    id: "2",
    title: "The Batman",
    rating: 4.5,
    genres: ["Action", "Crime", "Drama"],
    languages: "TH/EN",
    imageUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36FpoO3p2ol9ArbHss.jpg",
  },
];

const SAMPLE_BRANCHES = [
  {
    id: "1",
    name: "Siam Paragon Cineplex",
    distance: "3.34 km",
    address: "991 Rama I Rd, Pathum Wan, Bangkok",
  },
  {
    id: "2",
    name: "Quartier CineArt",
    distance: "5.12 km",
    address: "622 Sukhumvit Rd, Khlong Tan, Khlong Toei, Bangkok",
  },
];

export function MovieShowcase() {
  return (
    <View className="w-full rounded-[20px] border-2 px-4 py-8 self-center" style={styles.matrixCard}>
      <View className="mb-8">
        <SectionHeader title="Now Showing" />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          {SAMPLE_MOVIES.map((movie) => (
            <MovieCard 
              key={movie.id}
              title={movie.title}
              rating={movie.rating}
              genres={movie.genres}
              languages={movie.languages}
              imageUrl={movie.imageUrl}
            />
          ))}
        </ScrollView>
      </View>

      <View>
        <SectionHeader title="Nearby Cinemas" />
        <View>
          {SAMPLE_BRANCHES.map((branch) => (
            <BranchCard 
              key={branch.id}
              name={branch.name}
              distance={branch.distance}
              address={branch.address}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  matrixCard: {
    borderColor: COLORS.base.gray300,
    maxWidth: 547,
    width: "100%",
    backgroundColor: COLORS.base.gray0,
  },
});
