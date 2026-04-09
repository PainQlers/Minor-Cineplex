import { Stack } from "expo-router";
import "./../global.css";
import { ScrollView, View } from "react-native";

import { HeroBackground } from "@/components/landing-page/HeroBackground";
import { LandingNavbar } from "@/components/landing-page/LandingNavbar";
import { SearchPanel } from "@/components/landing-page/SearchPanel";
import { MoviesSection } from "@/components/landing-page/MoviesSection";


export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-base-gray0">
        <HeroBackground>
          <LandingNavbar className="absolute top-0 left-0 right-0 z-10" />
          <View className="px-5 pt-10 gap-8">

            <SearchPanel />
          </View>
          <MoviesSection />
        </HeroBackground>
      </ScrollView>
    </>
  );
}