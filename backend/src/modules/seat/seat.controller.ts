import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  async create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  @Get()
  async findAll() {
    return this.seatService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seatService.findOne(id); // หาจาก hall_id
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatService.update(+id, updateSeatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }
}
