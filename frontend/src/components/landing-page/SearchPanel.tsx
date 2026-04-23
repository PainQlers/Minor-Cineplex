import { useState, useEffect, useCallback } from "react";
import { Pressable, Text, View, Modal, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import clsx from "clsx";

import { AppButton } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icon";
import { Movie } from "@/types/movie";
import { getMovies } from "@/services/movie.service";

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

const LANGUAGES = ["ENG", "TH"];
const CITIES = ["Bangkok", "Chiang Mai", "Phuket", "Khon Kaen", "Pattaya"];

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
    return movies.map((m) => m.title);
  }, [movies]);

  const getGenres = useCallback(() => {
    const genres = new Set<string>();
    movies.forEach((m) => {
      if (m.genre) genres.add(m.genre);
    });
    return Array.from(genres).sort();
  }, [movies]);

  const getReleaseDates = useCallback(() => {
    const dates = new Set<string>();
    movies.forEach((m) => {
      if (m.show_date) {
        const date = new Date(m.show_date);
        const formatted = date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
        });
        dates.add(formatted);
      }
    });
    return Array.from(dates).sort();
  }, [movies]);

  const openModal = (field: keyof SearchFilters, title: string, options: string[]) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSelect = (value: string) => {
    setFilters((prev) => ({ ...prev, [modalConfig.field]: value }));
  };

  const handleSubmit = () => {
    if (onSearch) {
      onSearch(filters);
    } else {
      const params = new URLSearchParams();
      if (filters.movie) params.append("movie", filters.movie);
      if (filters.language) params.append("language", filters.language);
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.city) params.append("city", filters.city);
      if (filters.releaseDate) params.append("releaseDate", filters.releaseDate);

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
            <SearchSelectField
              label="Language"
              placeholder="ENG/TH"
              value={filters.language}
              className="flex-1"
              onPress={() => openModal("language", "Select Language", LANGUAGES)}
            />
            <SearchSelectField
              label="Genre"
              placeholder="Select Genre"
              value={filters.genre}
              className="flex-1"
              onPress={() => openModal("genre", "Select Genre", getGenres())}
            />
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
              label="Release date"
              placeholder="Select Date"
              value={filters.releaseDate}
              icon="calendar-outline"
              className="flex-1"
              onPress={() => openModal("releaseDate", "Select Release Date", getReleaseDates())}
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