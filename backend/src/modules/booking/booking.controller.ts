import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const b = this.bookingService.findOne(id);
    if (!b) throw new NotFoundException('Booking not found');
    return b;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    const updated = this.bookingService.update(id, dto);
    if (!updated) throw new NotFoundException('Booking not found');
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const ok = this.bookingService.remove(id);
    if (!ok) throw new NotFoundException('Booking not found');
    return { success: true };
  }
}
