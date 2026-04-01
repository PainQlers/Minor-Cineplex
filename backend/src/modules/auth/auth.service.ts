import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '@/libs/supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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

      // Use upsert to create or update profile (handles missing profile row)
      this.logger.log('Upserting profile for user:', userId);

      // Try insert first; if duplicate key (race) then update existing row
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, email: dto.email, name: dto.name })
        .select();

      this.logger.log('Profile insert response:', JSON.stringify({ insertedProfile, insertError }, null, 2));

      if (insertError) {
        const msg = insertError?.message || '';
        if (msg.includes('duplicate key')) {
          this.logger.log('Duplicate key on insert, trying update for user:', userId);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ name: dto.name, email: dto.email })
            .eq('id', userId);

          if (updateError) {
            this.logger.error('Profile update fallback error:', updateError.message);
            throw new BadRequestException(`Database error: ${updateError.message}`);
          }
        } else {
          this.logger.error('Profile insert error:', msg);
          throw new BadRequestException(`Database error: ${msg}`);
        }
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

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    try {
      this.logger.log('Starting login for:', dto.email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      this.logger.log('SignIn response:', JSON.stringify({ session: data?.session, user: data?.user }, null, 2));

      if (error) {
        this.logger.error('SignIn error:', error.message);
        throw new BadRequestException(`Auth error: ${error.message}`);
      }

      const session = data.session;
      const user = data.user;

      let profile: { id: string; email: string; name: string | null } | null = null;
      if (user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          this.logger.log('Profile fetch warning:', profileError.message);
        } else {
          profile = profileData;
        }
      }

      return {
        status: 'success',
        message: 'Logged in successfully',
        session,
        user: profile || { id: user?.id, email: user?.email, name: null },
      };
    } catch (error) {
      this.logger.error('Login error:', error);
      throw error;
    }
  }

}
