import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ShowtimeFiltersProps = {
  searchQuery: string;
  selectedCity: string | null;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onOpenCityPicker: () => void;
};

export function ShowtimeFilters({
  searchQuery,
  selectedCity,
  onSearchChange,
  onClearSearch,
  onOpenCityPicker,
}: ShowtimeFiltersProps) {
  return (
    <View className="gap-5 px-4">
      <View className="flex-row items-center gap-3 border border-[#565F7E] bg-[#070C1B] px-4 py-4">
        <Ionicons name="search-outline" size={22} color="#C8CEDD" />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search cinema"
          placeholderTextColor="#C8CEDD"
          className="flex-1 font-condensed text-body1regular text-white"
        />
        {searchQuery ? (
          <Pressable onPress={onClearSearch}>
            <Ionicons name="close-circle" size={20} color="#8B93B0" />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        className="flex-row items-center justify-between border border-[#565F7E] bg-[#070C1B] px-4 py-4"
        onPress={onOpenCityPicker}
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
  );
}
