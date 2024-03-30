import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { Request } from 'express';

@Controller('materials')
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  findAll(@Req() request: Request) {
    return this.materialsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body) {
    return this.materialsService.create(body.user, body.material);
  }
}
