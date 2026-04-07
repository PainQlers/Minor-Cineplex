import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { SupabaseModule } from '@/libs/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
