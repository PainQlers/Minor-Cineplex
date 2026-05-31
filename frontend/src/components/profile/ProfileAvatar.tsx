import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Svg, Path, Circle } from "react-native-svg";

interface ProfileAvatarProps {
  url?: string | null;
  previewUri?: string | null;
  onUpload: () => void;
  isLoading?: boolean;
}

export default function ProfileAvatar({ url, previewUri, onUpload, isLoading }: ProfileAvatarProps) {
  return (
    <View className="flex-row items-end gap-x-4">
      {/* Avatar circle */}
      <View className="w-[120px] h-[120px] rounded-full bg-gray-700 items-center justify-center overflow-hidden">
        {previewUri ? (
          <Image
            source={{ uri: previewUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : url ? (
          // ถ้ามี URL ให้แสดงรูปภาพ
          <Image 
            source={{ uri: url }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          // ถ้าไม่มี URL ให้แสดง SVG Placeholder อันเดิม
          <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <Path
              d="M39.4548 40.8942C38.5432 38.3426 36.5345 36.0879 33.7402 34.4798C30.9459 32.8717 27.5222 32 24 32C20.4779 32 17.0541 32.8716 14.2598 34.4798C11.4655 36.0879 9.45679 38.3426 8.54519 40.8942"
              stroke="#8B93B0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Circle 
              cx="24" 
              cy="16" 
              r="8" 
              stroke="#8B93B0" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
          </Svg>
        )}
      </View>

      {/* Upload button */}
      <TouchableOpacity 
        onPress={onUpload}
        activeOpacity={0.7}
      >
        <Text className="font-bold text-base text-white underline leading-6">
          Upload
        </Text>
      </TouchableOpacity>
    </View>
  );
}