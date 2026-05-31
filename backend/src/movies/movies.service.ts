import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpsertMovieDto } from '@/movies/dto/upsert-movie.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

const MATCH_CHUNK_SIZE = 25;

export type MovieRecord = UpsertMovieDto & {
  id: string;
  created_at?: string;
  is_active?: boolean;
  inactive_at?: string | null;
  inactive_reason?: string | null;
};

@Injectable()
export class MoviesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(movie: CreateMovieDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .insert(movie)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async search(q?: string) {
    if (!q || !q.trim()) {
      return this.findAll();
    }

    const keyword = q.trim();

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .or(
        `title.ilike.%${keyword}%,genre.ilike.%${keyword}%,description.ilike.%${keyword}%`,
      )
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findOneById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException('Movie not found');
    }

    return data;
  }

  async findOneByTitle(title: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('title', title)
      .single();

    if (error) {
      throw new NotFoundException('Movie not found');
    }

    return data;
  }

  async findMatchesByLinksAndTitles(links: string[], titles: string[]) {
    const uniqueLinks = Array.from(new Set(links.filter(Boolean)));
    const uniqueTitles = Array.from(new Set(titles.filter(Boolean)));
    const byId = new Map<string, MovieRecord>();

    for (const linkChunk of this.chunkValues(uniqueLinks, MATCH_CHUNK_SIZE)) {
      const movies = await this.findMoviesByFieldValues('link', linkChunk);
      movies.forEach((movie) => byId.set(movie.id, movie));
    }

    for (const titleChunk of this.chunkValues(uniqueTitles, MATCH_CHUNK_SIZE)) {
      const movies = await this.findMoviesByFieldValues('title', titleChunk);
      movies.forEach((movie) => byId.set(movie.id, movie));
    }

    return Array.from(byId.values());
  }

  async upsertFromSnapshot(movie: UpsertMovieDto) {
    return this.upsert({
      ...movie,
      title: movie.title,
    });
  }

  async markInactive(
    id: string,
    reason = 'Marked inactive from scraper admin',
  ) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .update({
        is_active: false,
        inactive_at: new Date().toISOString(),
        inactive_reason: reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as MovieRecord;
  }

  async upsert(movie: UpsertMovieDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('movies')
      .upsert(movie, {
        onConflict: 'title',
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  // update(id: number, updateMovieDto: UpdateMovieDto) {
  //   return `This action updates a #${id} movie`;
  // }

  remove(id: string) {
    return `This action removes a #${id} movie`;
  }

  private async findMoviesByFieldValues(
    field: 'link' | 'title',
    values: string[],
  ) {
    if (values.length === 0) {
      return [];
    }

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .in(field, values);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []) as MovieRecord[];
  }

  private chunkValues<T>(values: T[], chunkSize: number) {
    const chunks: T[][] = [];

    for (let index = 0; index < values.length; index += chunkSize) {
      chunks.push(values.slice(index, index + chunkSize));
    }

    return chunks;
  }
}
