import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';

@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.materialsService.findAll();
  }
}
