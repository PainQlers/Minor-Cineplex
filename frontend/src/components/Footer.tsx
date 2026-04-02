import React from 'react';
import { View, Text } from 'react-native';

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ text }: { text: string }) => (
  <View className="border border-[#565f7e] rounded-md px-2 py-[2px]">
    <Text className="text-white text-[10px] font-medium">{text}</Text>
  </View>
);

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <View className="items-center mt-6 mb-4 gap-y-3">
    {/* Helper / disclaimer text */}
    <Text className="text-[#8b93b0] text-xs text-center px-8 leading-5">
      Already have an account? Login
    </Text>

  </View>
);

export default Footer;