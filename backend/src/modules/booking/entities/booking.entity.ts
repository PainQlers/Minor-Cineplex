export interface Booking {
  id: string;
  movieId: string;
  theaterId: string;
  showTime: string; // ISO datetime
  seats: string[];
  userId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
