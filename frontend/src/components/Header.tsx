import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// ── Hamburger Icon ────────────────────────────────────────────────────────────
const HamburgerIcon = () => (
  <View className="gap-y-[5px]">
    <View className="w-4 h-[1px] bg-white" />
    <View className="w-4 h-[1px] bg-white" />
    <View className="w-4 h-[1px] bg-white" />
  </View>
);

// ── Logo Mark ─────────────────────────────────────────────────────────────────
const LogoMark = () => (
  <View className="items-center">
    {/* Triangle notch above the M */}
    <View
      className="w-0 h-0"
      style={{
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#4e7bee',
        marginBottom: -1,
      }}
    />
    {/* "M" letterform rendered as a text label with gradient-like tint */}
    <Text
      className="text-xl font-black tracking-tighter"
      style={{ color: '#4e7bee', lineHeight: 20 }}
    >
      M
    </Text>
  </View>
);

// ── Header ────────────────────────────────────────────────────────────────────
const Header = () => (
  <View className="flex-row items-center justify-between px-5 py-3 bg-black/20 border-b border-[#21263f]">
    <LogoMark />
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      className="p-1"
    >
      <HamburgerIcon />
    </TouchableOpacity>
  </View>
);

export default Header;