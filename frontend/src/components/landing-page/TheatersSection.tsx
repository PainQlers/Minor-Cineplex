import { Text, View } from "react-native";

import { TheaterCard } from "@/components/landing-page/TheaterCard";
import { AppIcon } from "@/components/ui/icon";
import DoneRoundLightIcon from "@/assets/icons/done_round_light.svg";

const MOCK_THEATER_GROUPS = [
  {
    province: "Bangkok",
    theaters: [
      {
        id: "bkk-1",
        name: "Minor Cineplex Arkham",
        address: "1224 Arkham, Arkham city",
      },
      {
        id: "bkk-2",
        name: "Minor Cineplex Arkham Asylum",
        address: "Central Arkham 118, Arkham Asylum, Arkham city",
      },
      {
        id: "bkk-3",
        name: "Minor Cineplex Indian Hill",
        address: "48/996 Indian Hill, Arkham city",
      },
      {
        id: "bkk-4",
        name: "Minor Cineplex Arkham Bridge",
        address: "1224 Arkham bridge, Arkham city",
      },
    ],
  },
  {
    province: "Pathumthani",
    theaters: [
      {
        id: "pt-1",
        name: "Minor Cineplex Riddler Factory",
        address: "29/9 Gotham Avenue, Pathumthani",
      },
      {
        id: "pt-2",
        name: "Minor Cineplex Wayne Square",
        address: "88 Wayne Square, Pathumthani",
      },
    ],
  },
] as const;

export function TheatersSection() {
  return (
    <View className="gap-6 px-5 pb-10 pt-2">
      <Text className="font-condensedBold text-headline3 text-text-primary">
        All cinemas
      </Text>

      <View className="flex-row items-center gap-3 rounded-lg bg-base-gray100 p-1">
        <View className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-base-gray200 px-4 py-3">
          <AppIcon
            icon={DoneRoundLightIcon}
            size={14}
            color="#FFFFFF"
          />
          <Text className="font-bodyMedium text-body3 text-text-primary">
            Browse by City
          </Text>
        </View>

        <View className="flex-1 items-center justify-center rounded-md px-4 py-3">
          <Text className="font-bodyMedium text-body3 text-text-secondary">
            Nearest Locations First
          </Text>
        </View>
      </View>

      <View className="gap-6">
        {MOCK_THEATER_GROUPS.map((group) => (
          <View key={group.province} className="gap-4">
            <Text className="font-condensedBold text-headline4 text-text-muted">
              {group.province}
            </Text>

            <View className="gap-3">
              {group.theaters.map((theater) => (
                <TheaterCard
                  key={theater.id}
                  name={theater.name}
                  address={theater.address}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
