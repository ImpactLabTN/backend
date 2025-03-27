import { Controller, Get, Post, Body } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Space } from './space.schema';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  async findAll(): Promise<Space[]> {
    return this.spacesService.findAll();
  }

  @Post()
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ): Promise<Space> {
    return this.spacesService.create(name, description, price);
  }
}
