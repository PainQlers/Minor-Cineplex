import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        backgroundColor: "#4E7BEE",
      },
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    outline: {
      containerStyle: {
        borderColor: "#8B93B0",
        borderWidth: 1,
      },
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    text: {
      labelStyle: {
        color: "#FFFFFF",
      },
    },
  },
  {
    id: "secondary",
    filled: {
      containerStyle: {
        backgroundColor: "#1E29A8",
      },
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    outline: {
      containerStyle: {
        backgroundColor: "#8B93B0",
      },
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    text: {
      labelStyle: {
        color: "#C8CEDD",
      },
    },
  },
  {
    id: "dark",
    filled: {
      containerStyle: {
        backgroundColor: "#0C1580",
      },
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    outline: {
      containerStyle: {
        backgroundColor: "#565F7E",
      },
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    text: {
      labelStyle: {
        color: "#8B93B0",
      },
    },
  },
  {
    id: "disabled",
    filled: {
      containerStyle: {
        backgroundColor: "#4E7BEE",
        opacity: 0.4,
      },
      disabled: true,
      labelStyle: {
        color: "#FFFFFF",
      },
    },
    outline: {
      containerStyle: {
        borderColor: "#8B93B0",
        borderWidth: 1,
        opacity: 0.4,
      },
      disabled: true,
      labelStyle: {
        color: "#C8CEDD",
      },
    },
    text: {
      labelStyle: {
        color: "#21263F",
      },
    },
  },
];

export function ButtonShowcase() {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      <View pointerEvents="none" style={styles.blueGlow} />
      <View pointerEvents="none" style={styles.purpleGlow} />

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full rounded-[20px] border-2 border-[#BB97D8] bg-[#0F1631] px-6 py-8"
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
    backgroundColor: "#4E7BEE",
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
    backgroundColor: "#BB97D8",
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
