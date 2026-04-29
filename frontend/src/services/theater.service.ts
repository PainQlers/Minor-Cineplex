import { Theater } from "@/types/theater";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL = 'http://localhost:3000';

async function fetchTheaters<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is undefined");
  }

  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getTheaters(): Promise<Theater[]> {
  try {
    const data = await fetchTheaters<Theater[]>("/theaters");
    console.log("theaters:", data);
    return data;
  } catch (err) {
    console.error("loadTheaters error:", err);
    throw err;
  }
}

export async function getTheaterById(id: string): Promise<Theater> {
  try {
    const data = await fetchTheaters<Theater>(`/theaters/${id}`);
    console.log("theater:", data);
    return data;
  } catch (err) {
    console.error("loadTheater error:", err);
    throw err;
  }
}

export async function searchTheaters(query: string): Promise<Theater[]> {
  try {
    const keyword = query.trim();
    const path = keyword
      ? `/theaters/search?q=${encodeURIComponent(keyword)}`
      : "/theaters";

    const data = await fetchTheaters<Theater[]>(path);
    console.log("search theaters:", data);
    return data;
  } catch (err) {
    console.error("searchTheaters error:", err);
    throw err;
  }
}
