import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../usersService/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/materials')
  async getMaterials(@Param('id') id: string) {
    console.log(id);
    return this.usersService.getMaterials(id);
  }
}

