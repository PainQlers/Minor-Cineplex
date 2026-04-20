import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { type CreateCouponDto } from '../../src/coupons/dto/create-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }

  // @Post()
  // async create(@Body() createCouponDto: CreateCouponDto) {
  //   return this.couponsService.create(createCouponDto);
  // }

  @Get('search')
  async search(@Query('q') q?: string) {
    if (q) {
      return this.couponsService.search(q);
    }
    return this.couponsService.findAll();
  }

  @Get('code/:code')
  async findOneByCode(@Param('code') code: string) {
    return this.couponsService.findOneByCode(code);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: 'active' | 'inactive') {
    return this.couponsService.findByStatus(status);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.couponsService.findOneById(id);
  }

  @Get()
  async findAll() {
    return this.couponsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
