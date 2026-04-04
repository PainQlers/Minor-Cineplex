import { View, Text } from "react-native";

interface MovieInfoCardProps {
  hall: string;
}

export default function MovieInfoCard({ hall }: MovieInfoCardProps) {
  return (
    <View className="px-5 py-4">
      <View className="flex-row gap-4 mb-5">
        <View className="w-[72px] h-[90px] rounded-xl bg-[#1A1E38] flex-shrink-0" />

        <View className="flex-1 justify-center gap-2">
          <Text className="text-white font-bold text-lg leading-tight">The Dark Knight</Text>
          <View className="flex-row items-center gap-2 flex-wrap">
            <GenreTag label="Action" />
            <GenreTag label="Crime" />
            <GenreTag label="TH" highlight />
          </View>
        </View>
      </View>

      <View className="flex-col gap-3">
        <DetailRow icon="📍" text="Minor Cineplex Arkham" />
        <DetailRow icon="📅" text="24 Jun 2024" />
        <DetailRow icon="⏰" text="16:30" />
        <DetailRow icon="🗺️" text={hall} />
      </View>
    </View>
  );
}

function GenreTag({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <Text className={`px-3 py-0.5 rounded-full text-xs font-medium ${highlight ? "bg-blue-600 text-white" : "bg-[#1E2238] text-gray-300"}`}>
      {label}
    </Text>
  );
}

function DetailRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-gray-500">{icon}</Text>
      <Text className="text-sm text-gray-300">{text}</Text>
    </View>
  );
}
