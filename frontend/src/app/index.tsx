import { Stack } from "expo-router";
import "./../global.css";
import { ScrollView, View } from "react-native";

import { HeroBackground } from "@/components/landing-page/HeroBackground";
import { LandingNavbar } from "@/components/landing-page/LandingNavbar";
import { SearchPanel } from "@/components/landing-page/SearchPanel";
import { MoviesSection } from "@/components/landing-page/MoviesSection";
import { CouponsSection } from "@/components/landing-page/CouponsSection";
import { TheatersSection } from "@/components/landing-page/TheatersSection";


export default function Index() {
  return (
    <>
      <ScrollView className="flex-1 bg-base-gray0">
        <HeroBackground>
          <View className="px-5 pt-10 gap-8">

            <SearchPanel />
          </View>
          <MoviesSection />
          <CouponsSection />
          <TheatersSection />
        </HeroBackground>
      </ScrollView>
    </>
  );
}
