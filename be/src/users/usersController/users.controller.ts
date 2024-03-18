import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../usersService/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/materials')
  async getMaterials(@Param('id') id: string) {
    console.log(id);
    return this.usersService.getMaterials(id);
  }

  @Get(':id/cart')
  async getCart(@Param('id') id: string, @Req() req: Request) {
    console.log(req.cookies);
    console.log(req.signedCookies);
    console.log(id);
    return this.usersService.getCartItems(id);
  }

  @Delete(':userId/cart/:materialId')
  async removeItemFromCart(@Param('userId') id: string, @Param('materialId') materialId: string) {
    return this.usersService.removeFromCart(id, materialId);
  }
}

