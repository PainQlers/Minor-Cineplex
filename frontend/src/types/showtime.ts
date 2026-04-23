import { Hall } from "./hall";
import { Movie } from "./movie";

export type Showtime = {
  id: string;
  movie_id: string;
  halls_id: string;
  start_time: string;
  price: number;
  halls: Hall;
  movies?: Movie | null;
};
