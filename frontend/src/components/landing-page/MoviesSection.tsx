import { Text, View, FlatList } from "react-native";

import { AppTabs } from "@/components/ui/tab";
import { AppPagination } from "@/components/ui/pagination";
import { MovieCard } from "@/components/landing-page/MoiveCard";
import { Movie } from "@/types/movie";
import { useMemo, useEffect, useState } from "react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const MOVIES_PER_PAGE = 4;

export function MoviesSection() {
  const [activeTab, setActiveTab] = useState("now-showing");
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setError("");

        if (!API_BASE_URL) {
          throw new Error("API base URL is undefined");
        }

        const response = await fetch(`${API_BASE_URL}/movies`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("movies:", data);
        setMovies(data);
      } catch (err) {
        console.error("loadMovies error:", err);
        setError("can't connect to server");
      }
    };

    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    const today = new Date();
    const todayTime = today.getTime();

    return movies.filter((movie) => {
      if (!movie.show_date) return false;

      const showDate = new Date(movie.show_date);

      if (activeTab === "now-showing") {
        return showDate <= today;
      }

      return showDate > today;
    }).sort((a, b) => {
      const dateA = new Date(a.show_date!).getTime();
      const dateB = new Date(b.show_date!).getTime();
      const diffA = Math.abs(dateA - todayTime);
      const diffB = Math.abs(dateB - todayTime);
      
      return diffA - diffB; // sort by closest to today
    });
  }, [movies, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / MOVIES_PER_PAGE));

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;

    return filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [filteredMovies, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, movies]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <View className="gap-8 px-0 pt-8">
      <AppTabs
        items={[
          { key: "now-showing", label: "Now Showing" },
          { key: "coming-soon", label: "Coming Soon" },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      />

      {!!error && <Text className="text-red-500">{error}</Text>}

      <FlatList
        data={paginatedMovies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text className="text-white">No movies found</Text>
        }
      />

      {filteredMovies.length > MOVIES_PER_PAGE && (
        <View className="items-center">
          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            variant="minimal"
            onPageChange={setCurrentPage}
          />
        </View>
      )}
    </View>
  );
}
