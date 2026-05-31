import { Image, View, Text } from "react-native";

interface MovieInfoCardProps {
  hall: string;
  date: string;
  showtime: string;
  theater: string;
  movie: string;
  genre: string;
  poster: string | null;
}

export default function MovieInfoCard({ hall, date, showtime, theater, movie, genre, poster }: MovieInfoCardProps) {
  return (
    <View className="px-5 py-4">
      <View className="flex-row gap-4 mb-5">
        {poster ? (
          <Image 
            source={{ uri: poster }} 
            className="w-[72px] h-[90px] rounded-xl bg-[#1A1E38]" 
            resizeMode="cover"
          />
        ) : (
          <View className="w-[72px] h-[90px] rounded-xl bg-[#1A1E38]" />
        )}

        <View className="flex-1 justify-center gap-2">
          {/* ป้องกัน Text ว่างจน DOM รวน */}
          <Text className="text-white font-bold text-lg leading-tight">
            {movie || " "}
          </Text>
          <View className="flex-row items-center gap-2 flex-wrap">
            <GenreTag label={genre || "Genre"} />
          </View>
        </View>
      </View>

      <View className="flex-col gap-3">
        <DetailRow icon="📍" text={theater} />
        <DetailRow icon="📅" text={date} />
        <DetailRow icon="⏰" text={showtime} />
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
      <Text key={`icon-${icon}`} className="text-gray-500">{icon}</Text>
      <Text key={`text-${text}`} className="text-sm text-gray-300">{text || ""}</Text>
    </View>
  );
}
