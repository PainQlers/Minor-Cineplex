/** @type {import('tailwindcss').Config} */
module.exports = {
  // แก้ไข content ให้ครอบคลุมทุกไฟล์ใน src
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // กันไว้สำหรับโครงสร้าง expo-router
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        base: {
          gray0: "#070C1B",
          gray100: "#21263F",
          gray200: "#565F7E",
          gray300: "#8B93B0",
          gray400: "#C8CEDD",
          white: "#FFFFFF",
        },
        brand: {
          blue100: "#4E7BEE",
          blue200: "#1E29A8",
          blue300: "#0C1580",
        },
        semantic: {
          success: "#00A372",
          danger: "#E5364B",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#C8CEDD",
          muted: "#8B93B0",
          subtle: "#565F7E",
          inverse: "#21263F",
        },
        surface: {
          canvas: "#070C1B",
          panel: "#21263F",
        },
      },

      // Font families #ex. font-body, font-bodyMedium
      fontFamily: {
        body: ["Roboto_400Regular"],
        bodyMedium: ["Roboto_500Medium"],
        condensed: ["RobotoCondensed_400Regular"],
        condensedMedium: ["RobotoCondensed_500Medium"],
        condensedBold: ["RobotoCondensed_700Bold"],
      },

      // Font sizes #ex. text-body1medium
      fontSize: {
        screenTitle: ["32px", { lineHeight: "40px" }],
        sectionTitle: ["20px", { lineHeight: "28px" }],
        headline1: ["56px", { lineHeight: "64px" }],
        headline2: ["36px", { lineHeight: "44px" }],
        headline3: ["24px", { lineHeight: "30px" }],
        headline4: ["20px", { lineHeight: "26px" }],
        body1medium: ["16px", { lineHeight: "24px" }],
        body1regular: ["16px", { lineHeight: "22px" }],
        body2medium: ["14px", { lineHeight: "22px" }],
        body2regular: ["14px", { lineHeight: "20px" }],
        body3: ["12px", { lineHeight: "18px" }],
      },
    },
  },
  plugins: [],
};
