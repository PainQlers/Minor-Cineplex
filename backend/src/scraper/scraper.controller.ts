/**
 * ScraperController - จัดการ HTTP endpoints สำหรับ Web Scraping
 * ให้ API สำหรับเรียกให้ระบบ scrape ข้อมูลจากเว็บภายนอก
 */

// นำเข้า decorators จาก NestJS สำหรับสร้าง REST API
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

// นำเข้า Service ที่มี logic การ scrape หนังจาก Major Cineplex
import { MajorMoviesScraperService } from './major-movies-scraper.service';
import { ScraperAdminService } from './scraper-admin.service';
import type { ApplySnapshotsRequest } from './scraper-admin.service';

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
    private readonly scraperAdminService: ScraperAdminService,
  ) {}

  @Get('runs')
  async listRuns(@Query('limit') limit?: string) {
    return this.scraperAdminService.listRuns(limit ? Number(limit) : undefined);
  }

  @Get('runs/:runId/compare')
  async compareRun(
    @Param('runId') runId: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.scraperAdminService.getRunCompare(runId, {
      status,
      q,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Post('runs/:runId/apply')
  async applyRunSnapshots(
    @Param('runId') runId: string,
    @Body() body: ApplySnapshotsRequest,
  ) {
    return this.scraperAdminService.applySnapshots(runId, body);
  }

  /**
   * POST /scraper/major/movies
   * เรียกให้ระบบ scrape หนังทั้งหมดจาก Major Cineplex และบันทึกลง database
   * @returns ผลลัพธ์การ scrape (จำนวนสำเร็จ, ล้มเหลว, ข้อผิดพลาด)
   */
  @Post('major/movies') // กำหนด HTTP POST endpoint ที่ path /major/movies
  async scrapeMajorMovies() {
    // เรียก method ของ service เพื่อเริ่มกระบวนการ scraping และบันทึก snapshots
    return this.majorMoviesScraperService.scrapeAndSaveSnapshots();
  }
}
