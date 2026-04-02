import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { AppCheckbox } from "./ui/checkbox";

interface CheckboxCell {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  usage: string;
}

interface CheckboxRow {
  id: string;
  cells: [CheckboxCell, CheckboxCell, CheckboxCell, CheckboxCell];
}

const CHECKBOX_ROWS: CheckboxRow[] = [
  {
    id: "default",
    cells: [
      {
        id: "unchecked",
        checked: false,
        label: "Option 1",
        usage: '<AppCheckbox label="Option 1" />',
      },
      {
        id: "checked",
        checked: true,
        label: "Option 1",
        usage: '<AppCheckbox checked label="Option 1" />',
      },
      {
        id: "disabled-unchecked",
        disabled: true,
        label: "Option 1",
        usage: '<AppCheckbox disabled label="Option 1" />',
      },
      {
        id: "disabled-checked",
        checked: true,
        disabled: true,
        label: "Option 1",
        usage: '<AppCheckbox checked disabled label="Option 1" />',
      },
    ],
  },
];

export function CheckboxShowcase() {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <View
      className="w-full rounded-[20px] border-2 px-6 py-8 self-center"
      style={styles.matrixCard}
    >
      <View style={styles.rows}>
        {CHECKBOX_ROWS.map((row) => (
          <View key={row.id} style={isCompact ? styles.rowCompact : styles.rowWide}>
            {row.cells.map((cell) => (
              <View key={cell.id} style={styles.cellContainer}>
                <Text style={[TYPOGRAPHY.body3, styles.cellUsage]}>
                  {cell.usage}
                </Text>

                <AppCheckbox
                  checked={cell.checked}
                  disabled={cell.disabled}
                  label={cell.label}
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
  cellContainer: {
    gap: 12,
    alignItems: "flex-start",
  },
  cellUsage: {
    color: COLORS.text.muted,
    textAlign: "center",
  },
  matrixCard: {
    borderColor: COLORS.base.gray300,
    width: "100%",
  },
  rowCompact: {
    gap: 16,
    flexDirection: "row",
    flexWrap: "wrap",
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
