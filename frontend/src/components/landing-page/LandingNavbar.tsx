import { View } from "react-native";
import { AppNavbar } from "@/components/ui/navbar";
import { Dropdown } from "@/components/landing-page/DropDownLanding";
import { useState } from "react";

export function LandingNavbar({ className }: { className?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View className={`w-full ${className}`}>
      <AppNavbar
        logoLabel="M"
        showHamburger
        onHamburgerPress={() => setMenuOpen((current) => !current)}
        className="relative"
      />
      {menuOpen && <Dropdown onClose={() => setMenuOpen(false)} />}
    </View>
  );
}