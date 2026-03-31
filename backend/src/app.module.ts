import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './libs/supabase/supabase.service';
import { MoviesController } from './modules/movies/movies.controller';

@Module({
  imports: [],
  controllers: [AppController, MoviesController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
