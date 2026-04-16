import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Post()
  create(@Body() createHallDto: CreateHallDto) {
    return this.hallService.create(createHallDto);
  }

  @Get()
  findAll() {
    return this.hallService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hallService.findOne(id); // หาจาก id hall
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHallDto: UpdateHallDto) {
    return this.hallService.update(+id, updateHallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hallService.remove(+id);
  }
}
