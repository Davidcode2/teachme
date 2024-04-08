import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../usersService/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/materials')
  async getMaterials(@Param('id') id: string) {
    return this.usersService.getMaterials(id);
  }

}

