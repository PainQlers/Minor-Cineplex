import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import UserDuotoneIcon from "@/assets/icons/user_duotone.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { MenuLink, type MenuLinkVariant } from "../ui/menu-link";

interface MenuLinkCell {
  disabled?: boolean;
  id: string;
  label: string;
  usage: string;
  variant: MenuLinkVariant;
}

interface MenuLinkRow {
  id: string;
  cells: [MenuLinkCell, MenuLinkCell, MenuLinkCell];
}

const MENU_LINK_ROWS: MenuLinkRow[] = [
  {
    id: "light-theme",
    cells: [
      {
        id: "light-default",
        label: "Booking history",
        usage: '<MenuLink label="Booking history" icon={UserDuotoneIcon} />',
        variant: "light",
      },
      {
        id: "light-secondary",
        label: "My Account",
        usage: '<MenuLink label="My Account" icon={UserDuotoneIcon} />',
        variant: "light",
      },
      {
        id: "light-disabled",
        disabled: true,
        label: "Settings",
        usage: '<MenuLink disabled label="Settings" icon={UserDuotoneIcon} />',
        variant: "light",
      },
    ],
  },
  {
    id: "dark-theme",
    cells: [
      {
        id: "dark-default",
        label: "Booking history",
        usage: '<MenuLink label="Booking history" icon={UserDuotoneIcon} variant="dark" />',
        variant: "dark",
      },
      {
        id: "dark-secondary",
        label: "My Account",
        usage: '<MenuLink label="My Account" icon={UserDuotoneIcon} variant="dark" />',
        variant: "dark",
      },
      {
        id: "dark-disabled",
        disabled: true,
        label: "Settings",
        usage: '<MenuLink disabled label="Settings" icon={UserDuotoneIcon} variant="dark" />',
        variant: "dark",
      },
    ],
  },
];

export function MenuLinkShowcase() {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <View
      className="w-full rounded-[20px] border-2 px-6 py-8 self-center"
      style={styles.matrixCard}
    >
      <View style={styles.rows}>
        {MENU_LINK_ROWS.map((row) => (
          <View key={row.id} style={isCompact ? styles.rowCompact : styles.rowWide}>
            {row.cells.map((cell, index) => (
              <View key={cell.id} style={styles.linkCell}>
                <Text style={[TYPOGRAPHY.body3, styles.cellUsage]}>{cell.usage}</Text>

                <MenuLink
                  disabled={cell.disabled}
                  icon={UserDuotoneIcon}
                  label={cell.label}
                  variant={cell.variant}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cellUsage: {
    color: COLORS.text.muted,
    textAlign: "center",
    marginBottom: 8,
  },
  linkCell: {
    gap: 12,
  },
  matrixCard: {
    borderColor: COLORS.base.gray300,
    width: "100%",
  },
  rowCompact: {
    gap: 16,
  },
  rowWide: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
  },
  rows: {
    gap: 24,
  },
});