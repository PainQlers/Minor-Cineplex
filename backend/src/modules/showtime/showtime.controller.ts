import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeGeneratorService } from './showtime-generator.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { format, addDays } from 'date-fns';

@Controller('showtime')
export class ShowtimeController {
  constructor(
    private readonly showtimeService: ShowtimeService,
    private readonly generatorService: ShowtimeGeneratorService,
  ) {}

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

  @Get('movie/:movieId')
  async findByMovie(
    @Param('movieId') movieId: string,
    @Query('days') days?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('includePastForDev') includePastForDev?: string,
  ) {
    return this.showtimeService.findByMovie(movieId, {
      days: days ? Number(days) : undefined,
      from,
      to,
      includePastForDev: includePastForDev === 'true',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.showtimeService.findByHall(id); // หาจาก id hall
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimeService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.showtimeService.remove(+id);
  }

  @Post('generate/daily')
  async generateDaily(@Query('date') date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const result = await this.generatorService.generateDailyShowtimes();
    return {
      message: `Generated ${result.created} showtimes for 14 days ahead, deleted ${result.deleted} old showtimes`,
      targetDate: format(addDays(targetDate, 14), 'yyyy-MM-dd'),
      generated: result.created,
      deleted: result.deleted,
    };
  }

  @Post('generate/custom')
  async manualGenerate(@Query('date') date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const count = await this.generatorService.manualGenerateForDate(targetDate);
    return {
      message: `Generated ${count} showtimes`,
      date: targetDate,
      generated: count,
    };
  }
}
