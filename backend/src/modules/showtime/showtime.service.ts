import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

@Injectable()
export class ShowtimeService {
  private readonly showtimeDetailSelect = `
    *,
    movies (
      id,
      title,
      description,
      duration,
      genre,
      show_date,
      poster_url,
      created_at,
      link,
      rating,
      trailer_url
    ),
    halls (
      id,
      name,
      theater_id,
      theaters (
        id,
        name,
        locate_part,
        link,
        address,
        google_map_url
      )
    )
  `;

  constructor(private supabaseService: SupabaseService) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    return 'This action adds a new showtime';
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('showtimes')
      .select('*')
      .order('halls_id', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findUpcoming(days = 7) {
    const supabase = this.supabaseService.getClient();
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + days);

    const { data, error } = await supabase
      .from('showtimes')
      .select(this.showtimeDetailSelect)
      .gte('start_time', now.toISOString())
      .lt('start_time', end.toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findByMovie(
    movieId: string,
    options: {
      days?: number;
      from?: string;
      to?: string;
      includePastForDev?: boolean;
    } = {},
  ) {
    const supabase = this.supabaseService.getClient();
    const days =
      Number.isFinite(options.days) && options.days ? options.days : 7;
    const from = options.from ? new Date(options.from) : new Date();
    const to = options.to ? new Date(options.to) : new Date(from);

    if (!options.to) {
      to.setDate(to.getDate() + days);
    }

    const { data, error } = await supabase
      .from('showtimes')
      .select(this.showtimeDetailSelect)
      .eq('movie_id', movieId)
      .gte('start_time', from.toISOString())
      .lt('start_time', to.toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (data?.length || !options.includePastForDev) {
      return data ?? [];
    }

    const { data: latestShowtime, error: latestError } = await supabase
      .from('showtimes')
      .select('start_time')
      .eq('movie_id', movieId)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) {
      throw new InternalServerErrorException(latestError.message);
    }

    if (!latestShowtime?.start_time) {
      return [];
    }

    const latestDate = new Date(latestShowtime.start_time);
    const latestDayStart = new Date(latestDate);
    latestDayStart.setUTCHours(0, 0, 0, 0);
    const latestDayEnd = new Date(latestDayStart);
    latestDayEnd.setUTCDate(latestDayEnd.getUTCDate() + 1);

    const { data: fallbackData, error: fallbackError } = await supabase
      .from('showtimes')
      .select(this.showtimeDetailSelect)
      .eq('movie_id', movieId)
      .gte('start_time', latestDayStart.toISOString())
      .lt('start_time', latestDayEnd.toISOString())
      .order('start_time', { ascending: true });

    if (fallbackError) {
      throw new InternalServerErrorException(fallbackError.message);
    }

    return fallbackData ?? [];
  }

  async findByHall(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('showtimes')
      .select(this.showtimeDetailSelect)
      .order('start_time', { ascending: true })
      .eq('id', id);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    return `This action updates a #${id} showtime`;
  }

  async remove(id: number) {
    return `This action removes a #${id} showtime`;
  }
}
