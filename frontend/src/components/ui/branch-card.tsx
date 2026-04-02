import React from "react";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";
import PinFillIcon from "../../../assets/icons/pin_fill.svg";

export interface BranchCardProps {
  name: string;
  distance: string;
  address: string;
  onPress?: () => void;
}

export function BranchCard({
  name,
  distance,
  address,
  onPress,
}: BranchCardProps) {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center bg-gray-900 border border-gray-800 rounded-lg p-4 mx-4 mb-4"
    >
      <View className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center mr-4">
        <AppIcon icon={PinFillIcon} size={24} color="#FFFFFF" />
      </View>
      
      <View className="flex-1">
        <Text 
          style={TYPOGRAPHY.headline4} 
          className="text-white"
          numberOfLines={1}
        >
          {name}
        </Text>
        
        <View className="flex-row items-center mt-1 gap-2">
          <View className="border border-gray-700 px-2 py-0.5 rounded">
            <Text style={TYPOGRAPHY.body3} className="text-white">
              {distance}
            </Text>
          </View>
          <Text 
            style={TYPOGRAPHY.body3} 
            className="text-gray-500 flex-1"
            numberOfLines={1}
          >
            {address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
