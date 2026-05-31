/**
 * ApiKeyGuard - Guard ที่ตรวจสอบ API Key สำหรับการเข้าถึง Scraper
 *
 * ใช้เพื่อความปลอดภัย: ต้องส่ง API Key ที่ถูกต้องใน header ถึงจะเรียก endpoint scraping ได้
 * ง่ายกว่า IP-based เพราะไม่ต้องกังวลเรื่อง IP ที่เปลี่ยนไปตาม environment (Docker, Cloud, etc.)
 */

// นำเข้า decorators และ types จาก NestJS สำหรับสร้าง Guard
import {
  CanActivate, // Interface ที่ Guard ต้อง implement - มี method canActivate
  ExecutionContext, // ให้ข้อมูล context ของ request ปัจจุบัน
  ForbiddenException, // Exception สำหรับปฏิเสธการเข้าถึง (HTTP 403)
  Injectable, // Decorator บอกว่า class นี้สามารถ inject ได้
} from '@nestjs/common';

// นำเข้า Type ของ Request จาก express สำหรับ type safety
import { Request } from 'express';

// @Injectable() บอก NestJS ว่า class นี้สามารถ inject เป็น dependency ได้
@Injectable()
// implements CanActivate บังคับให้มี method canActivate ที่ return boolean หรือ throw
export class ApiKeyGuard implements CanActivate {
  /**
   * canActivate - ฟังก์ชันหลักที่ NestJS เรียกก่อนเข้า Controller
   *
   * ตรวจสอบ API Key จาก header 'x-api-key'
   * เปรียบเทียบกับ SCRAPER_API_KEY ที่ตั้งไว้ใน .env
   *
   * @param context - ข้อมูล context ของ request ปัจจุบัน
   * @returns true ถ้าอนุญาตให้ผ่าน, throw exception ถ้าปฏิเสธ
   */
  canActivate(context: ExecutionContext) {
    // ดึง request object จาก context โดยบอกว่าเป็น Express Request
    const request = context.switchToHttp().getRequest<Request>();

    // ดึง API Key จาก header 'x-api-key' (case-insensitive)
    const apiKey = request.headers['x-api-key'];

    // ดึง expected API Key จาก environment variable
    const expectedApiKey = process.env.SCRAPER_API_KEY;

    // ถ้าไม่ได้ตั้ง SCRAPER_API_KEY ใน .env ให้ throw error
    // ป้องกันการ deploy โดยลืมตั้งค่า security
    if (!expectedApiKey) {
      throw new ForbiddenException(
        'SCRAPER_API_KEY not configured in environment',
      );
    }

    // ตรวจสอบว่า API Key ที่ส่งมาตรงกับที่ตั้งไว้หรือไม่
    if (apiKey === expectedApiKey) {
      return true; // อนุญาตให้ request ผ่านไปยัง Controller
    }

    // ถ้าไม่มี header หรือ key ไม่ตรง ให้ throw 403 Forbidden
    throw new ForbiddenException('Invalid or missing API Key');
  }
}
