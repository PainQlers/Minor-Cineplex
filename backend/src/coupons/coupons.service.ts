import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpsertCouponDto } from './dto/upsert-coupon.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

@Injectable()
export class CouponsService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async create(coupon: CreateCouponDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .insert(coupon)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async search(q?: string) {
    if (!q || !q.trim()) {
      return this.findAll();
    }

    const keyword = q.trim();
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .or(`title.ilike.%${keyword}%,code.ilike.%${keyword}%,short_description.ilike.%${keyword}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findOneById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException('Coupon not found');
    }

    return data;
  }

  async findOneByCode(code: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      throw new NotFoundException('Coupon not found');
    }

    return data;
  }

  async findByStatus(status: 'active' | 'inactive') {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async upsert(coupon: UpsertCouponDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('coupons')
      .upsert(coupon, {
        onConflict: 'code',
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  remove(id: string) {
    return `This action removes a #${id} coupon`;
  }
}
