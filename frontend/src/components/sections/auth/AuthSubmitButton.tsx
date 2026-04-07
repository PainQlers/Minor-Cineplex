import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SubmitButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

// ── Submit Button ─────────────────────────────────────────────────────────────
const SubmitButton = ({ label, onPress, disabled = false }: SubmitButtonProps) => (
  <View className="mx-4 mt-6">
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={[
        'h-12 rounded-l items-center justify-center',
        disabled ? 'bg-[#3a5bbf]' : 'bg-[#4e7bee]',
      ].join(' ')}
    >
      <Text className="text-white font-semibold text-sm tracking-wide">
        {label}
      </Text>
    </TouchableOpacity>
  </View>
);

export default SubmitButton;