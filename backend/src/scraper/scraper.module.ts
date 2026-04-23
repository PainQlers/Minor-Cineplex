/**
 * ScraperModule - โมดูลสำหรับ Web Scraping
 * รวบรวม Controller, Service และ Guard ที่เกี่ยวข้องกับการดึงข้อมูลจากเว็บภายนอก
 */

// นำเข้า Module decorator จาก NestJS สำหรับสร้างโมดูล
import { Module } from '@nestjs/common';

// นำเข้า Controller ที่จัดการ HTTP endpoints สำหรับ scraper
import { ScraperController } from './scraper.controller';

// นำเข้า Service ที่มี logic หลักสำหรับ scraping หนังจาก Major Cineplex
import { MajorMoviesScraperService } from './major-movies-scraper.service';

// นำเข้า MoviesModule เพื่อใช้งาน moviesService สำหรับบันทึกข้อมูลลง database
import { MoviesModule } from '@/movies/movies.module';

// นำเข้า Guard ที่ตรวจสอบ API Key (แทน IP-based)
import { ApiKeyGuard } from './guards/api-key.guard';

// นำเข้า Service สำหรับจัดการ scrape runs และ snapshots
import { ScrapeRunsService } from './scrape-runs.service';

// Decorator @Module กำหนด metadata สำหรับโมดูลนี้
@Module({
  imports: [MoviesModule], // นำเข้า MoviesModule เพื่อใช้ service อื่นๆ
  controllers: [ScraperController], // กำหนด Controllers ที่จัดการ HTTP requests
  providers: [MajorMoviesScraperService, ApiKeyGuard, ScrapeRunsService], // กำหนด Services และ Guards ที่ใช้ในโมดูลนี้
})
export class ScraperModule {} // ส่งออก class สำหรับนำไปใช้ใน AppModule
