import { View } from "react-native";
import { AppNavbar } from "@/components/ui/navbar";

export function LandingNavbar({ className }: { className?: string }) {
  return (
    <View className={`w-full ${className}`}>
      <AppNavbar logoLabel="M" showHamburger />
    </View>
  );
}