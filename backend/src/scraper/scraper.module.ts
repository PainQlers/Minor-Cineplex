import { Module } from '@nestjs/common';
import { SupabaseModule } from '@/libs/supabase/supabase.module';
import { MoviesModule } from '@/movies/movies.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { MajorMoviesScraperService } from './major-movies-scraper.service';
import { ScrapeRunsService } from './scrape-runs.service';
import { ScraperAdminService } from './scraper-admin.service';
import { ScraperController } from './scraper.controller';

@Module({
  imports: [MoviesModule, SupabaseModule],
  controllers: [ScraperController],
  providers: [
    MajorMoviesScraperService,
    ApiKeyGuard,
    ScrapeRunsService,
    ScraperAdminService,
  ],
})
export class ScraperModule {}
