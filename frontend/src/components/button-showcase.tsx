import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../constants/colors";
import {
  ShowcaseButton,
  type ShowcaseButtonPreset,
} from "./ui/showcase-button";
import { ShowcaseLink, type ShowcaseLinkPreset } from "./ui/showcase-link";

interface ShowcaseRow {
  id: string;
  filled: ShowcaseButtonPreset;
  outline: ShowcaseButtonPreset;
  text: ShowcaseLinkPreset;
}

const BUTTON_LABEL = "Button";

const SHOWCASE_ROWS: ShowcaseRow[] = [
  {
    id: "primary",
    filled: {
      containerStyle: {
        backgroundColor: COLORS.brand.blue100,
      },
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    outline: {
      containerStyle: {
        borderColor: COLORS.base.gray300,
        borderWidth: 1,
      },
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    text: {
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
  },
  {
    id: "secondary",
    filled: {
      containerStyle: {
        backgroundColor: COLORS.brand.blue200,
      },
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    outline: {
      containerStyle: {
        backgroundColor: COLORS.base.gray300,
      },
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    text: {
      labelStyle: {
        color: COLORS.text.secondary,
      },
    },
  },
  {
    id: "dark",
    filled: {
      containerStyle: {
        backgroundColor: COLORS.brand.blue300,
      },
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    outline: {
      containerStyle: {
        backgroundColor: COLORS.base.gray200,
      },
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    text: {
      labelStyle: {
        color: COLORS.text.muted,
      },
    },
  },
  {
    id: "disabled",
    filled: {
      containerStyle: {
        backgroundColor: COLORS.brand.blue100,
        opacity: 0.4,
      },
      disabled: true,
      labelStyle: {
        color: COLORS.text.primary,
      },
    },
    outline: {
      containerStyle: {
        borderColor: COLORS.base.gray300,
        borderWidth: 1,
        opacity: 0.4,
      },
      disabled: true,
      labelStyle: {
        color: COLORS.text.secondary,
      },
    },
    text: {
      labelStyle: {
        color: COLORS.text.inverse,
      },
    },
  },
];

export function ButtonShowcase() {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <SafeAreaView className="flex-1" style={styles.screen}>
      <View pointerEvents="none" style={styles.blueGlow} />
      <View pointerEvents="none" style={styles.purpleGlow} />

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full rounded-[20px] border-2 px-6 py-8"
          style={styles.card}
        >
          <View style={styles.rows}>
            {SHOWCASE_ROWS.map((row) => (
              <View
                key={row.id}
                style={isCompact ? styles.rowCompact : styles.rowWide}
              >
                <View style={styles.buttonPair}>
                  <ShowcaseButton label={BUTTON_LABEL} preset={row.filled} />
                  <ShowcaseButton label={BUTTON_LABEL} preset={row.outline} />
                </View>

                <View style={isCompact ? styles.linkCompact : styles.linkWide}>
                  <ShowcaseLink label={BUTTON_LABEL} preset={row.text} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  blueGlow: {
    backgroundColor: COLORS.brand.blue100,
    borderRadius: 140,
    height: 280,
    opacity: 0.12,
    position: "absolute",
    right: -80,
    top: -100,
    width: 280,
  },
  buttonPair: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    alignSelf: "center",
    backgroundColor: COLORS.surface.panel,
    borderColor: COLORS.base.gray300,
    maxWidth: 547,
  },
  linkCompact: {
    alignItems: "flex-end",
  },
  linkWide: {
    justifyContent: "center",
    marginLeft: "auto",
  },
  purpleGlow: {
    backgroundColor: COLORS.brand.blue200,
    borderRadius: 120,
    bottom: -80,
    height: 240,
    left: -60,
    opacity: 0.1,
    position: "absolute",
    width: 240,
  },
  rowCompact: {
    gap: 12,
  },
  rowWide: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  screen: {
    backgroundColor: COLORS.surface.canvas,
  },
  rows: {
    gap: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
});
