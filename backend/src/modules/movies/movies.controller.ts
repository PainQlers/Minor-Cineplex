// movies.controller.ts
import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../../libs/supabase/supabase.service';

@Controller('movies')
export class MoviesController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  async getMovies() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('movies').select('*');

    if (error) return error;
    return data;
  }
}