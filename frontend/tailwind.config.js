/** @type {import('tailwindcss').Config} */
module.exports = {
  // แก้ไข content ให้ครอบคลุมทุกไฟล์ใน src
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // กันไว้สำหรับโครงสร้าง expo-router
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}