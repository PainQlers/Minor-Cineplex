import { Body, Controller, Post, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
    async findOne(@Request() req) {
      // const userIdFromToken = req.user.userId;
      const userId = req.user.userId;
      return await this.authService.findOne(userId); // , userIdFromToken
    }

  // Debug endpoint to inspect incoming headers (no auth guard)
  @Get('debug-headers')
  async debugHeaders(@Request() req) {
    return { headers: req.headers };
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(id, updateProfileDto);
  }

}
