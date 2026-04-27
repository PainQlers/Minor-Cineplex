import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

// เปลี่ยนจาก InputHTMLAttributes เป็น TextInputProps ของ React Native
interface InputFieldProps extends TextInputProps {
  label: string;
}

export default function InputField({ label, ...props }: InputFieldProps) {
  return (
    <View className="flex flex-col gap-y-1 w-full">
      {/* Label */}
      <Text className="font-normal text-base text-gray-400 leading-6">
        {label}
      </Text>

      {/* Input Container */}
      <View className="flex-row items-start w-full rounded border border-gray-700 bg-gray-800 px-4 py-3">
        <TextInput
          className="flex-1 font-normal text-base text-white leading-6"
          placeholderTextColor="#4B5563" // ปรับสี placeholder ให้ใกล้เคียง base-gray-200
          cursorColor="#FFFFFF" // สีของเส้น cursor เวลาพิมพ์
          {...props}
        />
      </View>
    </View>
  );
}