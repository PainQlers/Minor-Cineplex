/**
 * major-movie.mapper.ts - Mapper functions สำหรับแปลงข้อมูลหนังจาก Major Cineplex
 * แปลง MajorMovieDraft (ข้อมูลดิบจาก scraping) เป็น UpsertMovieDto (สำหรับบันทึกลง DB)
 */

// นำเข้า DTO ที่ใช้สำหรับบันทึกข้อมูลหนังลง database
import { UpsertMovieDto } from '@/movies/dto/upsert-movie.dto';

// นำเข้า Type ของข้อมูลหนังดิบที่ scrape ได้
import { MajorMovieDraft } from '../major-movies.types';

// นำเข้า utility สำหรับ parse วันที่
import { parseReleaseDate } from './major-date.util';

/**
 * cleanText - ทำความสะอาดข้อความที่ scrape ได้
 * - แทนที่ whitespace หลายตัวด้วย space เดียว
 * - ตัด space หน้าและหลัง
 * - ถ้าข้อความว่างเปล่าให้ return undefined
 *
 * @param value - ข้อความดิบจาก scraping (อาจเป็น null/undefined)
 * @returns ข้อความที่ทำความสะอาดแล้ว หรือ undefined
 */
function cleanText(value?: string | null) {
  const normalized = value?.replace(/\s+/g, ' ').trim();
  return normalized || undefined;
}

/**
 * cleanPosterUrl - ทำความสะอาด URL รูป poster
 * บางครั้ง URL มี quotes ครอบอยู่ (เช่น '"https://..."') ต้องลบ quotes ออก
 *
 * @param value - URL ดิบจาก scraping
 * @returns URL ที่ทำความสะอาดแล้ว
 */
function cleanPosterUrl(value?: string | null) {
  return cleanText(value)?.replace(/^['"]|['"]$/g, '');
}

/**
 * toMovieUpsertDto - แปลง MajorMovieDraft เป็น UpsertMovieDto
 * ฟังก์ชันหลักที่ใช้แปลงข้อมูลจาก scraping ให้พร้อมบันทึกลง database
 *
 * @param movie - ข้อมูลหนังดิบจาก scraping
 * @returns UpsertMovieDto ที่พร้อมบันทึกลง DB, หรือ null ถ้าไม่มี title
 */
export function toMovieUpsertDto(
  movie: MajorMovieDraft,
): UpsertMovieDto | null {
  // ทำความสะอาด title ก่อน เพราะเป็น required field
  const title = cleanText(movie.title);

  // ถ้าไม่มี title ถือว่าข้อมูลไม่ครบ ไม่บันทึกหนังนี้
  if (!title) {
    return null;
  }

  // สร้างและ return UpsertMovieDto พร้อมทำความสะอาดข้อมูลทุก field
  return {
    title, // ชื่อหนัง (required)
    description: cleanText(movie.description), // เรื่องย่อ
    duration: cleanText(movie.duration), // ความยาวหนัง
    genre: cleanText(movie.genre), // ประเภทหนัง
    show_date: parseReleaseDate(movie.show_date), // วันที่เข้าฉาย (แปลงเป็น YYYY-MM-DD)
    poster_url: cleanPosterUrl(movie.poster_url), // URL รูป poster
    link: cleanText(movie.link), // URL หน้ารายละเอียด
    rating: cleanText(movie.rating), // เรตติ้งอายุ
    trailer_url: cleanText(movie.trailer_url), // URL ตัวอย่างหนัง
  };
}
