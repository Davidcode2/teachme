import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('materials')
export class MaterialsController {
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
