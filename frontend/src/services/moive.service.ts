import { Movie } from "@/types/movie";
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${DATABASE_URL}/movies`);

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  const data = await response.json();
  return data;
}