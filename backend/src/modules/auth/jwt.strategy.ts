import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

console.log('--- JWT Strategy File Loaded ---');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    console.log('--- JwtStrategy Initialized ---');
    super({
      // ดึง Token จาก Header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      // ใส่ JWT Secret จาก Supabase Dashboard (Settings > API)
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')!.replace(/\\n/g, '\n') ,
      algorithms: ['ES256'], 
    });
  }

  // หลังจากตรวจ Token ผ่านแล้ว ฟังก์ชันนี้จะทำงานต่อ
  async validate(payload: any) {
    // payload คือข้อมูลที่อยู่ใน Token
    // return อะไรไป ข้อมูลนั้นจะไปอยู่ที่ req.user ใน Controller
    console.log('Payload from token:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}