import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";

import { TheaterCard } from "@/components/landing-page/TheaterCard";
import { AppIcon } from "@/components/ui/icon";
import { LocationPermissionPrompt } from "@/components/ui/location-permission-prompt";
import { AppPagination } from "@/components/ui/pagination";
import { getTheaters } from "@/services/theater.service";
import { Theater } from "@/types/theater";
import DoneRoundLightIcon from "@/assets/icons/done_round_light.svg";

const THEATERS_PER_PAGE = 4;

type TheaterGroup = {
  province: string;
  theaters: Theater[];
};

function groupTheatersByProvince(theaters: Theater[]): TheaterGroup[] {
  const grouped = theaters.reduce<Record<string, Theater[]>>((acc, theater) => {
    const province = theater.locate_part?.trim() || "Other Locations";

    if (!acc[province]) {
      acc[province] = [];
    }

    acc[province].push(theater);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([provinceA], [provinceB]) => provinceA.localeCompare(provinceB))
    .map(([province, groupedTheaters]) => ({
      province,
      theaters: groupedTheaters.sort((theaterA, theaterB) =>
        theaterA.name.localeCompare(theaterB.name)
      ),
    }));
}

export function TheatersSection() {
  const [theaterGroups, setTheaterGroups] = useState<TheaterGroup[]>([]);
  const [provincePages, setProvincePages] = useState<Record<string, number>>({});
  const [isLocationPromptVisible, setIsLocationPromptVisible] = useState(false);
  const hasShownLocationPromptRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasShownLocationPromptRef.current) {
      return;
    }

    hasShownLocationPromptRef.current = true;
    setIsLocationPromptVisible(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTheaters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const keyword = "";
        const theaters = keyword
          ? await searchTheaters(keyword)
          : await getTheaters();

        if (!isMounted) {
          return;
        }

        const groups = groupTheatersByProvince(theaters);
        setTheaterGroups(groups);
        setProvincePages((currentPages) => {
          const nextPages: Record<string, number> = {};

          groups.forEach((group) => {
            nextPages[group.province] = currentPages[group.province] ?? 1;
          });

          return nextPages;
        });
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load theaters");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTheaters();

    return () => {
      isMounted = false;
    };
  }, []);

  const paginatedGroups = useMemo(() => {
    return theaterGroups.map((group) => {
      const currentPage = provincePages[group.province] ?? 1;
      const totalPages = Math.max(
        1,
        Math.ceil(group.theaters.length / THEATERS_PER_PAGE)
      );
      const safePage = Math.min(currentPage, totalPages);
      const startIndex = (safePage - 1) * THEATERS_PER_PAGE;

      return {
        ...group,
        currentPage: safePage,
        totalPages,
        visibleTheaters: group.theaters.slice(
          startIndex,
          startIndex + THEATERS_PER_PAGE
        ),
      };
    });
  }, [provincePages, theaterGroups]);

  const handleProvincePageChange = (province: string, page: number) => {
    setProvincePages((currentPages) => ({
      ...currentPages,
      [province]: page,
    }));
  };

  const handleOpenMap = async (theater: Theater) => {
    if (!theater.google_map_url) {
      Alert.alert("Map unavailable", "This theater does not have a map link yet.");
      return;
    }

    const canOpen = await Linking.canOpenURL(theater.google_map_url);

    if (!canOpen) {
      Alert.alert("Invalid map link", "Unable to open this theater location.");
      return;
    }

    await Linking.openURL(theater.google_map_url);
  };

  const closeLocationPrompt = () => {
    setIsLocationPromptVisible(false);
  };

  const requestBrowserLocation = () => {
    if (!globalThis.navigator?.geolocation) {
      Alert.alert(
        "Location unavailable",
        "This device or browser does not support location access yet."
      );
      closeLocationPrompt();
      return;
    }

    globalThis.navigator.geolocation.getCurrentPosition(
      () => {
        closeLocationPrompt();
        Alert.alert(
          "Location enabled",
          "We can request your location now. Connect theater coordinates next to sort by nearest distance."
        );
      },
      () => {
        closeLocationPrompt();
        Alert.alert(
          "Location blocked",
          "We could not access your location. Please try again if you change your mind."
        );
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 10000,
      }
    );
  };

  return (
    <View className="gap-2 pb-2 pt-2">
      <Text className="font-condensedBold text-headline2 text-text-primary">
        All cinemas
      </Text>

      <View className="flex-row items-center gap-1 rounded-lg bg-base-gray100 px-1">
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-base-gray200 py-3 my-1">
          <AppIcon
            icon={DoneRoundLightIcon}
            size={20}
            color="#FFFFFF"
          />
          <Text className="font-condensedBold text-body1medium text-text-secondary">
            Browse by City
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 items-center justify-center rounded-md my-1"
          onPress={() => setIsLocationPromptVisible(true)}
        >
          <Text className="font-condensedBold text-body1medium text-text-secondary">
            Nearest Locations First
          </Text>
        </Pressable>
      </View>

      <LocationPermissionPrompt
        visible={isLocationPromptVisible}
        onClose={closeLocationPrompt}
        onAllowWhileVisiting={requestBrowserLocation}
        onAllowThisTime={requestBrowserLocation}
        onDeny={closeLocationPrompt}
      />
{/* 
      <AppInputField
        label="Search theaters"
        placeholder="Search by theater name or address"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
        showClearButton={searchQuery.length > 0}
        helperText="Searches theater name and address from the backend."
      /> */}

      <View className="gap-6">
        {isLoading ? (
          <Text className="font-body text-body3 text-text-muted">
            Loading theaters...
          </Text>
        ) : null}

        {error ? (
          <Text className="font-body text-body3 text-semantic-danger">
            Unable to load theaters: {error}
          </Text>
        ) : null}

        {!isLoading && !error && theaterGroups.length === 0 ? (
          <Text className="font-body text-body3 text-text-muted">
            No theaters available right now.
          </Text>
        ) : null}

        {!isLoading && !error
          ? paginatedGroups.map((group) => (
              <View key={group.province} className="gap-4 mt-3">
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="font-condensedBold text-headline4 text-text-muted">
                    {group.province}
                  </Text>
                  {/* <Text className="font-body text-body3 text-text-secondary">
                    {group.theaters.length} cinemas
                  </Text> */}
                </View>

                <View className="gap-3">
                  {group.visibleTheaters.map((theater) => (
                    <TheaterCard
                      key={theater.id}
                      name={theater.name}
                      address={theater.address ?? "Address unavailable"}
                      mapUrl={theater.google_map_url}
                      onPress={() => {
                        void handleOpenMap(theater);
                      }}
                    />
                  ))}
                </View>

                {group.totalPages > 1 ? (
                  <View className="items-center pt-1">
                    <AppPagination
                      currentPage={group.currentPage}
                      totalPages={group.totalPages}
                      variant="standard"
                      onPageChange={(page) =>
                        handleProvincePageChange(group.province, page)
                      }
                    />
                  </View>
                ) : null}
              </View>
            ))
          : null}
      </View>
    </View>
  );
}
