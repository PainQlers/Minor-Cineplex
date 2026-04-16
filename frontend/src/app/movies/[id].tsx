import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Movie } from "@/types/movie";
import { getMovieById } from "@/services/movie.service";
import { Stack } from "expo-router";
import { LandingNavbar } from "@/components/landing-page/LandingNavbar";

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMovie = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMovieById(id);
                setMovie(data);
            } catch (err) {
                console.error("loadMovie error:", err);
                setError("โหลดรายละเอียดหนังไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator />
                <Text className="mt-3 text-white">Loading movie...</Text>
            </View>
        );
    }

    if (error || !movie) {
        return (
            <View className="flex-1 items-center justify-center bg-black px-6">
                <Text className="text-red-400">{error || "Movie not found"}</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView className="flex-1 bg-black" contentContainerStyle={{ paddingBottom: 32 }}>
                <LandingNavbar className="absolute top-0 left-0 right-0 z-10" />
                {!!movie.poster_url && (
                    <Image
                        source={{ uri: movie.poster_url }}
                        className="h-[520px] w-full bg-neutral-900"
                        resizeMode="cover"
                    />
                )}

                <View className="px-4 pt-6">
                    <Text className="text-3xl font-bold text-white">{movie.title}</Text>

                    <View className="mt-3 flex-row flex-wrap gap-2">
                        {!!movie.genre && (
                            <Text className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-200">
                                {movie.genre}
                            </Text>
                        )}

                        {!!movie.rating && (
                            <Text className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-200">
                                Rating: {movie.rating}
                            </Text>
                        )}

                        {!!movie.show_date && (
                            <Text className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-200">
                                {movie.show_date}
                            </Text>
                        )}
                    </View>

                    {!!movie.description && (
                        <View className="mt-6">
                            <Text className="mb-2 text-lg font-semibold text-white">Synopsis</Text>
                            <Text className="text-base leading-7 text-neutral-300">
                                {movie.description}
                            </Text>
                        </View>
                    )}

                    {!!movie.trailer_url && (
                        <View className="mt-6">
                            <Text className="mb-2 text-lg font-semibold text-white">Trailer URL</Text>
                            <Text className="text-blue-400">{movie.trailer_url}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
    );
}