export class UpdateBookingDto {
  seats?: string[];
  status?: 'pending' | 'confirmed' | 'cancelled';
}
