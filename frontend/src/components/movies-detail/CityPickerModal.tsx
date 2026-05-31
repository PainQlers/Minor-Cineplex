import { Modal, Pressable, Text, View } from "react-native";

type CityPickerModalProps = {
  cities: string[];
  selectedCity: string | null;
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: string | null) => void;
};

export function CityPickerModal({
  cities,
  selectedCity,
  visible,
  onClose,
  onSelectCity,
}: CityPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable className="mx-auto w-full max-w-[430px] bg-[#070C1B] px-4 pb-8 pt-5">
          <Text className="font-condensedBold text-headline3 text-white">City</Text>

          <View className="mt-4 gap-2">
            <Pressable
              className="border border-[#21263F] px-4 py-4"
              onPress={() => onSelectCity(null)}
            >
              <Text className="font-condensed text-body1regular text-white">All cities</Text>
            </Pressable>

            {cities.map((city) => (
              <Pressable
                key={city}
                className={`border px-4 py-4 ${
                  selectedCity === city
                    ? "border-[#4E7BEE] bg-[#21263F]"
                    : "border-[#21263F]"
                }`}
                onPress={() => onSelectCity(city)}
              >
                <Text className="font-condensed text-body1regular text-white">{city}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
