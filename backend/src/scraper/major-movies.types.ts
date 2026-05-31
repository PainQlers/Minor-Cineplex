/**
 * MajorMovieDraft - โครงสร้างข้อมูลหนังดิบที่ scrape ได้จาก Major Cineplex
 * ทุก field เป็น optional + nullable เพราะข้อมูลอาจไม่ครบทุกหนัง
 */
export type MajorMovieDraft = {
  title?: string | null; // ชื่อหนัง (title) - ข้อมูลสำคัญที่สุด
  poster_url?: string | null; // URL รูปภาพ poster ของหนัง
  show_date?: string | null; // วันที่เข้าฉาย (ยังเป็น string ดิบ ยังไม่ได้แปลงเป็น Date)
  genre?: string | null; // ประเภท/แนวหนัง เช่น Action, Drama, Comedy
  duration?: string | null; // ความยาวหนัง เช่น "2 ชม. 15 นาที"
  link?: string | null; // URL หน้ารายละเอียดของหนังบน Major Cineplex
  description?: string | null; // คำอธิบาย/เรื่องย่อของหนัง
  rating?: string | null; // เรตติ้งอายุ เช่น "ทั่วไป", "13+", "18+", "น 15+"
  trailer_url?: string | null; // URL ไฟล์วิดีโอตัวอย่างหนัง (.mp4 หรือ .m3u8)
};

/**
 * MajorMovieScrapeError - เก็บข้อมูลข้อผิดพลาดที่เกิดขึ้นระหว่าง scraping
 * ใช้สำหรับตรวจสอบว่าหนังเรื่องไหนล้มเหลว และด้วยเหตุผลอะไร
 */
export type MajorMovieScrapeError = {
  title?: string | null; // ชื่อหนังที่ล้มเหลว (อาจไม่มีถ้าดึงชื่อไม่ได้)
  link?: string | null; // URL หน้าที่ล้มเหลว (สำหรับ debug)
  message: string; // ข้อความ error อธิบายปัญหา (required field)
};

/**
 * MajorMoviesScrapeResult - ผลลัพธ์การ scrape ทั้งหมดที่ส่งกลับให้ API caller
 * รายงานสถิติการทำงานและข้อผิดพลาดที่พบ
 */
export type MajorMoviesScrapeResult = {
  status: 'success'; // สถานะการทำงาน (success เมื่อระบบทำงานได้แม้มีหนังล้มเหลวบางเรื่อง)
  source: 'majorcineplex'; // แหล่งข้อมูลที่ scrape มา
  fetched: number; // จำนวนหนังที่พบบนหน้า listing (รวมทั้งหมด)
  upserted: number; // จำนวนหนังที่บันทึก/อัพเดตลง database สำเร็จ
  skipped: number; // จำนวนหนังที่ข้าม (ไม่มี title หรือข้อมูลไม่ครบพอที่จะบันทึก)
  failed: number; // จำนวนหนังที่ล้มเหลวในการ scrape detail
  errors: MajorMovieScrapeError[]; // รายการ error รายละเอียดสำหรับหนังที่ล้มเหลว
};
