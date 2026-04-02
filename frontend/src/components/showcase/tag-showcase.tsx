import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppTag } from "../ui/tag";

interface TagCell {
  disabled?: boolean;
  id: string;
  label: string;
  selected?: boolean;
  usage: string;
}

interface TagRow {
  id: string;
  cells: [TagCell, TagCell, TagCell, TagCell];
}

const TAG_ROWS: TagRow[] = [
  {
    id: "default",
    cells: [
      {
        id: "unselected",
        selected: false,
        label: "Genre",
        usage: '<AppTag label="Genre" />',
      },
      {
        id: "selected",
        selected: true,
        label: "Language",
        usage: '<AppTag selected label="Language" />',
      },
      {
        id: "disabled-unselected",
        disabled: true,
        label: "Duration",
        usage: '<AppTag disabled label="Duration" />',
      },
      {
        id: "disabled-selected",
        selected: true,
        disabled: true,
        label: "Rating",
        usage: '<AppTag selected disabled label="Rating" />',
      },
    ],
  },
];

export function TagShowcase() {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <View
      className="w-full rounded-[20px] border-2 px-6 py-8 self-center"
      style={styles.matrixCard}
    >
      <View style={styles.rows}>
        {TAG_ROWS.map((row) => (
          <View key={row.id} style={isCompact ? styles.rowCompact : styles.rowWide}>
            {row.cells.map((cell) => (
              <View key={cell.id} style={styles.cellContainer}>
                <Text style={[TYPOGRAPHY.body3, styles.cellUsage]}>
                  {cell.usage}
                </Text>

                <AppTag
                  disabled={cell.disabled}
                  label={cell.label}
                  selected={cell.selected}
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
