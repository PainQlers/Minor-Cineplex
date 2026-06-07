import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SupabaseService } from '@/libs/supabase/supabase.service';
import {
  addDays,
  subDays,
  setHours,
  setMinutes,
  format,
  startOfDay,
  endOfDay,
} from 'date-fns';

interface Movie {
  id: string;
  title?: string | null;
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
  private readonly DAYS_AHEAD = 7;
  private readonly RELEASE_WINDOW_DAYS = 7;
  private readonly SHOWTIME_SLOTS = [
    { hour: 10, minute: 30 },
    { hour: 13, minute: 15 },
    { hour: 16, minute: 0 },
    { hour: 18, minute: 45 },
    { hour: 21, minute: 30 },
  ];

  constructor(private readonly supabaseService: SupabaseService) {}

  async generateDailyShowtimes(
    baseDate = new Date(),
  ): Promise<{ created: number; deleted: number }> {
    this.logger.log('Starting 7-day release-window showtime generation...');

    const today = baseDate;
    const firstDate = startOfDay(today);
    const lastDate = endOfDay(addDays(today, this.DAYS_AHEAD));

    try {
      const deletedCount = await this.deleteOldShowtimes();
      const windowDeletedCount = await this.deleteShowtimesInRange(
        firstDate,
        lastDate,
      );
      this.logger.log(`Deleted ${deletedCount} old showtimes`);
      this.logger.log(
        `Deleted ${windowDeletedCount} showtimes in active booking window`,
      );

      const activeMovies = await this.getBookableMovies(firstDate, lastDate);
      const theaters = await this.getAllTheaters();

      this.logger.log(`Found ${activeMovies.length} bookable movies`);
      this.logger.log(`Found ${theaters.length} theaters`);

      if (activeMovies.length === 0) {
        this.logger.warn('No active movies found, skipping generation');
        return { created: 0, deleted: deletedCount };
      }

      let totalCreated = 0;

      for (let dayOffset = 0; dayOffset <= this.DAYS_AHEAD; dayOffset++) {
        const targetDate = addDays(today, dayOffset);
        const eligibleMovies = this.getMoviesBookableOnDate(
          activeMovies,
          targetDate,
        );

        this.logger.log(
          `Generating showtimes for ${format(targetDate, 'yyyy-MM-dd')} with ${eligibleMovies.length} eligible movies`,
        );

        for (const theater of theaters) {
          const createdCount = await this.generateForTheater(
            theater,
            eligibleMovies,
            targetDate,
            dayOffset,
          );
          totalCreated += createdCount;
        }
      }

      this.logger.log(
        `Successfully created ${totalCreated} showtimes, deleted ${
          deletedCount + windowDeletedCount
        } showtimes`,
      );
      return { created: totalCreated, deleted: deletedCount + windowDeletedCount };
    } catch (error) {
      this.logger.error('Failed to generate showtimes:', error);
      throw error;
    }
  }

  private async deleteOldShowtimes(): Promise<number> {
    const supabase = this.supabaseService.getClient();
    const cutoffDate = startOfDay(new Date());

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

  private async deleteShowtimesInRange(from: Date, to: Date): Promise<number> {
    const supabase = this.supabaseService.getClient();

    const { error, count } = await supabase
      .from('showtimes')
      .delete({ count: 'exact' })
      .gte('start_time', from.toISOString())
      .lte('start_time', to.toISOString());

    if (error) {
      this.logger.error(
        `Failed to delete showtimes in range: ${error.message}`,
      );
      throw new Error(`Failed to delete showtimes in range: ${error.message}`);
    }

    return count || 0;
  }

  private getMoviesBookableOnDate(movies: Movie[], targetDate: Date): Movie[] {
    const targetDay = startOfDay(targetDate).getTime();

    return movies
      .filter((movie) => {
        const releaseDate = this.parseMovieReleaseDate(movie.show_date);

        if (!releaseDate) {
          return false;
        }

        const bookingStart = startOfDay(
          subDays(releaseDate, this.RELEASE_WINDOW_DAYS),
        ).getTime();
        const bookingEnd = endOfDay(
          addDays(releaseDate, this.RELEASE_WINDOW_DAYS),
        ).getTime();

        return targetDay >= bookingStart && targetDay <= bookingEnd;
      })
      .sort((left, right) => {
        const leftRelease =
          this.parseMovieReleaseDate(left.show_date)?.getTime() ?? 0;
        const rightRelease =
          this.parseMovieReleaseDate(right.show_date)?.getTime() ?? 0;
        return leftRelease - rightRelease || left.id.localeCompare(right.id);
      });
  }

  private async generateForTheater(
    theater: Theater,
    movies: Movie[],
    targetDate: Date,
    dayOffset = 0,
  ): Promise<number> {
    const halls = await this.getHallsForTheater(theater.id);

    if (halls.length === 0 || movies.length === 0) {
      return 0;
    }

    const slots = this.getAvailableSlotsForDate(targetDate);
    const capacity = halls.length * slots.length;
    const scheduledMovies = this.rotateMovies(
      movies,
      this.getStableOffset(theater.id, dayOffset, movies.length),
    ).slice(0, capacity);

    this.logger.log(
      `Generating for theater: ${theater.name} - ${halls.length} halls, scheduled ${scheduledMovies.length}/${movies.length} eligible movies for ${format(targetDate, 'yyyy-MM-dd')}`,
    );

    return this.createCoverageShowtimeSlots(
      scheduledMovies,
      halls,
      targetDate,
      slots,
    );
  }

  private rotateMovies(movies: Movie[], offset: number) {
    if (movies.length === 0) {
      return movies;
    }

    const safeOffset = offset % movies.length;
    return [...movies.slice(safeOffset), ...movies.slice(0, safeOffset)];
  }

  private getStableOffset(theaterId: string, dayOffset: number, modulo: number) {
    if (modulo <= 0) {
      return 0;
    }

    const hash = theaterId
      .split('')
      .reduce((total, char) => total + char.charCodeAt(0), 0);
    return (hash + dayOffset) % modulo;
  }

  private async getHallsForTheater(theaterId: string): Promise<Hall[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('halls')
      .select('id, theater_id, name')
      .eq('theater_id', theaterId)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch halls: ${error.message}`);
    }

    return (data as Hall[]) || [];
  }

  private async createCoverageShowtimeSlots(
    movies: Movie[],
    halls: Hall[],
    targetDate: Date,
    slots: typeof this.SHOWTIME_SLOTS,
  ): Promise<number> {
    const supabase = this.supabaseService.getClient();

    const records = movies.map((movie, index) => {
      const hall = halls[index % halls.length];
      const slot = slots[Math.floor(index / halls.length) % slots.length];

      return {
        id: randomUUID(),
        movie_id: movie.id,
        halls_id: hall.id,
        start_time: this.createShowtimeAt(targetDate, slot.hour, slot.minute),
        price: this.PRICE,
      };
    });

    if (records.length === 0) {
      return 0;
    }

    const { error } = await supabase.from('showtimes').insert(records);

    if (error) {
      this.logger.error(`Failed to insert showtimes: ${error.message}`);
      throw new Error(`Failed to create showtimes: ${error.message}`);
    }

    return records.length;
  }

  private getAvailableSlotsForDate(targetDate: Date) {
    const now = new Date();

    return this.SHOWTIME_SLOTS.filter((slot) => {
      const showtime = setMinutes(setHours(targetDate, slot.hour), slot.minute);
      return showtime.getTime() >= now.getTime();
    });
  }

  private createShowtimeAt(targetDate: Date, hour: number, minute: number) {
    const showtime = setMinutes(setHours(targetDate, hour), minute);
    showtime.setSeconds(0, 0);

    return format(
      showtime,
      "yyyy-MM-dd'T'HH:mm:ss",
    );
  }

  private async getBookableMovies(from: Date, to: Date): Promise<Movie[]> {
    const supabase = this.supabaseService.getClient();
    const earliestReleaseDate = subDays(from, this.RELEASE_WINDOW_DAYS);
    const latestReleaseDate = addDays(to, this.RELEASE_WINDOW_DAYS);

    const { data, error } = await supabase
      .from('movies')
      .select('id, title, show_date')
      .or('is_active.is.null,is_active.eq.true')
      .gte('show_date', format(earliestReleaseDate, 'yyyy-MM-dd'))
      .lte('show_date', format(latestReleaseDate, 'yyyy-MM-dd'))
      .order('show_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }

    return (data as Movie[]) || [];
  }

  private parseMovieReleaseDate(value?: string | null): Date | null {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split('T')[0].split('-').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
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
    const targetDate = date ?? new Date();
    this.logger.log(
      `Manual generation for: ${format(targetDate, 'yyyy-MM-dd')}`,
    );

    await this.deleteShowtimesInRange(
      startOfDay(targetDate),
      endOfDay(targetDate),
    );
    const activeMovies = await this.getBookableMovies(targetDate, targetDate);
    const eligibleMovies = this.getMoviesBookableOnDate(
      activeMovies,
      targetDate,
    );
    const theaters = await this.getAllTheaters();

    let totalCreated = 0;

    for (const theater of theaters) {
      const createdCount = await this.generateForTheater(
        theater,
        eligibleMovies,
        targetDate,
      );
      totalCreated += createdCount;
    }

    return totalCreated;
  }
}
