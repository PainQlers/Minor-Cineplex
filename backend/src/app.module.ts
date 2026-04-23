import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './libs/supabase/supabase.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { SupabaseModule } from './libs/supabase/supabase.module';
import { TheatersModule } from './theaters/theaters.module';
import { ShowtimeModule } from './modules/showtime/showtime.module';
import { SeatModule } from './modules/seat/seat.module';
import { HallModule } from './modules/hall/hall.module';
import { CouponsModule } from './coupons/coupons.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MoviesModule,
    SupabaseModule,
    TheatersModule,
    ShowtimeModule,
    SeatModule,
    HallModule,
    CouponsModule,
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
