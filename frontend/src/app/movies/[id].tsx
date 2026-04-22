import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getMovieById } from "@/services/movie.service";
import { getUpcomingShowtimes } from "@/services/showtime.service";
import { Movie } from "@/types/movie";
import { Showtime } from "@/types/showtime";
import { Theater } from "@/types/theater";

const EARTH_RADIUS_KM = 6371;
const BANGKOK_CENTER: GeoPoint = { lat: 13.7563, lng: 100.5018 };

type GeoPoint = {
  lat: number;
  lng: number;
};

type DateOption = {
  key: string;
  day: string;
  label: string;
};

type HallGroup = {
  hallName: string;
  showtimes: Showtime[];
};

type TheaterShowtimeGroup = {
  theater: Theater;
  distanceKm: number | null;
  halls: HallGroup[];
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceInKm(from: GeoPoint, to: GeoPoint) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

function extractCoordinatesFromMapUrl(mapUrl?: string | null): GeoPoint | null {
  if (!mapUrl) {
    return null;
  }

  const directMatch = mapUrl.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);

  if (directMatch) {
    return {
      lat: Number(directMatch[1]),
      lng: Number(directMatch[2]),
    };
  }

  const atMatch = mapUrl.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (atMatch) {
    return {
      lat: Number(atMatch[1]),
      lng: Number(atMatch[2]),
    };
  }

  try {
    const parsed = new URL(mapUrl);
    const coordinateText = parsed.searchParams.get("q") ?? parsed.searchParams.get("query");
    const qMatch = coordinateText?.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

    if (!qMatch) {
      return null;
    }

    return {
      lat: Number(qMatch[1]),
      lng: Number(qMatch[2]),
    };
  } catch {
    return null;
  }
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function toDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
    date.getDate()
  )}`;
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDateOptions(): DateOption[] {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const key = toDateKey(date);

    return {
      key,
      day:
        index === 0
          ? "Today"
          : date.toLocaleDateString("en-US", { weekday: "short" }),
      label: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  });
}

function formatShowtime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatReleaseDate(value?: string | null) {
  if (!value) {
    return "Release date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return `Release date: ${value}`;
  }

  return `Release date: ${new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

function getMovieTags(movie: Movie) {
  const genreTags =
    movie.genre
      ?.split(/[,/|]/)
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];

  return [...genreTags, movie.rating].filter(Boolean).slice(0, 5) as string[];
}

function getTheater(showtime: Showtime) {
  return showtime.halls?.theaters ?? null;
}

function getTheaterDistance(theater: Theater, referenceLocation: GeoPoint) {
  const coordinates = extractCoordinatesFromMapUrl(theater.google_map_url);

  if (!coordinates) {
    return null;
  }

  return getDistanceInKm(referenceLocation, coordinates);
}

function buildTheaterGroups(
  showtimes: Showtime[],
  referenceLocation: GeoPoint
): TheaterShowtimeGroup[] {
  const byTheater = new Map<string, TheaterShowtimeGroup>();

  showtimes.forEach((showtime) => {
    const theater = getTheater(showtime);

    if (!theater) {
      return;
    }

    const currentGroup =
      byTheater.get(theater.id) ??
      ({
        theater,
        distanceKm: getTheaterDistance(theater, referenceLocation),
        halls: [],
      } satisfies TheaterShowtimeGroup);

    const hallName = showtime.halls?.name?.trim() || "Hall";
    const currentHall =
      currentGroup.halls.find((hall) => hall.hallName === hallName) ??
      ({
        hallName,
        showtimes: [],
      } satisfies HallGroup);

    currentHall.showtimes.push(showtime);

    if (!currentGroup.halls.includes(currentHall)) {
      currentGroup.halls.push(currentHall);
    }

    byTheater.set(theater.id, currentGroup);
  });

  return Array.from(byTheater.values())
    .map((group) => ({
      ...group,
      halls: group.halls
        .map((hall) => ({
          ...hall,
          showtimes: hall.showtimes.sort(
            (showtimeA, showtimeB) =>
              new Date(showtimeA.start_time).getTime() -
              new Date(showtimeB.start_time).getTime()
          ),
        }))
        .sort((hallA, hallB) => hallA.hallName.localeCompare(hallB.hallName)),
    }))
    .sort((groupA, groupB) => {
      if (groupA.distanceKm === null && groupB.distanceKm === null) {
        return groupA.theater.name.localeCompare(groupB.theater.name);
      }

      if (groupA.distanceKm === null) {
        return 1;
      }

      if (groupB.distanceKm === null) {
        return -1;
      }

      return groupA.distanceKm - groupB.distanceKm;
    });
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dateOptions = useMemo(() => getDateOptions(), []);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState(dateOptions[0]?.key ?? "");
  const [referenceLocation, setReferenceLocation] = useState<GeoPoint>(BANGKOK_CENTER);
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

        const [movieData, upcomingShowtimes] = await Promise.all([
          getMovieById(id),
          getUpcomingShowtimes(),
        ]);

        if (!isMounted) {
          return;
        }

        setMovie(movieData);
        setShowtimes(upcomingShowtimes);
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
        const permissionResult = await Location.requestForegroundPermissionsAsync();

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
    [id, showtimes]
  );

  const cityOptions = useMemo(() => {
    const cities = new Set<string>();

    movieShowtimes.forEach((showtime) => {
      const city = getTheater(showtime)?.locate_part?.trim();

      if (city) {
        cities.add(city);
      }
    });

    return Array.from(cities).sort((cityA, cityB) => cityA.localeCompare(cityB));
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#101525]">
        <ActivityIndicator color="#4E7BEE" />
        <Text className="mt-3 font-condensed text-body1regular text-text-secondary">
          Loading movie...
        </Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 items-center justify-center bg-[#101525] px-6">
        <Text className="text-center font-condensed text-body1regular text-semantic-danger">
          {error || "Movie not found"}
        </Text>
      </View>
    );
  }

  const movieTags = getMovieTags(movie);

  return (
    <View className="flex-1 bg-[#101525]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto min-h-screen w-full max-w-[430px] bg-[#101525]">
          <View className="relative bg-[#070C1B] pt-20">
            {movie.poster_url ? (
              <Image
                source={{ uri: movie.poster_url }}
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

          <View className="mt-10 gap-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {dateOptions.map((dateOption) => {
                const isSelected = selectedDateKey === dateOption.key;

                return (
                  <Pressable
                    key={dateOption.key}
                    className={`w-28 items-center justify-center border px-4 py-4 ${
                      isSelected
                        ? "border-[#4E7BEE] bg-[#4E7BEE]"
                        : "border-[#21263F] bg-[#070C1B]"
                    }`}
                    onPress={() => setSelectedDateKey(dateOption.key)}
                  >
                    <Text
                      className={`font-condensedBold text-headline4 ${
                        isSelected ? "text-white" : "text-[#C8CEDD]"
                      }`}
                    >
                      {dateOption.day}
                    </Text>
                    <Text
                      className={`mt-1 font-condensed text-body3 ${
                        isSelected ? "text-white" : "text-[#8B93B0]"
                      }`}
                    >
                      {dateOption.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="gap-5 px-4">
              <View className="flex-row items-center gap-3 border border-[#565F7E] bg-[#070C1B] px-4 py-4">
                <Ionicons name="search-outline" size={22} color="#C8CEDD" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search cinema"
                  placeholderTextColor="#C8CEDD"
                  className="flex-1 font-condensed text-body1regular text-white"
                />
                {searchQuery ? (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#8B93B0" />
                  </Pressable>
                ) : null}
              </View>

              <Pressable
                className="flex-row items-center justify-between border border-[#565F7E] bg-[#070C1B] px-4 py-4"
                onPress={() => setIsCityPickerOpen(true)}
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="location-outline" size={22} color="#C8CEDD" />
                  <Text className="font-condensed text-body1regular text-white">
                    {selectedCity ?? "City"}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={22} color="#C8CEDD" />
              </Pressable>
            </View>

            <View className="gap-6">
              {theaterGroups.length > 0 ? (
                theaterGroups.map((group) => (
                  <View key={group.theater.id} className="bg-[#070C1B]">
                    <View className="flex-row items-start justify-between gap-4 px-4 py-4">
                      <View className="flex-1 gap-4">
                        <View className="flex-row items-center gap-4">
                          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#21263F]">
                            <Ionicons name="location-sharp" size={22} color="#FFFFFF" />
                          </View>
                          <View className="flex-1">
                            <Text className="font-condensedBold text-headline3 text-white">
                              {group.theater.name}
                            </Text>
                            {group.distanceKm !== null ? (
                              <Text className="font-condensed text-body3 text-[#8B93B0]">
                                {group.distanceKm.toFixed(1)} km
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View className="flex-row flex-wrap gap-2">
                          <View className="rounded bg-[#21263F] px-3 py-1.5">
                            <Text className="font-condensed text-body2regular text-[#8B93B0]">
                              Hearing assistance
                            </Text>
                          </View>
                          <View className="rounded bg-[#21263F] px-3 py-1.5">
                            <Text className="font-condensed text-body2regular text-[#8B93B0]">
                              Wheelchair access
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Ionicons name="chevron-down" size={28} color="#C8CEDD" />
                    </View>

                    <View className="gap-10 border border-[#21263F] px-4 py-6">
                      {group.halls.map((hall) => (
                        <View key={`${group.theater.id}-${hall.hallName}`} className="gap-4">
                          <Text className="font-condensedBold text-headline3 text-[#C8CEDD]">
                            {hall.hallName}
                          </Text>

                          <View className="flex-row flex-wrap gap-4">
                            {hall.showtimes.map((showtime, index) => (
                              <TouchableOpacity
                                key={showtime.id}
                                className={`w-[102px] items-center justify-center rounded px-4 py-3 ${
                                  index === 0 ? "bg-[#4E7BEE]" : "bg-[#1E29A8]"
                                }`}
                                activeOpacity={0.8}
                                onPress={() => router.push(`/booking/${showtime.id}` as any)}
                              >
                                <Text className="font-condensedBold text-[20px] leading-[26px] text-white">
                                  {formatShowtime(showtime.start_time)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <View className="mx-4 border border-[#21263F] bg-[#070C1B] px-4 py-10">
                  <Text className="text-center font-condensedBold text-headline4 text-[#C8CEDD]">
                    No showtimes available
                  </Text>
                  <Text className="mt-2 text-center font-condensed text-body2regular text-[#8B93B0]">
                    {dateFromKey(selectedDateKey).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isCityPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCityPickerOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setIsCityPickerOpen(false)}
        >
          <Pressable className="mx-auto w-full max-w-[430px] bg-[#070C1B] px-4 pb-8 pt-5">
            <Text className="font-condensedBold text-headline3 text-white">City</Text>

            <View className="mt-4 gap-2">
              <Pressable
                className="border border-[#21263F] px-4 py-4"
                onPress={() => {
                  setSelectedCity(null);
                  setIsCityPickerOpen(false);
                }}
              >
                <Text className="font-condensed text-body1regular text-white">All cities</Text>
              </Pressable>

              {cityOptions.map((city) => (
                <Pressable
                  key={city}
                  className={`border px-4 py-4 ${
                    selectedCity === city
                      ? "border-[#4E7BEE] bg-[#21263F]"
                      : "border-[#21263F]"
                  }`}
                  onPress={() => {
                    setSelectedCity(city);
                    setIsCityPickerOpen(false);
                  }}
                >
                  <Text className="font-condensed text-body1regular text-white">{city}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
