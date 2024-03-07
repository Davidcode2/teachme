import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('materials')
export class MaterialsController {

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Material[] {
    return [
      { id: 1, title: 'Material 1', price: 100, author: 'Max Mustermann' },
      { id: 2, title: 'Material 2', price: 150, author: 'Petra Musterfrau' },
      { id: 3, title: 'Material 3', price: 120, author: 'Tom Friedrich' },
    ];
  }

}

class Material {
  id: number;
  title: string;
  price: number;
  author: string; 
}
