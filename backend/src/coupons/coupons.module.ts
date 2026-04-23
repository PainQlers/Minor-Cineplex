import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { SupabaseModule } from '@/libs/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}