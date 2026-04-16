import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

@Injectable()
export class SeatService {
  constructor(private supabaseService: SupabaseService) {}
  async create(createSeatDto: CreateSeatDto) {
    return 'This action adds a new seat';
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
        
            const { data, error } = await supabase
              .from('seats')
              .select('*')
              .order('hall_id', { ascending: false });
        
            if (error) {
              throw new InternalServerErrorException(error.message);
            }
        
            return data;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    
        const { data, error } = await supabase
          .from('seats')
          .select('*')
          .eq('hall_id', id)
          .order('seat_number', { ascending: true });
    
        if (error) {
          throw new InternalServerErrorException(error.message);
        }
    
        return data.sort((a, b) => {
      // 1. แยกตัวอักษรและตัวเลขออกจากกัน (เช่น "A10" -> Row: "A", Num: 10)
      const rowA = a.seat_number.match(/[A-Za-z]+/)[0];
      const numA = parseInt(a.seat_number.match(/\d+/)[0]);
      
      const rowB = b.seat_number.match(/[A-Za-z]+/)[0];
      const numB = parseInt(b.seat_number.match(/\d+/)[0]);

      // 2. เรียงแถว (Row) แบบถอยหลัง (E -> A)
      if (rowA !== rowB) {
        return rowB.localeCompare(rowA); 
      }

      // 3. ถ้าแถวเดียวกัน ให้เรียงเลขที่นั่ง (Number) จากน้อยไปมาก (1 -> 10)
      return numA - numB;
    }
      );
  }

  async update(id: number, updateSeatDto: UpdateSeatDto) {
    return `This action updates a #${id} seat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} seat`;
  }
}
