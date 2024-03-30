import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../usersService/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/materials')
  async getMaterials(@Param('id') id: string) {
    return this.usersService.getMaterials(id);
  }

}

