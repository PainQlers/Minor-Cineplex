import {
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
  View,
  useWindowDimensions,
} from "react-native";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { AppButton, type AppButtonVariant } from "./ui/button";

interface ButtonCell {
  disabled?: boolean;
  id: string;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  usage: string;
  variant: AppButtonVariant;
}

interface ButtonRow {
  id: string;
  cells: [ButtonCell, ButtonCell, ButtonCell];
}

const BUTTON_LABEL = "Button";

const BUTTON_ROWS: ButtonRow[] = [
  {
    cells: [
      {
        id: "primary-solid",
        usage: '<AppButton label="Button" variant="primary" />',
        variant: "primary",
      },
      {
        id: "primary-outline",
        usage: '<AppButton label="Button" variant="outline" />',
        variant: "outline",
      },
      {
        id: "primary-link",
        usage: '<AppButton label="Button" variant="link" />',
        variant: "link",
      },
    ],
    id: "primary",
  },
  {
    cells: [
      {
        id: "secondary-solid",
        usage: '<AppButton label="Button" variant="secondary" />',
        variant: "secondary",
      },
      {
        id: "secondary-neutral",
        style: { backgroundColor: COLORS.base.gray300, borderWidth: 0 },
        usage: '<AppButton label="Button" variant="outline" />',
        variant: "outline",
      },
      {
        id: "secondary-link",
        labelStyle: { color: COLORS.text.secondary },
        usage: '<AppButton label="Button" variant="link" />',
        variant: "link",
      },
    ],
    id: "secondary",
  },
  {
    cells: [
      {
        id: "dark-solid",
        style: { backgroundColor: COLORS.brand.blue300 },
        usage: '<AppButton label="Button" variant="secondary" />',
        variant: "secondary",
      },
      {
        id: "dark-neutral",
        style: { backgroundColor: COLORS.base.gray200, borderWidth: 0 },
        usage: '<AppButton label="Button" variant="outline" />',
        variant: "outline",
      },
      {
        id: "dark-link",
        labelStyle: { color: COLORS.text.muted },
        usage: '<AppButton label="Button" variant="link" />',
        variant: "link",
      },
    ],
    id: "dark",
  },
  {
    cells: [
      {
        disabled: true,
        id: "disabled-solid",
        usage: '<AppButton disabled label="Button" variant="primary" />',
        variant: "primary",
      },
      {
        disabled: true,
        id: "disabled-outline",
        labelStyle: { color: COLORS.text.secondary },
        usage: '<AppButton disabled label="Button" variant="outline" />',
        variant: "outline",
      },
      {
        disabled: true,
        id: "disabled-link",
        labelStyle: { color: COLORS.text.inverse },
        usage: '<AppButton disabled label="Button" variant="link" />',
        variant: "link",
      },
    ],
    id: "disabled",
  },
];

export function ButtonShowcase() {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <View
      className="w-full rounded-[20px] border-2 px-6 py-8 self-center"
      style={styles.matrixCard}
    >
      <View style={styles.rows}>
        {BUTTON_ROWS.map((row) => (
          <View key={row.id} style={isCompact ? styles.rowCompact : styles.rowWide}>
            {row.cells.map((cell, index) => (
              <View
                key={cell.id}
                style={index === 2 ? styles.linkCell : styles.buttonCell}
              >
                <Text style={[TYPOGRAPHY.body3, styles.cellUsage]}>{cell.usage}</Text>

                <AppButton
                  disabled={cell.disabled}
                  label={BUTTON_LABEL}
                  labelStyle={cell.labelStyle}
                  style={cell.style}
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
  buttonCell: {
    width: 176,
  },
  cellUsage: {
    color: COLORS.text.muted,
    textAlign: "center",
  },
  linkCell: {
    width: 96,
  },
  matrixCard: {
    borderColor: COLORS.base.gray300,
    maxWidth: 547,
    width: "100%",
  },
  rowCompact: {
    gap: 16,
  },
  rowWide: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  rows: {
    gap: 24,
  },
});
