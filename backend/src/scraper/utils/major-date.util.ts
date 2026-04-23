/**
 * major-date.util.ts - Utility functions สำหรับ parse วันที่จาก Major Cineplex
 * รองรับทั้งรูปแบบไทย (พ.ศ.) และอังกฤษ
 */

// Map แปลงชื่อเดือนเป็นตัวเลข (1-12)
// รองรับทั้งภาษาอังกฤษย่อ (Jan, Feb), ภาษาอังกฤษเต็ม (January), ภาษาไทยย่อ (ม.ค.), และภาษาไทยเต็ม (มกราคม)
const MONTHS: Record<string, number> = {
  // เดือนภาษาอังกฤษ (lowercase เพื่อให้ case-insensitive comparison)
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
  // เดือนภาษาไทย (ทั้งแบบย่อและเต็ม)
  'ม.ค.': 1,
  มกราคม: 1,
  'ก.พ.': 2,
  กุมภาพันธ์: 2,
  'มี.ค.': 3,
  มีนาคม: 3,
  'เม.ย.': 4,
  เมษายน: 4,
  'พ.ค.': 5,
  พฤษภาคม: 5,
  'มิ.ย.': 6,
  มิถุนายน: 6,
  'ก.ค.': 7,
  กรกฎาคม: 7,
  'ส.ค.': 8,
  สิงหาคม: 8,
  'ก.ย.': 9,
  กันยายน: 9,
  'ต.ค.': 10,
  ตุลาคม: 10,
  'พ.ย.': 11,
  พฤศจิกายน: 11,
  'ธ.ค.': 12,
  ธันวาคม: 12,
};

/**
 * padDatePart - เติมเลข 0 ข้างหน้าให้เป็นสองหลัก
 * ใช้สำหรับแปลงเดือนและวันให้เป็นรูปแบบ "01", "02", ..., "12"
 *
 * @param value - ตัวเลขที่ต้องการ pad (เช่น 1, 2, ..., 9)
 * @returns string ที่มีเลข 0 นำหน้า (เช่น "01", "02", "12")
 */
function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}

/**
 * normalizeYear - แปลงปีจาก พ.ศ. เป็น ค.ศ. และจัดการปีสองหลัก
 *
 * รองรับ:
 * - พ.ศ. (มากกว่า 2400) → ลบ 543 ได้ ค.ศ. (เช่น 2567 → 2024)
 * - ปีสองหลัก (น้อยกว่า 100) → บวก 2000 (เช่น 24 → 2024)
 * - ปีสี่หลัก ค.ศ. → คืนค่าเดิม
 *
 * @param value - ตัวเลขปีที่ต้องการ normalize
 * @returns ปี ค.ศ. สี่หลัก
 */
function normalizeYear(value: number) {
  // ถ้าเป็นพ.ศ. (มากกว่า 2400) ให้ลบ 543 ได้ ค.ศ.
  if (value > 2400) {
    return value - 543;
  }

  // ถ้าเป็นปีสองหลัก (เช่น "24") ให้ถือว่าเป็น ค.ศ. 2000+
  if (value < 100) {
    return 2000 + value;
  }

  // ถ้าเป็นปี ค.ศ. สี่หลักแล้ว คืนค่าเดิม
  return value;
}

/**
 * parseReleaseDate - แปลงวันที่จากรูปแบบต่างๆ เป็น YYYY-MM-DD (ISO Date)
 *
 * รองรับรูปแบบ:
 * - ISO format: "2024-04-09"
 * - Slash format: "09/04/2024" หรือ "09/04/24"
 * - Named month: "9 เม.ค. 2024", "9 มกราคม 2567"
 * - แบบมี label: "Release Date: 9 เม.ย. 2024", "เข้าฉาย 9 เมษายน 2024"
 *
 * @param value - string วันที่ที่ต้องการ parse (อาจเป็น null/undefined)
 * @returns string ในรูปแบบ YYYY-MM-DD หรือ undefined ถ้า parse ไม่ได้
 */
export function parseReleaseDate(value?: string | null) {
  // Step 1: Normalize input - ลบคำที่ไม่จำเป็น และทำความสะอาด whitespace
  const normalized = value
    ?.replace(/\s+/g, ' ') // แทนที่ whitespace หลายตัวด้วย space เดียว
    .replace(/release date|date|เข้าฉาย|กำหนดฉาย|วันที่/gi, '') // ลบคำนำหน้าต่างๆ
    .replace(/[:|,]/g, ' ') // แทนที่ : และ , ด้วย space
    .trim(); // ตัด space หน้าและหลัง

  // ถ้าไม่มีข้อมูลเหลือหลัง normalize ให้ return undefined
  if (!normalized) {
    return undefined;
  }

  // Try 1: ISO format YYYY-MM-DD (เช่น "2024-04-09")
  const isoMatch = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (isoMatch) {
    return `${isoMatch[1]}-${padDatePart(Number(isoMatch[2]))}-${padDatePart(
      Number(isoMatch[3]),
    )}`;
  }

  // Try 2: Slash format DD/MM/YYYY หรือ DD/MM/YY (เช่น "09/04/2024" หรือ "09/04/24")
  const slashMatch = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);

  if (slashMatch) {
    const day = Number(slashMatch[1]);
    const month = Number(slashMatch[2]);
    const year = normalizeYear(Number(slashMatch[3]));

    return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
  }

  // Try 3: Named month format (เช่น "9 เม.ค. 2024", "9 January 2024")
  // สร้าง regex จากชื่อเดือนทั้งหมดใน MONTHS object
  const monthNames = Object.keys(MONTHS)
    .sort((a, b) => b.length - a.length) // เรียงจากยาวไปสั้น (เพื่อ match "January" ก่อน "Jan")
    .map((month) => month.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex characters
    .join('|'); // รวมเป็นด้วย | สำหรับ regex alternation

  // สร้าง regex ที่ match: ตัวเลข(วัน) + space + ชื่อเดือน + space + ตัวเลข(ปี)
  const namedMonthMatch = normalized.match(
    new RegExp(`(\\d{1,2})\\s+(${monthNames})\\s+(\\d{2,4})`, 'i'),
  );

  if (namedMonthMatch) {
    const day = Number(namedMonthMatch[1]);
    const month = MONTHS[namedMonthMatch[2].toLowerCase()];
    const year = normalizeYear(Number(namedMonthMatch[3]));

    return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
  }

  // ถ้าไม่ match รูปแบบไหนเลย คืนค่า normalized เดิม (เพื่อ debug)
  return normalized;
}
