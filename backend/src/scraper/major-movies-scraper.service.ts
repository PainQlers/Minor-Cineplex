/**
 * major-movies-scraper.service.ts - Service หลักสำหรับ scraping หนังจาก Major Cineplex
 *
 * ฟังก์ชันหลัก:
 * - scrapeMovieList: ดึงรายการหนังทั้งหมดจากหน้า /movie
 * - enrichMovieDetail: เข้าไปดึงรายละเอียดเพิ่มเติมจากหน้า detail ของแต่ละหนัง (description, rating, trailer)
 * - scrapeAndUpsertMajorMovies: จัดการกระบวนการ scrape และบันทึกลง database
 *
 * ใช้ Playwright สำหรับ automation browser และรองรับ concurrency
 */

// นำเข้า decorators จาก NestJS
import { Injectable, Logger } from '@nestjs/common';

// นำเข้า Playwright สำหรับ browser automation
import { Browser, chromium, Page, Response } from 'playwright';

// นำเข้า MoviesService สำหรับบันทึกข้อมูลลง database
import { MoviesService } from '@/movies/movies.service';

// นำเข้า Type definitions
import { MajorMovieDraft, MajorMoviesScrapeResult } from './major-movies.types';

// นำเข้า mapper สำหรับแปลงข้อมูล
import { toMovieUpsertDto } from './utils/major-movie.mapper';

// ==================== Constants from Environment Variables ====================
// อ่านค่าจาก .env หรือใช้ default ถ้าไม่มี
const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL;
const SOURCE_MOVIES_PATH = process.env.SOURCE_MOVIES_PATH || '/movie';
const SOURCE_MOVIES_URL = `${SOURCE_BASE_URL}${SOURCE_MOVIES_PATH}`;

// User-Agent จำลอง browser จริง (Chrome on Windows)
// ช่วยหลีกเลี่ยงการถูก block โดย server ที่ตรวจจับ bot
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

// การตั้งค่า concurrency และ timeout
// อ่านจาก env หรือใช้ default (5)
const DEFAULT_CONCURRENCY = Number(process.env.SOURCE_SCRAPE_CONCURRENCY) || 5;
const PAGE_TIMEOUT_MS = 60_000; // รอ page load 60 วินาที (สูงเพราะเว็บช้า)
const VIDEO_ADS_TIMEOUT_MS = 15_000; // รอโฆษณา video 15 วินาที
const TRAILER_TIMEOUT_MS = 60_000; // รอ trailer 60 วินาที

@Injectable() // Decorator บอก NestJS ว่า class นี้ inject ได้
export class MajorMoviesScraperService {
  // Logger สำหรับ log ข้อความ debug/warning/error
  private readonly logger = new Logger(MajorMoviesScraperService.name);

  // Constructor injection: NestJS จะสร้าง instance ของ MoviesService ให้อัตโนมัติ
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * scrapeAndUpsertMajorMovies - กระบวนการหลัก: scrape หนังและบันทึกลง database
   *
   * ขั้นตอน:
   * 1. เรียก scrapeMajorMovies() เพื่อดึงรายการหนังทั้งหมดพร้อมรายละเอียด
   * 2. วนลูปบันทึกลง database ทีละเรื่องผ่าน moviesService.upsert()
   * 3. นับสถิติ: upserted, skipped (ไม่มี title), failed (error)
   *
   * @returns ผลลัพธ์การ scrape พร้อมสถิติและ errors
   */
  async scrapeAndUpsertMajorMovies(): Promise<MajorMoviesScrapeResult> {
    // เริ่ม scraping - ดึงรายการหนังทั้งหมดพร้อมรายละเอียด
    const movies = await this.scrapeMajorMovies();

    // สร้าง object ผลลัพธ์เริ่มต้น
    const result: MajorMoviesScrapeResult = {
      status: 'success',
      source: 'majorcineplex',
      fetched: movies.length, // จำนวนหนังที่พบบนหน้า listing
      upserted: 0, // จำนวนที่บันทึกสำเร็จ
      skipped: 0, // จำนวนที่ข้าม (ไม่มี title)
      failed: 0, // จำนวนที่บันทึกล้มเหลว (error)
      errors: [], // รายการ error รายละเอียด
    };

    // วนลูปบันทึกหนังลง database ทีละเรื่อง
    for (const movie of movies) {
      // แปลง MajorMovieDraft เป็น UpsertMovieDto พร้อมทำความสะอาดข้อมูล
      const movieDto = toMovieUpsertDto(movie);

      // ถ้าไม่มี title ถือว่าข้อมูลไม่ครบ ข้ามไป
      if (!movieDto) {
        result.skipped += 1;
        continue;
      }

      try {
        // บันทึก/อัพเดตหนังลง database (upsert = insert ถ้าไม่มี, update ถ้ามี)
        await this.moviesService.upsert(movieDto);
        result.upserted += 1;
      } catch (error) {
        // ถ้าบันทึกล้มเหลว เก็บ error ไว้รายงาน
        result.failed += 1;
        result.errors.push({
          title: movie.title,
          link: movie.link,
          message: this.getErrorMessage(error),
        });
      }
    }

    return result;
  }

  /**
   * scrapeMajorMovies - ดึงรายการหนังทั้งหมดและรายละเอียดของแต่ละเรื่อง
   *
   * ขั้นตอน:
   * 1. Launch browser (headless) - เปิด browser แบบไม่มี UI
   * 2. ดึงรายการหนังจากหน้า listing - ได้ข้อมูลพื้นฐาน (title, poster, date, genre, duration, link)
   * 3. เข้าไปดึงรายละเอียดเพิ่มเติมจากหน้า detail ทีละเรื่อง (concurrency ควบคุมจำนวน parallel)
   *    - description: เรื่องย่อ
   *    - rating: เรตติ้งอายุ
   *    - trailer_url: URL ไฟล์วิดีโอ
   *
   * @returns array ของ MajorMovieDraft ที่มีข้อมูลครบถ้วน
   */
  async scrapeMajorMovies(): Promise<MajorMovieDraft[]> {
    // เปิด browser Chromium แบบ headless (ไม่แสดงหน้าต่าง browser)
    const browser = await chromium.launch({ headless: true });

    try {
      // Step 1: ดึงรายการหนังทั้งหมดจากหน้า https://www.majorcineplex.com/movie
      const movies = await this.scrapeMovieList(browser);

      // ดึงค่า concurrency จาก environment variable หรือใช้ default
      const concurrency = this.getConcurrency();

      // Step 2: ดึงรายละเอียดเพิ่มเติมของแต่ละหนัง (ทำแบบ parallel จำกัดจำนวน)
      // วนลูปทีละ chunk (กลุ่ม) ตาม concurrency
      for (let index = 0; index < movies.length; index += concurrency) {
        // ตัด array เป็น chunk ตาม concurrency (เช่น 5 เรื่องต่อครั้ง)
        const chunk = movies.slice(index, index + concurrency);

        // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกันทั้ง chunk
        await Promise.all(
          chunk.map(async (movie) => {
            // ถ้าไม่มี link ไม่ต้องดึง detail (ข้ามไป)
            if (!movie.link) {
              return;
            }

            // เข้าไปดึงรายละเอียดเพิ่มเติมจากหน้า detail
            await this.enrichMovieDetail(browser, movie);
          }),
        );
      }

      return movies; // คืนค่าหนังทั้งหมดพร้อมข้อมูลครบถ้วน
    } finally {
      // ปิด browser ไม่ว่าจะสำเร็จหรือ error (finally block)
      await browser.close();
    }
  }

  /**
   * scrapeMovieList - ดึงรายการหนังทั้งหมดจากหน้า https://www.majorcineplex.com/movie
   *
   * วิธีการ:
   * 1. เปิด new page ใน browser
   * 2. ไปยัง URL เป้าหมาย รอจนกระทั่ง network idle (ไม่มี request ใหม่)
   * 3. ใช้ page.evaluate() รัน JavaScript ใน browser เพื่อดึงข้อมูลจาก DOM
   *    - querySelectorAll: เลือก elements ที่มี class ต่างๆ
   *    - ดึงข้อมูล: title, poster_url (จาก inline style), show_date, genre, duration, link
   *
   * @param browser - instance ของ Playwright Browser
   * @returns array ของ MajorMovieDraft (ยังไม่มี description, rating, trailer)
   */
  private async scrapeMovieList(browser: Browser): Promise<MajorMovieDraft[]> {
    // สร้าง new page/tab ใน browser
    const page = await browser.newPage();

    try {
      // ไปยังหน้า listing ของ Major Cineplex
      // waitUntil: 'networkidle' = รอจนกระทั่งไม่มี network requests ใหม่ 2 วินาที
      await page.goto(SOURCE_MOVIES_URL, {
        waitUntil: 'networkidle',
        timeout: PAGE_TIMEOUT_MS,
      });

      // รออีก 1 วินาทีให้ JavaScript render เสร็จ (dynamic content)
      await page.waitForTimeout(1000);

      // รัน JavaScript ใน browser context เพื่อดึงข้อมูลจาก DOM
      return await page.evaluate(() => {
        // เลือกทุก item หนังใน list (div ที่มี class ml-box อยู่ใน div.box-movies-list)
        const items = document.querySelectorAll('div.box-movies-list .ml-box');
        const results: MajorMovieDraft[] = [];

        // helper function: ดึง text content และทำความสะอาด whitespace
        const getText = (element: Element | null | undefined) =>
          (element as HTMLElement | null)?.innerText
            .replace(/\s+/g, ' ') // แทนที่ whitespace หลายตัวด้วย space เดียว
            .trim(); // ตัด space หน้าและหลัง

        // วนลูปดึงข้อมูลแต่ละหนัง
        items.forEach((item) => {
          // ดึง poster URL จาก inline style attribute (background-image: url(...))
          const posterStyle = item
            .querySelector('div.mlb-cover')
            ?.getAttribute('style');
          const posterUrl = posterStyle
            ?.match(/url\(["']?(.*?)["']?\)/)?.[1] // extract URL จาก url("...")
            ?.trim();

          // สร้าง object หนังและ push เข้า results array
          results.push({
            title: getText(item.querySelector('div.mlb-name a')), // ชื่อหนัง
            poster_url: posterUrl, // URL รูป poster
            show_date: getText(item.querySelector('div.mlb-date')), // วันที่เข้าฉาย
            genre: getText(
              item.querySelector('div.mlb-genres span:nth-child(1)'), // ประเภทหนัง
            ),
            duration: getText(
              item.querySelector('div.mlb-genres span:nth-child(2)'), // ความยาว
            ),
            link: item
              .querySelector('div.mlbc-btn a.mlbc-btn-mi')
              ?.getAttribute('href'), // URL หน้า detail
          });
        });

        return results; // คืนค่ารายการหนังทั้งหมด
      });
    } finally {
      // ปิด page ไม่ว่าจะสำเร็จหรือ error
      await page.close();
    }
  }

  /**
   * enrichMovieDetail - เข้าไปดึงรายละเอียดเพิ่มเติมจากหน้า detail ของหนัง
   *
   * ดึงข้อมูลเพิ่มเติมที่ไม่มีใน listing:
   * - description: เรื่องย่อหนัง (จาก div.bscb-body p:nth-child(2))
   * - rating: เรตติ้งอายุ (จาก div.icon-row-right b)
   * - trailer_url: URL ไฟล์วิดีโอ (จับจาก network response)
   *
   * วิธีดึง trailer:
   * 1. สร้าง promise รอ response จาก video URL ไว้ก่อน
   * 2. รอดูว่ามี video ads โหลดมาก่อนหรือไม่
   * 3. ถ้าไม่มี ads ให้ click ปุ่มเล่น trailer
   * 4. รอ response ของ trailer แล้วดึง URL
   *
   * @param browser - Playwright Browser instance
   * @param movie - MajorMovieDraft ที่จะเติมข้อมูลเพิ่ม
   */
  private async enrichMovieDetail(browser: Browser, movie: MajorMovieDraft) {
    // สร้าง new browser context กำหนด User-Agent เพื่อจำลอง browser จริง
    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();

    try {
      // ไปยังหน้า detail ของหนัง (ต่อ path link เข้ากับ base URL)
      // waitUntil: 'domcontentloaded' = รอ DOM โหลดเสร็จ (เร็วกว่า networkidle)
      await page.goto(`${SOURCE_BASE_URL}${movie.link}`, {
        waitUntil: 'domcontentloaded',
        timeout: PAGE_TIMEOUT_MS,
      });

      // รอให้หน้าเว็บ render เสร็จ
      await page.waitForTimeout(1000);

      // สร้าง promise รอ response ของ trailer video ไว้ก่อน (ต้องทำก่อน click play)
      const trailerPromise = this.waitForTrailerResponse(page);

      // รอดูว่ามี video ads โหลดมาก่อนหรือไม่ (บางหนังมี ads auto-play)
      const videoAds = await this.waitForVideoAds(page);

      // ถ้าไม่มี ads auto-play ให้ click ปุ่มเล่น trailer เอง
      if (!videoAds) {
        await this.clickTrailerTrigger(page);
      }

      // ดึงข้อมูล description และ rating จาก DOM
      const detail = await page.evaluate(() => {
        // helper function เหมือน scrapeMovieList
        const getText = (element: Element | null | undefined) =>
          (element as HTMLElement | null)?.innerText
            .replace(/\s+/g, ' ')
            .trim();

        return {
          // ดึงเรื่องย่อจาก paragraph ที่ 2 ของ div.bscb-body
          description: getText(
            document.querySelector('div.bscb-body p:nth-child(2)'),
          ),
          // ดึงเรตติ้งจาก b element ใน div.icon-row-right
          rating: getText(document.querySelector('div.icon-row-right b')),
        };
      });

      // เก็บข้อมูลที่ดึงมาได้ลง movie object
      movie.description = detail.description;
      movie.rating = detail.rating;

      // รอให้ promise trailer สำเร็จแล้วดึง URL ของ video file
      const videoResponse = await trailerPromise;
      movie.trailer_url = videoResponse?.url() ?? null; // ถ้าไม่มีให้เป็น null
    } catch (error) {
      // ถ้าเกิด error ให้ log warning แต่ไม่ throw (ให้ scrape หนังอื่นต่อ)
      this.logger.warn(
        `Failed to enrich Major movie detail ${movie.link}: ${this.getErrorMessage(
          error,
        )}`,
      );
      movie.trailer_url = movie.trailer_url ?? null; // กำหนด default เป็น null
    } finally {
      // ปิด context ไม่ว่าจะสำเร็จหรือ error
      await context.close();
    }
  }

  /**
   * clickTrailerTrigger - กดปุ่มเล่น trailer บนหน้า detail
   *
   * Major Cineplex ใช้ YouTube iframe หรือ custom player ที่มี id="ytvideo"
   * ต้องกดเพื่อ trigger การโหลด video
   *
   * @param page - Playwright Page instance
   */
  private async clickTrailerTrigger(page: Page) {
    try {
      // หา element ที่มี id="ytvideo" (trailer player container)
      const trailerTrigger = page.locator('#ytvideo');

      // ถ้าไม่มี element (ไม่มี trailer) ให้ return ไปเลย
      if ((await trailerTrigger.count()) === 0) {
        return;
      }

      // รอให้ player พร้อม
      await page.waitForTimeout(1000);

      // กดที่ player (click ที่ element #ytvideo)
      await trailerTrigger.click({ timeout: 5000 }); // timeout 5 วินาที

      // รอให้ video เริ่มโหลด
      await page.waitForTimeout(1000);
    } catch (error) {
      // ถ้ากดไม่ได้ (อาจไม่มี trailer หรือ click ไม่ติด) log warning แต่ไม่ throw
      this.logger.warn(
        `Failed to click Major trailer trigger: ${this.getErrorMessage(error)}`,
      );
    }
  }

  /**
   * waitForVideoAds - รอ response ที่เป็น video format ทั่วไป
   *
   * บางหนังมี video ads โหลด auto-play ทันทีที่เปิดหน้า
   * function นี้ใช้ตรวจจับว่ามี ads หรือไม่ เพื่อตัดสินใจว่าต้อง click trailer เองหรือไม่
   *
   * @param page - Playwright Page instance
   * @returns Response object ถ้าพบ video, null ถ้า timeout
   */
  private waitForVideoAds(page: Page) {
    return page
      .waitForResponse(
        // ตรวจสอบว่า URL มีนามสกุล video หรือไม่
        (response) =>
          response.url().includes('.mp4') || // MPEG-4 video
          response.url().includes('.m3u8') || // HLS streaming playlist
          response.url().includes('.mpd') || // DASH streaming manifest
          response.url().includes('.webm'), // WebM video format
        { timeout: VIDEO_ADS_TIMEOUT_MS }, // รอ 15 วินาที
      )
      .catch(() => null); // ถ้า timeout ให้ return null แทน throw error
  }

  /**
   * waitForTrailerResponse - รอ response ของ trailer video จาก Source CDN
   *
   * ใช้ CDN ที่อยู่บน c.platform-media.net (สำหรับ Major Cineplex)
   * เมื่อกดเล่น trailer จะมี request ไปยัง URL นี้พร้อมนามสกุล .mp4 หรือ .m3u8
   *
   * @param page - Playwright Page instance
   * @returns Response object ที่มี URL ของ trailer video, หรือ null ถ้า timeout
   */
  private waitForTrailerResponse(page: Page): Promise<Response | null> {
    return page
      .waitForResponse(
        // ตรวจสอบว่า response มาจาก CDN ของ Major และเป็น video file
        (response) =>
          response.url().startsWith('https://c.platform-media.net/') &&
          (response.url().includes('.mp4') || response.url().includes('.m3u8')),
        { timeout: TRAILER_TIMEOUT_MS }, // รอนานหน่อย (60 วินาที) เพราะ video ใหญ่
      )
      .catch(() => null); // ถ้า timeout (ไม่มี trailer) return null
  }

  /**
   * getConcurrency - ดึงค่า concurrency จาก environment variable
   *
   * อ่านค่า MAJOR_SCRAPE_CONCURRENCY จาก env ถ้ามี
   * ถ้าไม่มีหรือไม่ใช่ตัวเลขบวก ให้ใช้ DEFAULT_CONCURRENCY (5)
   *
   * concurrency คือจำนวน parallel requests ที่จะดึงพร้อมกัน
   * ค่าสูง = เร็วขึ้นแต่กินทรัพยากรมาก, ค่าต่ำ = ช้าขึ้นแต่เบากับ server
   *
   * @returns จำนวน concurrency ที่ใช้สำหรับ scraping
   */
  private getConcurrency() {
    // อ่านค่าจาก environment variable
    const parsed = Number(process.env.MAJOR_SCRAPE_CONCURRENCY);

    // ตรวจสอบว่าเป็นตัวเลข integer และมากกว่า 0
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }

    // ถ้าไม่ถูกต้อง ใช้ค่า default
    return DEFAULT_CONCURRENCY;
  }

  /**
   * getErrorMessage - แปลง error เป็น string message
   *
   * Type-safe แปลง error ใดๆ เป็น string สำหรับ log หรือ report
   * ถ้าเป็น Error object จะดึง error.message, ถ้าไม่ใช่จะแปลงเป็น String()
   *
   * @param error - error ที่เกิดขึ้น (type: unknown เพราะอาจเป็นอะไรก็ได้)
   * @returns string ข้อความ error
   */
  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
