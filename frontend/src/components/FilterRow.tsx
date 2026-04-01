import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FilterRowProps {
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

// ── Filter Row ────────────────────────────────────────────────────────────────
const FilterRow = ({
  label,
  placeholder = '',
  secureTextEntry = false,
  value,
  onChangeText,
}: FilterRowProps) => {
  const [localValue, setLocalValue] = useState(value ?? '');

  const handleChange = (text: string) => {
    setLocalValue(text);
    onChangeText?.(text);
  };

  return (
    <View className="mx-4 my-2">
      {/* Label */}
      <Text className="text-[#c8cedd] text-xs mb-2 tracking-wide">{label}</Text>

      {/* Input */}
      <View className="bg-[#21263f] border border-[#565f7e] rounded-l px-4 h-12 flex-row items-center">
        <TextInput
          value={localValue}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#8b93b0"
          secureTextEntry={secureTextEntry}
          className="flex-1 text-[#8b93b0] text-sm"
          style={{ color: '#8b93b0' }}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
};

export default FilterRow;