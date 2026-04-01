import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '@/libs/supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(private supabaseService: SupabaseService) {}

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    try {
      this.logger.log('Starting signup for:', dto.email);
      
      // 🔐 1. SignUp ก่อน เพื่อให้ได้ user ID จาก auth.users
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: dto.email,
        password: dto.password,
      });

      this.logger.log('SignUp response:', JSON.stringify({ user: signUpData?.user, error: signUpError?.message }, null, 2));

      if (signUpError) {
        this.logger.error('SignUp error:', signUpError.message);
        throw new BadRequestException(`Auth error: ${signUpError.message}`);
      }

      if (!signUpData?.user?.id) {
        this.logger.error('SignUp succeeded but no user ID returned');
        throw new BadRequestException('SignUp succeeded but no user ID returned');
      }

      const userId = signUpData.user.id;
      this.logger.log('User created in auth.users with ID:', userId);

      // 🧾 2. สร้าง profile ด้วย real user ID จาก auth.users
      this.logger.log('Creating profile for user:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: dto.email,
          name: dto.name,
        })
        .select();

      this.logger.log('Profile insert response:', JSON.stringify({ profileData, profileError }, null, 2));

      if (profileError) {
        this.logger.error('Profile insert error:', profileError.message);
        throw new BadRequestException(`Database error: ${profileError.message}`);
      }

      return {
        status: 'success',
        message: 'User registered successfully',
        user: {
          id: userId,
          email: dto.email,
          name: dto.name,
        },
      };
    } catch (error) {
      this.logger.error('Register error:', error);
      throw error;
    }
  }
}