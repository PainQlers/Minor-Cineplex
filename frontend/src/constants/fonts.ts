import type { FontSource } from "expo-font";

import {
  Roboto_400Regular,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import {
  RobotoCondensed_400Regular,
  RobotoCondensed_500Medium,
  RobotoCondensed_700Bold,
} from "@expo-google-fonts/roboto-condensed";

export const FONTS = {
  body: {
    medium: "Roboto_500Medium",
    regular: "Roboto_400Regular",
  },
  condensed: {
    bold: "RobotoCondensed_700Bold",
    medium: "RobotoCondensed_500Medium",
    regular: "RobotoCondensed_400Regular",
  },
} as const;

export const FONT_ASSETS: Record<string, FontSource> = {
  [FONTS.body.regular]: Roboto_400Regular,
  [FONTS.body.medium]: Roboto_500Medium,
  [FONTS.condensed.regular]: RobotoCondensed_400Regular,
  [FONTS.condensed.medium]: RobotoCondensed_500Medium,
  [FONTS.condensed.bold]: RobotoCondensed_700Bold,
};
