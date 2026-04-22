import { Showtime } from "@/types/showtime";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_BASE_URL = 'http://localhost:3000';

export async function getShowtimeById(id: string): Promise<Showtime> {

  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/showtime/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("showtime:", data);
    return data;
  } catch (err) {
    console.error("showtime error:", err);
    throw err;
  }
}

export async function getUpcomingShowtimes(): Promise<Showtime[]> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/showtime/upcoming`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("upcoming showtimes:", data);
    return data;
  } catch (err) {
    console.error("upcoming showtimes error:", err);
    throw err;
  }
}
