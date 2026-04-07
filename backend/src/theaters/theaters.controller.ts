import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { type CreateTheaterDto } from './dto/create-theater.dto';
import { type UpdateTheaterDto } from './dto/update-theater.dto';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}


  @Get('name')
  async findByName(@Query('name') name?: string) {
    if (name) {
      return this.theatersService.findByName(name);
    }

  }

  @Get('search')
  async search(@Query('q') q?: string) {
    return this.theatersService.search(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.theatersService.findOneById(id);
  }

  @Get()
  async findAll() {
    return this.theatersService.findAll();
  }
}
