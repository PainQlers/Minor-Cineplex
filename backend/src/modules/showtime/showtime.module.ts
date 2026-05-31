import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { SupabaseModule } from '@/libs/supabase/supabase.module';
import { ShowtimeGeneratorService } from './showtime-generator.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ShowtimeController],
  providers: [ShowtimeService, ShowtimeGeneratorService],
})
export class ShowtimeModule {}
