import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";
import { AppNavbar } from "@/components/ui/navbar";

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
        <Text style={styles.description}>{`<AppNavbar
            variant="dark"
            logoLabel="Cineplex"
            items={navItems}
            showHamburger={true}
          />`}</Text>
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
          Minimal Navbar
        </Text>
        <Text style={styles.description}>{`<AppNavbar
            variant="dark"
            logoLabel="CP"
            showHamburger={true}
          />`}</Text>
        <View style={styles.navbarWrapper}>
          <AppNavbar variant="dark" logoLabel="CP" showHamburger={true} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
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
