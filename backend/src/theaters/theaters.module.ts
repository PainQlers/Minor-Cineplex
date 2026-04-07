import { Module } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { SupabaseModule } from '@/libs/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TheatersController],
  providers: [TheatersService],
})
export class TheatersModule {}
