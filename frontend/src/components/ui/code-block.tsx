import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import CopyIcon from "../../../assets/icons/copy_light.svg";
import DoneIcon from "../../../assets/icons/done_round_light.svg";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY } from "../../constants/typography";
import { AppIcon } from "./icon";

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
      <Text 
        numberOfLines={1} 
        ellipsizeMode="middle"
        className="flex-1 mr-2"
        style={[TYPOGRAPHY.body3, { color: COLORS.text.muted }]}
      >
        {code}
      </Text>
      <TouchableOpacity 
        onPress={handleCopy}
        activeOpacity={0.7}
        className="p-1"
      >
        <AppIcon 
          icon={copied ? DoneIcon : CopyIcon} 
          size={16} 
          color={copied ? "#10B981" : COLORS.text.muted} 
        />
      </TouchableOpacity>
    </View>
  );
}
