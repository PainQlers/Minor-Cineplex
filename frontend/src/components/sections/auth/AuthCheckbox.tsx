import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function Checkbox({ label, checked, onToggle }: CheckboxProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-2"
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View className="w-5 h-5 rounded border border-[#8b93b0] items-center justify-center">
        {checked && <View className="w-2.5 h-2.5 rounded-sm bg-[#4e7bee]" />}
      </View>
      <Text className="text-[#8b93b0] text-xs">{label}</Text>
    </TouchableOpacity>
  );
}