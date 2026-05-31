import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";

import { CityPickerModal } from "@/components/movies-detail/CityPickerModal";
import {
  MovieDetailError,
  MovieDetailLoading,
} from "@/components/movies-detail/MovieDetailState";
import { MovieDetailHero } from "@/components/movies-detail/MovieDetailHero";
import { MovieDetailOverview } from "@/components/movies-detail/MovieDetailOverview";
import { ShowtimeDateSelector } from "@/components/movies-detail/ShowtimeDateSelector";
import { ShowtimeFilters } from "@/components/movies-detail/ShowtimeFilters";
import { TheaterShowtimeList } from "@/components/movies-detail/TheaterShowtimeList";
import {
  BANGKOK_CENTER,
  buildTheaterGroups,
  getDateOptions,
  getTheater,
  toDateKey,
} from "@/lib/utils/movie-detail.utils";
import { getMovieById } from "@/services/movie.service";
import { getShowtimesByMovie } from "@/services/showtime.service";
import { GeoPoint } from "@/types/movie-detail";
import { Movie } from "@/types/movie";
import { Showtime } from "@/types/showtime";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));
  const [referenceLocation, setReferenceLocation] =
    useState<GeoPoint>(BANGKOK_CENTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadMovieDetail = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [movieData, movieShowtimes] = await Promise.all([
          getMovieById(id),
          getShowtimesByMovie(id),
        ]);

        if (!isMounted) {
          return;
        }

        setMovie(movieData);
        setShowtimes(movieShowtimes);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error("loadMovieDetail error:", err);
        setError("Unable to load movie detail");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadMovieDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const requestLocation = async () => {
      try {
        const permissionResult =
          await Location.requestForegroundPermissionsAsync();

        if (permissionResult.status !== "granted") {
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) {
          return;
        }

        setReferenceLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch {
        // Bangkok center remains the fallback when device location is unavailable.
      }
    };

    void requestLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const movieShowtimes = useMemo(
    () => showtimes.filter((showtime) => showtime.movie_id === id),
    [id, showtimes],
  );

  const dateOptions = useMemo(
    () => getDateOptions(movieShowtimes),
    [movieShowtimes],
  );

  useEffect(() => {
    if (!dateOptions.length) {
      return;
    }

    const hasSelectedDate = dateOptions.some(
      (dateOption) => dateOption.key === selectedDateKey,
    );

    if (!hasSelectedDate) {
      setSelectedDateKey(dateOptions[0].key);
    }
  }, [dateOptions, selectedDateKey]);

  const cityOptions = useMemo(() => {
    const cities = new Set<string>();

    movieShowtimes.forEach((showtime) => {
      const city = getTheater(showtime)?.locate_part?.trim();

      if (city) {
        cities.add(city);
      }
    });

    return Array.from(cities).sort((cityA, cityB) =>
      cityA.localeCompare(cityB),
    );
  }, [movieShowtimes]);

  const theaterGroups = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredShowtimes = movieShowtimes.filter((showtime) => {
      const theater = getTheater(showtime);

      if (!theater) {
        return false;
      }

      if (toDateKey(showtime.start_time) !== selectedDateKey) {
        return false;
      }

      if (selectedCity && theater.locate_part?.trim() !== selectedCity) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [theater.name, theater.address, theater.locate_part]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch));
    });

    return buildTheaterGroups(filteredShowtimes, referenceLocation).slice(0, 3);
  }, [
    movieShowtimes,
    referenceLocation,
    searchQuery,
    selectedCity,
    selectedDateKey,
  ]);

  const handleSelectCity = (city: string | null) => {
    setSelectedCity(city);
    setIsCityPickerOpen(false);
  };

  const handleSelectShowtime = (showtimeId: string) => {
    router.push(`/booking/${showtimeId}` as any);
  };

  if (loading) {
    return <MovieDetailLoading />;
  }

  if (error || !movie) {
    return <MovieDetailError message={error || "Movie not found"} />;
  }

  return (
    <View className="flex-1 bg-[#101525]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto min-h-screen w-full max-w-[430px] bg-[#101525]">
          <MovieDetailHero posterUrl={movie.poster_url} />
          <MovieDetailOverview movie={movie} />

          <View className="mt-10 gap-6">
            <ShowtimeDateSelector
              dateOptions={dateOptions}
              selectedDateKey={selectedDateKey}
              onSelectDate={setSelectedDateKey}
            />

            <ShowtimeFilters
              searchQuery={searchQuery}
              selectedCity={selectedCity}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery("")}
              onOpenCityPicker={() => setIsCityPickerOpen(true)}
            />

            <TheaterShowtimeList
              groups={theaterGroups}
              selectedDateKey={selectedDateKey}
              onSelectShowtime={handleSelectShowtime}
            />
          </View>
        </View>
      </ScrollView>

      <CityPickerModal
        cities={cityOptions}
        selectedCity={selectedCity}
        visible={isCityPickerOpen}
        onClose={() => setIsCityPickerOpen(false)}
        onSelectCity={handleSelectCity}
      />
    </View>
  );
}
