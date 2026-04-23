/**
 * ScraperController - จัดการ HTTP endpoints สำหรับ Web Scraping
 * ให้ API สำหรับเรียกให้ระบบ scrape ข้อมูลจากเว็บภายนอก
 */

// นำเข้า decorators จาก NestJS สำหรับสร้าง REST API
import { Controller, Post, UseGuards } from '@nestjs/common';

// นำเข้า Service ที่มี logic การ scrape หนังจาก Major Cineplex
import { MajorMoviesScraperService } from './major-movies-scraper.service';

// นำเข้า Guard ที่ตรวจสอบ API Key
import { ApiKeyGuard } from './guards/api-key.guard';

// @Controller('scraper') กำหนด base path ของ endpoint เป็น /scraper
@Controller('scraper')
// @UseGuards(ApiKeyGuard) บังคับใช้ Guard ตรวจสอบ API Key ทุก endpoint ใน controller นี้
// ต้องส่ง header 'x-api-key' ที่ตรงกับ SCRAPER_API_KEY ใน .env
@UseGuards(ApiKeyGuard)
export class ScraperController {
  // Constructor injection: NestJS จะสร้าง instance ของ MajorMoviesScraperService ให้อัตโนมัติ
  // และส่งเข้ามาให้ผ่าน parameter นี้ (Dependency Injection pattern)
  constructor(
    private readonly majorMoviesScraperService: MajorMoviesScraperService,
  ) {}

  /**
   * POST /scraper/major/movies
   * เรียกให้ระบบ scrape หนังทั้งหมดจาก Major Cineplex และบันทึกลง database
   * @returns ผลลัพธ์การ scrape (จำนวนสำเร็จ, ล้มเหลว, ข้อผิดพลาด)
   */
  @Post('major/movies') // กำหนด HTTP POST endpoint ที่ path /major/movies
  async scrapeMajorMovies() {
    // เรียก method ของ service เพื่อเริ่มกระบวนการ scraping ทั้งหมด
    return this.majorMoviesScraperService.scrapeAndUpsertMajorMovies();
  }
}
