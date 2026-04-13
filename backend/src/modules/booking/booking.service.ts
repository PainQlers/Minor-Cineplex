import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  private bookings: Booking[] = [];

  create(dto: CreateBookingDto): Booking {
    const booking: Booking = {
      id: Date.now().toString(),
      movieId: dto.movieId,
      theaterId: dto.theaterId,
      showTime: dto.showTime,
      seats: dto.seats || [],
      userId: dto.userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(booking);
    return booking;
  }

  findAll(): Booking[] {
    return [...this.bookings];
  }

  findOne(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  update(id: string, dto: UpdateBookingDto): Booking | undefined {
    const booking = this.findOne(id);
    if (!booking) return undefined;
    if (dto.seats) booking.seats = dto.seats;
    if (dto.status) booking.status = dto.status;
    return booking;
  }

  remove(id: string): boolean {
    const len = this.bookings.length;
    this.bookings = this.bookings.filter(b => b.id !== id);
    return this.bookings.length < len;
  }
}
