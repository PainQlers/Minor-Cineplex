import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.create(createShowtimeDto);
  }

  @Get()
  async findAll() {
    return this.showtimeService.findAll(); // หารอบฉายทั้งหมด
  }

  @Get('upcoming')
  async findUpcoming() {
    return this.showtimeService.findUpcoming();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.showtimeService.findByHall(id); // หาจาก id hall
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto) {
    return this.showtimeService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.showtimeService.remove(+id);
  }
}
