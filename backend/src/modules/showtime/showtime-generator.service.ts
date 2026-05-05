import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SupabaseService } from '@/libs/supabase/supabase.service';
import {
  addDays,
  subDays,
  setHours,
  setMinutes,
  format,
  isAfter,
  addMinutes,
  startOfDay,
  endOfDay,
} from 'date-fns';

interface Movie {
  id: string;
  show_date: string;
}

interface Hall {
  id: string;
  theater_id: string;
  name: string;
}

interface Theater {
  id: string;
  name: string;
}

@Injectable()
export class ShowtimeGeneratorService {
  private readonly logger = new Logger(ShowtimeGeneratorService.name);
  private readonly PRICE = 180;
  private readonly START_HOUR = 10;
  private readonly END_HOUR = 22;
  private readonly MIN_ROUNDS = 3;
  private readonly MAX_ROUNDS = 5;
  private readonly MIN_GAP_MINUTES = 150; // 2.5 hours
  private readonly MAX_GAP_MINUTES = 210; // 3.5 hours
  private readonly MINUTE_INTERVALS = [0, 15, 30, 45];

  constructor(private readonly supabaseService: SupabaseService) {}

  async generateDailyShowtimes(): Promise<{ created: number; deleted: number }> {
    this.logger.log('Starting daily showtime generation...');

    const today = new Date();
    const daysAhead = 7;  // สร้างรอบ 7 วันล่วงหน้า

    try {
      // ลบรอบหนังเก่ากว่า 3 วัน
      const deletedCount = await this.deleteOldShowtimes();
      this.logger.log(`Deleted ${deletedCount} old showtimes`);

      const activeMovies = await this.getActiveMovies();
      const theaters = await this.getAllTheaters();

      this.logger.log(`Found ${activeMovies.length} active movies`);
      this.logger.log(`Found ${theaters.length} theaters`);

      if (activeMovies.length === 0) {
        this.logger.warn('No active movies found, skipping generation');
        return { created: 0, deleted: deletedCount };
      }

      let totalCreated = 0;

      // สร้างรอบสำหรับแต่ละวัน (วันนี้ถึง 7 วันล่วงหน้า)
      for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
        const targetDate = addDays(today, dayOffset);
        this.logger.log(
          `Generating showtimes for: ${format(targetDate, 'yyyy-MM-dd')}`,
        );

        for (const theater of theaters) {
          const createdCount = await this.generateForTheater(
            theater,
            activeMovies,
            targetDate,
          );
          totalCreated += createdCount;
        }
      }

      this.logger.log(
        `Successfully created ${totalCreated} showtimes, deleted ${deletedCount} old showtimes`,
      );
      return { created: totalCreated, deleted: deletedCount };
    } catch (error) {
      this.logger.error('Failed to generate showtimes:', error);
      throw error;
    }
  }

  private async deleteOldShowtimes(): Promise<number> {
    const supabase = this.supabaseService.getClient();
    const cutoffDate = subDays(new Date(), 3);  // ลบรอบเก่ากว่า 3 วัน

    this.logger.log(
      `Deleting showtimes older than: ${format(cutoffDate, 'yyyy-MM-dd')}`,
    );

    const { error, count } = await supabase
      .from('showtimes')
      .delete({ count: 'exact' })
      .lt('start_time', cutoffDate.toISOString());

    if (error) {
      this.logger.error(`Failed to delete old showtimes: ${error.message}`);
      throw new Error(`Failed to delete old showtimes: ${error.message}`);
    }

    return count || 0;
  }

  private getClosestMovies(
    movies: Movie[],
    targetDate: Date,
    limit: number,
  ): Movie[] {
    // เรียง movies ตามความใกล้ชิดของ show_date กับ targetDate
    const sortedMovies = [...movies].sort((a, b) => {
      const dateA = new Date(a.show_date).getTime();
      const dateB = new Date(b.show_date).getTime();
      const targetTime = targetDate.getTime();
      const diffA = Math.abs(dateA - targetTime);
      const diffB = Math.abs(dateB - targetTime);
      return diffA - diffB;
    });

    return sortedMovies.slice(0, limit);
  }

  private async generateForTheater(
    theater: Theater,
    movies: Movie[],
    targetDate: Date,
  ): Promise<number> {
    const halls = await this.getHallsForTheater(theater.id);

    // เลือก 4 movies ที่ show_date ใกล้ targetDate มากที่สุด
    const closestMovies = this.getClosestMovies(movies, targetDate, 4);

    this.logger.log(
      `Generating for theater: ${theater.name} - ${halls.length} halls, selected ${closestMovies.length} closest movies for ${format(targetDate, 'yyyy-MM-dd')}`,
    );

    let createdCount = 0;
    const moviesToSchedule = Math.min(closestMovies.length, halls.length);

    for (let i = 0; i < moviesToSchedule; i++) {
      const movie = closestMovies[i];
      const hall = halls[i];

      const existingCount = await this.countExistingShowtimes(hall.id, targetDate);
      if (existingCount > 0) {
        this.logger.log(
          `Skipping hall ${hall.name} - already has ${existingCount} showtimes on ${format(targetDate, 'yyyy-MM-dd')}`,
        );
        continue;
      }

      const count = await this.createShowtimeSlots(movie.id, hall.id, targetDate);
      createdCount += count;
    }

    return createdCount;
  }

  private async getHallsForTheater(theaterId: string): Promise<Hall[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('halls')
      .select('id, theater_id, name')
      .eq('theater_id', theaterId)
      .order('name', { ascending: true })
      .limit(4);  // ใช้แค่ 4 hall ต่อ theater

    if (error) {
      throw new Error(`Failed to fetch halls: ${error.message}`);
    }

    return (data as Hall[]) || [];
  }

  private async countExistingShowtimes(
    hallId: string,
    targetDate: Date,
  ): Promise<number> {
    const supabase = this.supabaseService.getClient();
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    const { count, error } = await supabase
      .from('showtimes')
      .select('*', { count: 'exact', head: true })
      .eq('halls_id', hallId)
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString());

    if (error) {
      this.logger.warn(`Failed to check existing showtimes: ${error.message}`);
      return 0;
    }

    return count || 0;
  }

  private async createShowtimeSlots(
    movieId: string,
    hallId: string,
    targetDate: Date,
  ): Promise<number> {
    const supabase = this.supabaseService.getClient();
    const showtimes = this.generateRandomShowtimes(targetDate);

    const records = showtimes.map((time) => ({
      id: randomUUID(),
      movie_id: movieId,
      halls_id: hallId,
      start_time: time,
      price: this.PRICE,
    }));

    const { error } = await supabase.from('showtimes').insert(records);

    if (error) {
      this.logger.error(`Failed to insert showtimes: ${error.message}`);
      throw new Error(`Failed to create showtimes: ${error.message}`);
    }

    return records.length;
  }

  private generateRandomShowtimes(targetDate: Date): string[] {
    const rounds = this.getRandomInt(this.MIN_ROUNDS, this.MAX_ROUNDS);
    const showtimes: Date[] = [];

    let currentTime = this.getRandomStartTime(targetDate);
    const endLimit = setMinutes(setHours(targetDate, this.END_HOUR), 0);

    for (let i = 0; i < rounds; i++) {
      if (isAfter(currentTime, endLimit)) {
        break;
      }

      showtimes.push(currentTime);

      const gapMinutes = this.getRandomInt(
        this.MIN_GAP_MINUTES,
        this.MAX_GAP_MINUTES,
      );
      currentTime = addMinutes(currentTime, gapMinutes);
    }

    return showtimes.map((time) => format(time, "yyyy-MM-dd'T'HH:mm:ss"));
  }

  private getRandomStartTime(targetDate: Date): Date {
    const baseTime = setHours(targetDate, this.START_HOUR);
    const randomInterval =
      this.MINUTE_INTERVALS[Math.floor(Math.random() * this.MINUTE_INTERVALS.length)];
    return setMinutes(baseTime, randomInterval);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async getActiveMovies(): Promise<Movie[]> {
    const supabase = this.supabaseService.getClient();
    const today = new Date();
    const pastDate = subDays(today, 14);

    const { data, error } = await supabase
      .from('movies')
      .select('id, show_date')
      .gte('show_date', format(pastDate, 'yyyy-MM-dd'))
      .lte('show_date', format(today, 'yyyy-MM-dd'));

    if (error) {
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }

    return (data as Movie[]) || [];
  }

  private async getAllTheaters(): Promise<Theater[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.from('theaters').select('id, name');

    if (error) {
      throw new Error(`Failed to fetch theaters: ${error.message}`);
    }

    return (data as Theater[]) || [];
  }

  async manualGenerateForDate(date?: Date): Promise<number> {
    const targetDate = date ? addDays(date, 14) : addDays(new Date(), 14);
    this.logger.log(
      `Manual generation for: ${format(targetDate, 'yyyy-MM-dd')}`,
    );

    const activeMovies = await this.getActiveMovies();
    const theaters = await this.getAllTheaters();

    let totalCreated = 0;

    for (const theater of theaters) {
      const createdCount = await this.generateForTheater(
        theater,
        activeMovies,
        targetDate,
      );
      totalCreated += createdCount;
    }

    return totalCreated;
  }
}
