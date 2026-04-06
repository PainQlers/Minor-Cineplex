import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpsertMovieDto } from '@/movies/dto/upsert-movie.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

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

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
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

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
