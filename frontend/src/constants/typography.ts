import { type TextStyle } from "react-native";

import { FONTS } from "./fonts";

export const TYPOGRAPHY = {
  screenTitle: {
    fontFamily: FONTS.body.medium,
    fontSize: 32,
    letterSpacing: -0.64,
    lineHeight: 40,
  },
  sectionTitle: {
    fontFamily: FONTS.body.regular,
    fontSize: 20,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  headline1: {
    fontFamily: FONTS.condensed.bold,
    fontSize: 56,
    letterSpacing: 0,
    lineHeight: 64,
  },
  headline2: {
    fontFamily: FONTS.condensed.bold,
    fontSize: 36,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headline3: {
    fontFamily: FONTS.condensed.bold,
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
  },
  headline4: {
    fontFamily: FONTS.condensed.bold,
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 26,
  },
  body1Medium: {
    fontFamily: FONTS.condensed.bold,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  body1Regular: {
    fontFamily: FONTS.condensed.regular,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  body2Medium: {
    fontFamily: FONTS.condensed.medium,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  body2Regular: {
    fontFamily: FONTS.condensed.regular,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  body3: {
    fontFamily: FONTS.condensed.regular,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 18,
  },
  label: {
    fontFamily: FONTS.body.medium,
    fontSize: 14,
    letterSpacing: -0.28,
    lineHeight: 20,
  },
  labelCondensed: {
    fontFamily: FONTS.condensed.regular,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  },
  button: {
    fontFamily: FONTS.condensed.bold,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
} satisfies Record<string, TextStyle>;
