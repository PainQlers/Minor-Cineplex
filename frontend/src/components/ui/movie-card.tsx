import React from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";
import StarFillIcon from "../../../assets/icons/Star_fill.svg";

export interface MovieCardProps {
  title: string;
  rating: number;
  genres: string[];
  languages: string;
  imageUrl: string;
  onPress?: () => void;
}

export function MovieCard({
  title,
  rating,
  genres,
  languages,
  imageUrl,
  onPress,
}: MovieCardProps) {
  return (
    <Pressable 
      onPress={onPress}
      className="w-[160px] mb-4"
    >
      <View className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        <Image 
          source={{ uri: imageUrl }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2 flex-row flex-wrap gap-1">
          <View className="bg-black/60 px-2 py-0.5 rounded">
            <Text style={TYPOGRAPHY.body3} className="text-white text-[10px]">
              {languages}
            </Text>
          </View>
        </View>
      </View>
      
      <View className="mt-2">
        <Text 
          style={TYPOGRAPHY.body1Medium} 
          className="text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
        
        <View className="flex-row items-center mt-1 gap-1">
          <AppIcon icon={StarFillIcon} size={12} color="#FFD700" />
          <Text style={TYPOGRAPHY.body3} className="text-gray-400">
            {rating.toFixed(1)}
          </Text>
        </View>

        <View className="flex-row flex-wrap mt-1 gap-1">
          {genres.map((genre, index) => (
            <Text 
              key={index} 
              style={TYPOGRAPHY.body3} 
              className="text-gray-500"
            >
              {genre}{index < genres.length - 1 ? " •" : ""}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
