import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

@Injectable()
export class HallService {
  constructor(private readonly supabaseService: SupabaseService) { }
  async create(createHallDto: CreateHallDto) {
    return 'This action adds a new hall';
  }

  async findAll() {
    return `This action returns all hall`;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    
        const { data, error } = await supabase
        .from('halls')
        .select('*, theaters(name)')
        .eq('id', id)
        .single();
    
        if (error) {
          throw new NotFoundException('Hall not found');
        }
    
        return data;
  }

  async update(id: number, updateHallDto: UpdateHallDto) {
    return `This action updates a #${id} hall`;
  }

  async remove(id: number) {
    return `This action removes a #${id} hall`;
  }
}
