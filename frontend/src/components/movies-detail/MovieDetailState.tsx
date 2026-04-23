import { ActivityIndicator, Text, View } from "react-native";

type MovieDetailLoadingProps = {
  label?: string;
};

type MovieDetailErrorProps = {
  message: string;
};

export function MovieDetailLoading({ label = "Loading movie..." }: MovieDetailLoadingProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#101525]">
      <ActivityIndicator color="#4E7BEE" />
      <Text className="mt-3 font-condensed text-body1regular text-text-secondary">
        {label}
      </Text>
    </View>
  );
}

export function MovieDetailError({ message }: MovieDetailErrorProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#101525] px-6">
      <Text className="text-center font-condensed text-body1regular text-semantic-danger">
        {message}
      </Text>
    </View>
  );
}
