import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { AppNavbar } from "./ui/navbar";
import { AppButton } from "./ui/button";

export function NavbarShowcase() {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "movies", label: "Movies" },
    { id: "tickets", label: "Tickets" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Dark Navbar
        </Text>
        <Text style={styles.description}>Default dark background</Text>
        <View style={styles.navbarWrapper}>
          <AppNavbar
            variant="dark"
            logoLabel="Cineplex"
            items={navItems}
            showHamburger={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Light Navbar
        </Text>
        <Text style={styles.description}>Light background variant</Text>
        <View style={styles.navbarWrapper}>
          <AppNavbar
            variant="light"
            logoLabel="Cineplex"
            items={navItems}
            showHamburger={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Minimal Navbar
        </Text>
        <Text style={styles.description}>Without navigation items</Text>
        <View style={styles.navbarWrapper}>
          <AppNavbar
            variant="dark"
            logoLabel="CP"
            showHamburger={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[TYPOGRAPHY.sectionTitle, styles.sectionTitle]}>
          Logo Only
        </Text>
        <Text style={styles.description}>Custom logo with text</Text>
        <View style={styles.navbarWrapper}>
          <AppNavbar
            variant="dark"
            logo={
              <View style={styles.customLogo}>
                <Text style={{ color: COLORS.brand.blue100, fontWeight: "bold" }}>
                  🎬
                </Text>
              </View>
            }
            showHamburger={false}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  customLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.base.gray100,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  description: {
    color: COLORS.text.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  navbarWrapper: {
    borderWidth: 1,
    borderColor: COLORS.base.gray300,
    borderRadius: 8,
    overflow: "hidden",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.text.primary,
  },
});
