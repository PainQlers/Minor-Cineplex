export class CreateBookingDto {
  movieId: string;
  theaterId: string;
  showTime: string; // ISO datetime string
  seats: string[];
  userId?: string;
}
