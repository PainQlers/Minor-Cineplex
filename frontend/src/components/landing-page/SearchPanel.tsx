import { useState, useEffect, useCallback } from "react";
import { Pressable, Text, View, Modal, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import clsx from "clsx";

import { AppButton } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icon";
import { Movie } from "@/types/movie";
import { getMovies } from "@/services/movie.service";
import { getShowtimesByMovie } from "@/services/showtime.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchSelectFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: "chevron-down" | "calendar-outline";
  className?: string;
  onPress?: () => void;
}

interface SearchPanelProps {
  className?: string;
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  movie?: string;
  language?: string;
  genre?: string;
  city?: string;
  releaseDate?: string;
}

const CITIES = [
  "กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "พระนครศรีอยุธยา", "สมุทรปราการ",
  "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง",
  "ขอนแก่น", "อุดรธานี", "นครราชสีมา", "อุบลราชธานี",
  "ภูเก็ต", "สุราษฎร์ธานี", "กระบี่", "นครศรีธรรมราช",
  "ชลบุรี", "ระยอง", "พัทยา",
];

function SearchSelectField({
  label,
  value,
  placeholder,
  icon = "chevron-down",
  className,
  onPress,
}: SearchSelectFieldProps) {
  const displayText = value || placeholder || label;
  const isPlaceholder = !value;

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
      <Text
        numberOfLines={1}
        className={clsx(
          "font-condensed text-body1regular",
          isPlaceholder ? "text-base-gray300" : "text-base-dark"
        )}
      >
        {displayText}
      </Text>

      <AppIcon size={18}>
        <Ionicons name={icon} size={18} color="#C8CEDD" />
      </AppIcon>
    </Pressable>
  );
}

interface SelectionModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

function SelectionModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl max-h-[70%]">
          <View className="flex-row items-center justify-between p-4 border-b border-base-gray200">
            <Text className="font-condensedMedium text-lg text-base-dark">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8B93B0" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                className={clsx(
                  "p-4 border-b border-base-gray100",
                  selectedValue === item && "bg-base-gray100"
                )}
              >
                <Text
                  className={clsx(
                    "font-condensed text-body1regular",
                    selectedValue === item ? "text-primary-base" : "text-base-dark"
                  )}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

export function SearchPanel({ className, onSearch }: SearchPanelProps) {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof SearchFilters;
  }>({ visible: false, title: "", options: [], field: "movie" });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      console.error("Failed to load movies:", err);
    }
  };

  const getMovieTitles = useCallback(() => {
    // กรองเฉพาะ movie ที่ show_date อยู่ในช่วง +/- 7 วันจากวันนี้
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const filteredMovies = movies.filter((m) => {
      if (!m.show_date) return false;
      const movieDate = new Date(m.show_date);
      return movieDate >= sevenDaysAgo && movieDate <= sevenDaysLater;
    });

    return filteredMovies.map((m) => m.title);
  }, [movies]);

  const getGenres = useCallback(() => {
    const genres = new Set<string>();
    movies.forEach((m) => {
      if (m.genre) genres.add(m.genre);
    });
    return Array.from(genres).sort();
  }, [movies]);

  const getAvailableDates = useCallback(() => {
    // สร้างวันที่ 14 วันล่วงหน้าจากวันนี้ (รวม today)
    const today = new Date();
    const dates: string[] = [];

    for (let i = 0; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formatted = date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      dates.push(formatted);
    }

    return dates;
  }, []);

  const openModal = (field: keyof SearchFilters, title: string, options: string[]) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSelect = async (value: string) => {
    const field = modalConfig.field;

    if (field === "movie") {
      // หา movie object จาก title ที่เลือก
      const selectedMovie = movies.find((m) => m.title === value);
      if (selectedMovie) {
        // Auto-fill genre ตาม movie
        const movieGenre = selectedMovie.genre || "";

        // ดึง showtimes ของหนังเพื่อหาวันที่มีรอบฉาย
        try {
          const showtimes = await getShowtimesByMovie(selectedMovie.id);
          const uniqueDates = new Set<string>();
          showtimes.forEach((st) => {
            const date = new Date(st.start_time);
            const formatted = date.toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            uniqueDates.add(formatted);
          });

          setFilters((prev) => ({
            ...prev,
            movie: value,
            genre: movieGenre,
            releaseDate: uniqueDates.size > 0 ? Array.from(uniqueDates).sort()[0] : prev.releaseDate,
          }));
        } catch {
          // ถ้าดึง showtimes ไม่ได้ ใช้ show_date ของหนังแทน
          const movieDate = selectedMovie.show_date
            ? new Date(selectedMovie.show_date).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : undefined;

          setFilters((prev) => ({
            ...prev,
            movie: value,
            genre: movieGenre,
            releaseDate: movieDate || prev.releaseDate,
          }));
        }
      }
    } else {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    // ถ้าไม่มี city เลือก ให้ใช้ default จาก local storage หรือ Bangkok
    let finalCity = filters.city;
    if (!finalCity) {
      try {
        const savedCity = await AsyncStorage.getItem("user_city");
        finalCity = savedCity || "กรุงเทพมหานคร";
      } catch {
        finalCity = "กรุงเทพมหานคร";
      }
    }

    const finalFilters = { ...filters, city: finalCity };

    if (onSearch) {
      onSearch(finalFilters);
    } else {
      const params = new URLSearchParams();
      if (finalFilters.movie) params.append("movie", finalFilters.movie);
      if (finalFilters.language) params.append("language", finalFilters.language);
      if (finalFilters.genre) params.append("genre", finalFilters.genre);
      if (finalFilters.city) params.append("city", finalFilters.city);
      if (finalFilters.releaseDate) params.append("releaseDate", finalFilters.releaseDate);

      const queryString = params.toString();
      const href = `/movies${queryString ? `?${queryString}` : ""}` as const;
      router.push(href as any);
    }
  };

  return (
    <>
      <View
        className={clsx(
          "mt-20 mb-6 rounded bg-base-gray0 px-2 pt-4 pb-8 shadow-lg",
          className
        )}
      >
        <View className="gap-3">
          <SearchSelectField
            label="Movie"
            placeholder="Select Movie"
            value={filters.movie}
            onPress={() => openModal("movie", "Select Movie", getMovieTitles())}
          />

          <View className="flex-row gap-3">
            <View
              className="h-12 flex-1 flex-row items-center justify-between rounded border border-base-gray200 bg-base-gray100 px-4"
            >
              <Text className="font-condensed text-body1regular text-base-dark">
                ENG / TH
              </Text>
            </View>
            <View
              className="h-12 flex-1 flex-row items-center justify-between rounded border border-base-gray200 bg-base-gray100 px-4"
            >
              <Text
                className={clsx(
                  "font-condensed text-body1regular",
                  filters.genre ? "text-base-dark" : "text-base-gray300"
                )}
              >
                {filters.genre || "Auto from Movie"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <SearchSelectField
              label="City"
              placeholder="Select City"
              value={filters.city}
              className="flex-1"
              onPress={() => openModal("city", "Select City", CITIES)}
            />
            <SearchSelectField
              label="Date"
              placeholder="Select Date"
              value={filters.releaseDate}
              icon="calendar-outline"
              className="flex-1"
              onPress={() => openModal("releaseDate", "Select Date", getAvailableDates())}
            />
          </View>

          <View className="items-center pt-1">
            <AppButton
              label=""
              onPress={handleSubmit}
              className="min-h-12 min-w-[60px] rounded px-6 py-3"
              labelClassName="hidden"
            />
            <View className="-mt-9 pointer-events-none">
              <AppIcon size={18}>
                <Ionicons name="search-outline" size={18} color="#FFFFFF" />
              </AppIcon>
            </View>
          </View>
        </View>
      </View>

      <SelectionModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        options={modalConfig.options}
        selectedValue={filters[modalConfig.field]}
        onSelect={handleSelect}
        onClose={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}