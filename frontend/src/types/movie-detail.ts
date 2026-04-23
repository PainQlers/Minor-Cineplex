import { Showtime } from "./showtime";
import { Theater } from "./theater";

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type DateOption = {
  key: string;
  day: string;
  label: string;
};

export type HallGroup = {
  hallName: string;
  showtimes: Showtime[];
};

export type TheaterShowtimeGroup = {
  theater: Theater;
  distanceKm: number | null;
  halls: HallGroup[];
};
