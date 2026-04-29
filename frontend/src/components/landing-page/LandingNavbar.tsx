import { View } from "react-native";
import { AppNavbar } from "@/components/ui/navbar";
import { Dropdown, DropdownUser } from "@/components/landing-page/DropDownLanding";
import { useState } from "react";
import { useAuth } from '../../context/AuthContext';

export function LandingNavbar({ className }: { className?: string }) {
  const { token } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View 
    pointerEvents="box-none"
    className={`w-full z-50 ${className}`}>
      <AppNavbar
        logoLabel="M"
        showHamburger
        onHamburgerPress={() => setMenuOpen((current) => !current)}
        className="relative"
      />
      {menuOpen && (
      <View 
        pointerEvents={menuOpen ? "auto" : "none"} 
        className="absolute top-[7px] left-0 right-0"
      >
      {token ? (
          // ✅ สิ่งที่แสดงเมื่อ Login แล้ว (User)
          <>
            <DropdownUser open={menuOpen} onClose={() => setMenuOpen(false)} />
          </>
        ) : (
          // ❌ สิ่งที่แสดงเมื่อยังไม่ได้ Login (Non-User)
          <>
            <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)} />
          </>
        )} 
    </View>
    )}
    </View>
  );
}