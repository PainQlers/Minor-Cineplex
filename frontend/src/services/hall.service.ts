import { Hall } from "@/types/hall";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL = 'http://localhost:3000';

export async function getHallInfoById(id: string): Promise<Hall> {

  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/hall/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("halls:", data);
    return data;
  } catch (err) {
    console.error("loadHalls error:", err);
    throw err;
  }
}