import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

// ── Search Bar ────────────────────────────────────────────────────────────────
const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <View className="mx-4 my-3">
      {/* Label */}
      <Text className="text-[#c8cedd] text-xs mb-2 tracking-wide">
        Name here
      </Text>

      {/* Input field */}
      <View className="flex-row items-center bg-[#21263f] border border-[#565f7e] rounded-lg px-4 h-12">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="full_name, email_anal..."
          placeholderTextColor="#8b93b0"
          className="flex-1 text-white text-sm"
          style={{ color: '#ffffff' }}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search input"
        />
      </View>
    </View>
  );
};

export default SearchBar;