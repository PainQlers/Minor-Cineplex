import { Stack } from "expo-router";
import "./../global.css";
import { ScrollView, View } from "react-native";

import { HeroBackground } from "@/components/landing-page/HeroBackground";
import { SearchPanel } from "@/components/landing-page/SearchPanel";
import { MoviesSection } from "@/components/landing-page/MoviesSection";
import { CouponsSection } from "@/components/landing-page/CouponsSection";
import { TheatersSection } from "@/components/landing-page/TheatersSection";
import { FooterLanding } from "@/components/landing-page/FooterLanding";

export default function Index() {
  return (
    <>
      <ScrollView className="flex-1 bg-base-gray0">
        <HeroBackground>
          <SearchPanel />
          <MoviesSection />
          <CouponsSection />
          <TheatersSection />
        </HeroBackground>
        <FooterLanding />
      </ScrollView>
    </>
  );
}
