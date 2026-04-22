import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

@Injectable()
export class ShowtimeService {
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
      .select(
        `
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
      `
      )
      .gte('start_time', now.toISOString())
      .lt('start_time', end.toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findByHall(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('showtimes')
      .select(
        `
        *,
        halls (
          id,
          name,
          theater_id
        ),
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
        )
      `
      )
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
