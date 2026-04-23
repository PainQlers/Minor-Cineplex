import { Movie } from "@/types/movie";
import {
  DateOption,
  GeoPoint,
  HallGroup,
  TheaterShowtimeGroup,
} from "@/types/movie-detail";
import { Showtime } from "@/types/showtime";
import { Theater } from "@/types/theater";

const EARTH_RADIUS_KM = 6371;

export const BANGKOK_CENTER: GeoPoint = { lat: 13.7563, lng: 100.5018 };

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceInKm(from: GeoPoint, to: GeoPoint) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

function extractCoordinatesFromMapUrl(mapUrl?: string | null): GeoPoint | null {
  if (!mapUrl) {
    return null;
  }

  const directMatch = mapUrl.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);

  if (directMatch) {
    return {
      lat: Number(directMatch[1]),
      lng: Number(directMatch[2]),
    };
  }

  const atMatch = mapUrl.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (atMatch) {
    return {
      lat: Number(atMatch[1]),
      lng: Number(atMatch[2]),
    };
  }

  try {
    const parsed = new URL(mapUrl);
    const coordinateText =
      parsed.searchParams.get("q") ?? parsed.searchParams.get("query");
    const qMatch = coordinateText?.match(
      /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/,
    );

    if (!qMatch) {
      return null;
    }

    return {
      lat: Number(qMatch[1]),
      lng: Number(qMatch[2]),
    };
  } catch {
    return null;
  }
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
    date.getDate(),
  )}`;
}

export function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function createDateOption(date: Date, todayKey: string): DateOption {
  const key = toDateKey(date);

  return {
    key,
    day:
      key === todayKey
        ? "Today"
        : date.toLocaleDateString("en-US", { weekday: "short" }),
    label: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

export function getDateOptions(showtimes: Showtime[] = []): DateOption[] {
  const today = new Date();
  const todayKey = toDateKey(today);

  if (showtimes.length > 0) {
    const dateKeys = Array.from(
      new Set(showtimes.map((showtime) => toDateKey(showtime.start_time))),
    ).sort();

    return dateKeys.map((dateKey) =>
      createDateOption(dateFromKey(dateKey), todayKey),
    );
  }

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return createDateOption(date, todayKey);
  });
}

export function formatShowtime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatReleaseDate(value?: string | null) {
  if (!value) {
    return "Release date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return `Release date: ${value}`;
  }

  return `Release date: ${new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

export function formatDateLabel(dateKey: string) {
  return dateFromKey(dateKey).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getMovieTags(movie: Movie) {
  const genreTags =
    movie.genre
      ?.split(/[,/|]/)
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];

  return [...genreTags, movie.rating].filter(Boolean).slice(0, 5) as string[];
}

export function getTheater(showtime: Showtime) {
  return showtime.halls?.theaters ?? null;
}

function getTheaterDistance(theater: Theater, referenceLocation: GeoPoint) {
  const coordinates = extractCoordinatesFromMapUrl(theater.google_map_url);

  if (!coordinates) {
    return null;
  }

  return getDistanceInKm(referenceLocation, coordinates);
}

export function buildTheaterGroups(
  showtimes: Showtime[],
  referenceLocation: GeoPoint,
): TheaterShowtimeGroup[] {
  const byTheater = new Map<string, TheaterShowtimeGroup>();

  showtimes.forEach((showtime) => {
    const theater = getTheater(showtime);

    if (!theater) {
      return;
    }

    const currentGroup =
      byTheater.get(theater.id) ??
      ({
        theater,
        distanceKm: getTheaterDistance(theater, referenceLocation),
        halls: [],
      } satisfies TheaterShowtimeGroup);

    const hallName = showtime.halls?.name?.trim() || "Hall";
    const currentHall =
      currentGroup.halls.find((hall) => hall.hallName === hallName) ??
      ({
        hallName,
        showtimes: [],
      } satisfies HallGroup);

    currentHall.showtimes.push(showtime);

    if (!currentGroup.halls.includes(currentHall)) {
      currentGroup.halls.push(currentHall);
    }

    byTheater.set(theater.id, currentGroup);
  });

  return Array.from(byTheater.values())
    .map((group) => ({
      ...group,
      halls: group.halls
        .map((hall) => ({
          ...hall,
          showtimes: hall.showtimes.sort(
            (showtimeA, showtimeB) =>
              new Date(showtimeA.start_time).getTime() -
              new Date(showtimeB.start_time).getTime(),
          ),
        }))
        .sort((hallA, hallB) => hallA.hallName.localeCompare(hallB.hallName)),
    }))
    .sort((groupA, groupB) => {
      if (groupA.distanceKm === null && groupB.distanceKm === null) {
        return groupA.theater.name.localeCompare(groupB.theater.name);
      }

      if (groupA.distanceKm === null) {
        return 1;
      }

      if (groupB.distanceKm === null) {
        return -1;
      }

      return groupA.distanceKm - groupB.distanceKm;
    });
}
