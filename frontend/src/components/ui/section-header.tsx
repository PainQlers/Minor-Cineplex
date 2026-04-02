import React from "react";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";
import ExpandRightIcon from "../../../assets/icons/expand_right_light.svg";

export interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export function SectionHeader({
  title,
  onViewAll,
  showViewAll = true,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-4 w-full">
      <Text style={TYPOGRAPHY.headline3} className="text-white">
        {title}
      </Text>
      
      {showViewAll && (
        <Pressable 
          onPress={onViewAll}
          className="flex-row items-center gap-1"
        >
          <Text style={TYPOGRAPHY.body2Regular} className="text-gray-400">
            View all
          </Text>
          <AppIcon icon={ExpandRightIcon} size={16} color={COLORS.text.muted} />
        </Pressable>
      )}
    </View>
  );
}
