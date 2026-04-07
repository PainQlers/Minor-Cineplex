import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { CreateTheaterDto } from './dto/create-theater.dto';
// import { UpdateTheaterDto } from './dto/update-theater.dto';
// import { UpsertTheaterDto } from './dto/upsert-theater.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

@Injectable()
export class TheatersService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async findAll() {
    const { data, error } = await this.supabaseService.getClient()
      .from('theaters')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findByName(name: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('theaters')
      .select('*')
      .eq('name', name)
      .order('name', { ascending: true });

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

    const { data, error } = await this.supabaseService.getClient()
      .from('theaters')
      .select('*')
      .or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
      .order('name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findOneById(id: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('theaters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException('Theater not found');
    }

    return data;
  }
}
