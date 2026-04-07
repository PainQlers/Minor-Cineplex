import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { type CreateMovieDto } from './dto/create-movie.dto';
// import { type UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }


  @Get('search')
  async search(@Query('q') q?: string) {
    if (q) {
      return this.moviesService.search(q);
    }
  }
  // @Get()
  // async findAll(@Query('title') title?: string) {
  //   console.log('title query =', title);
  //   if (title) {
  //     return this.moviesService.findOneByTitle(title);
  //   }

  //   return this.moviesService.findAll();
  // }

  @Get('title/:title')
  async findOneByTitle(@Param('title') title: string) {
    return this.moviesService.findOneByTitle(title);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.moviesService.findOneById(id);
  }

  @Get()
  async findAll() {
    return this.moviesService.findAll();
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return this.moviesService.update(+id, updateMovieDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
