const base = {
  gray0: "#070C1B",
  gray100: "#21263F",
  gray200: "#565F7E",
  gray300: "#8B93B0",
  gray400: "#C8CEDD",
  white: "#FFFFFF",
} as const;

const brand = {
  blue100: "#4E7BEE",
  blue200: "#1E29A8",
  blue300: "#0C1580",
} as const;

const semantic = {
  success: "#00A372",
  danger: "#E5364B",
} as const;

export const COLORS = {
  base,
  brand,
  semantic,
  surface: {
    canvas: base.gray0,
    panel: base.gray100,
  },
  text: {
    inverse: base.gray100,
    muted: base.gray300,
    primary: base.white,
    secondary: base.gray400,
    subtle: base.gray200,
  },
} as const;
