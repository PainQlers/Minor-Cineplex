import { Movie } from "@/types/movie";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL = "http://localhost:3000";

export async function getMovies(): Promise<Movie[]> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/movies`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("movies:", data);
    return data;
  } catch (err) {
    console.error("loadMovies error:", err);
    throw err;
  }
}

export async function getMovieById(id: string): Promise<Movie> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/movies/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("movies:", data);
    return data;
  } catch (err) {
    console.error("loadMovies error:", err);
    throw err;
  }
}
