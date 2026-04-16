import { Seat } from "@/types/seat";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL = 'http://localhost:3000';

export async function getSeatByHallId(id: string): Promise<Seat[]> {

  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/seat/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as Seat[];
    console.log("seats:", data);
    return data;
  } catch (err) {
    console.error("loadSeats error:", err);
    throw err;
  }
}